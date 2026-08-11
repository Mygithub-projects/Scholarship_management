"""
Scholarship Ingestion Agent — LangChain + Groq
Reads biasiswa_master_dataset.csv, uses LLM to extract structured fields,
then inserts into PostgreSQL biasiswa table.
"""

import csv, os, json, re
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE, ".env"))

CSV_FILE = os.path.join(BASE, "Data", "Biasiswa", "biasiswa_master_dataset.csv")

# ── DB ──────────────────────────────────────────────────────────────────────
def get_db():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        port=int(os.getenv("PG_PORT", 5432)),
        dbname=os.getenv("PG_DATABASE", "sekolah_5ik"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", ""),
    )

def next_biasiswa_id(conn):
    """Generate next BIA### id."""
    cur = conn.cursor()
    cur.execute("SELECT id_biasiswa FROM biasiswa ORDER BY id_biasiswa DESC LIMIT 1")
    row = cur.fetchone()
    if not row:
        return "BIA011"
    last_num = int(re.sub(r'\D', '', row[0]))
    return f"BIA{last_num + 1:03d}"

# ── LangChain Extraction Chain ───────────────────────────────────────────────
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY"),
)

EXTRACT_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a scholarship data extraction assistant.
Given a row of scholarship data from a Malaysian CSV dataset, extract and return a clean JSON object.

Rules:
- min_a: Extract the MINIMUM number of A grades (A+ or A) required in SPM.
  Examples: "5A dalam SPM" → 5, "8A" → 8, "7A dalam SPM + CGPA..." → 7,
  "4-5A: 10% | 6A: 20% ..." → 4 (minimum tier), "3A: RM3,000 | 4A..." → 3,
  "STPM/Matrikulasi/Diploma..." (no direct SPM A requirement) → 0,
  "Diploma/Matrikulasi PNGK..." → 0, "5 kredit SPM" → 0 (credits not As).

- kategori_pendapatan: Standardize to one of: "B40", "B40, M40", "B40, M40, T20"
  Examples: "B40" → "B40", "<= RM4,000" → "B40", "<= RM10,000" → "B40, M40",
  "tidak dinyatakan" / "pure merit-based" / "N/A" → "B40, M40, T20"

- lepasan_spm_terus: true if the scholarship is directly for SPM leavers going to pre-university or diploma, false otherwise.

- ipt_kategori: Based on KATEGORI field and scholarship context:
  "Kerajaan" scholarships → "Universiti Awam, Universiti Luar Negara"
  "Korporat" scholarships → "Universiti Awam, Universiti Swasta, Universiti Luar Negara"
  "Institusi Pendidikan Swasta" → use the institution name as the category
  If scholarship covers only specific levels (Diploma/Politeknik) → "Politeknik, Kolej Komuniti"

- bidang_clean: Clean up the bidang field — keep semicolons as separators, remove extra whitespace.

Return ONLY valid JSON, no explanation."""),
    ("human", """CSV Row:
NAMA: {nama}
PENGANJUR: {penganjur}
KATEGORI: {kategori}
PERINGKAT: {peringkat}
LEPASAN_SPM_TERUS: {lepasan_spm}
CGPA_MIN_SPM: {cgpa_min}
KATEGORI_PENDAPATAN: {kat_pendapatan}
BIDANG: {bidang}

Return JSON with these exact keys:
{{
  "min_a": <integer>,
  "kategori_pendapatan": "<string>",
  "lepasan_spm_terus": <boolean>,
  "ipt_kategori": "<string>",
  "bidang_clean": "<string>"
}}""")
])

extraction_chain = EXTRACT_PROMPT | llm | JsonOutputParser()


# ── Main ingestion ────────────────────────────────────────────────────────────
def ingest():
    conn = get_db()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Load existing (nama + peringkat) pairs to avoid duplicates
    cur.execute("SELECT nama_biasiswa, peringkat_pengajian FROM biasiswa")
    existing = {
        (r["nama_biasiswa"].lower().strip(), (r["peringkat_pengajian"] or "").lower().strip())
        for r in cur.fetchall()
    }

    inserted = 0
    skipped  = 0
    errors   = 0

    with open(CSV_FILE, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows   = list(reader)

    print(f"📂 CSV loaded — {len(rows)} rows to process\n")

    for i, row in enumerate(rows, 1):
        nama = row["NAMA_BIASISWA"].strip()
        print(f"[{i}/{len(rows)}] Processing: {nama[:60]}")

        # Skip if nama + peringkat combo already exists
        peringkat = row["PERINGKAT_PENGAJIAN"].strip()
        key = (nama.lower().strip(), peringkat.lower().strip())
        if key in existing:
            print(f"   ⏭  Already exists ({peringkat}) — skipped\n")
            skipped += 1
            continue

        # Skip closed scholarships (TUTUP) — still insert for awareness
        status = row.get("STATUS_PERMOHONAN", "").strip()

        try:
            # LLM extraction
            extracted = extraction_chain.invoke({
                "nama":           nama,
                "penganjur":      row["PENGANJUR"],
                "kategori":       row["KATEGORI"],
                "peringkat":      row["PERINGKAT_PENGAJIAN"],
                "lepasan_spm":    row["LEPASAN_SPM_TERUS"],
                "cgpa_min":       row["CGPA_MIN_SPM"],
                "kat_pendapatan": row["KATEGORI_PENDAPATAN"],
                "bidang":         row["BIDANG_PENGAJIAN"],
            })
            print(f"   🤖 Extracted: min_a={extracted['min_a']}, "
                  f"pendapatan={extracted['kategori_pendapatan']}, "
                  f"lepasan_spm={extracted['lepasan_spm_terus']}")

        except Exception as e:
            print(f"   ❌ LLM error: {e}\n")
            errors += 1
            continue

        # Generate new ID
        new_id = next_biasiswa_id(conn)

        # Build insert values
        tajaan = row.get("TAJAAN_PENUH", "").strip()
        tajaan_clean = tajaan if tajaan not in ("TIDAK_DINYATAKAN", "N/A", "") else None

        url_permohonan = row.get("URL_PERMOHONAN", "").strip()
        if url_permohonan in ("TIDAK_DINYATAKAN", "N/A", ""):
            url_permohonan = row.get("URL_MAKLUMAT_LANJUT", "").strip()

        holland = row.get("KOD_HOLLAND", "").strip()
        if holland in ("N/A", ""):
            holland = "Semua"

        try:
            cur.execute("""
                INSERT INTO biasiswa (
                    id_biasiswa, nama_biasiswa, penganjur, kategori,
                    peringkat_pengajian, min_a, kategori_pendapatan_layak,
                    bidang_pengajian, kod_holland_sesuai, tajaan_penuh,
                    url_permohonan, ipt_kategori
                ) VALUES (
                    %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s
                )
            """, (
                new_id,
                nama,
                row["PENGANJUR"].strip(),
                row["KATEGORI"].strip(),
                row["PERINGKAT_PENGAJIAN"].strip(),
                extracted["min_a"],
                extracted["kategori_pendapatan"],
                extracted["bidang_clean"],
                holland,
                tajaan_clean,
                url_permohonan or None,
                extracted["ipt_kategori"],
            ))
            conn.commit()
            existing.add(key)
            print(f"   ✅ Inserted as {new_id}\n")
            inserted += 1

        except Exception as e:
            conn.rollback()
            print(f"   ❌ DB insert error: {e}\n")
            errors += 1

    conn.close()

    print("=" * 60)
    print(f"✅ Done — {inserted} inserted, {skipped} skipped, {errors} errors")
    print(f"Total biasiswa in DB: {inserted + len(existing)}")


if __name__ == "__main__":
    ingest()
