"""
Buat junction table biasiswa_ipt dan link setiap biasiswa dengan IPT yang sesuai.
Run: python insert_biasiswa_ipt.py
"""
import os, re, psycopg2
from dotenv import load_dotenv

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE, ".env"))

def get_db():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        port=int(os.getenv("PG_PORT", 5432)),
        dbname=os.getenv("PG_DATABASE", "sekolah_5ik"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", ""),
    )

CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS biasiswa_ipt (
    id          SERIAL PRIMARY KEY,
    id_biasiswa VARCHAR(20) NOT NULL REFERENCES biasiswa(id_biasiswa) ON DELETE CASCADE,
    id_ipt      INTEGER NOT NULL REFERENCES ipt(id) ON DELETE CASCADE,
    UNIQUE(id_biasiswa, id_ipt)
);
"""

# Manual mapping untuk kes yang perlu tepat
# Format: { id_biasiswa: [nama_ipt, ...] }
MANUAL_MAP = {
    # PKJM Luar Negara — INTEC + universiti luar negara UK/NZ
    "BIA024": ["INTEC", "Oxford", "Cambridge", "Imperial", "UCL", "Manchester",
               "Edinburgh", "Nottingham", "Auckland", "Otago"],
    # PKJM Dalam Negara
    "BIA025": ["UTP", "UNITEN", "MMU", "UniKL"],
    # JKPJ Jepun
    "BIA026": ["INTEC", "UTokyo", "Osaka Univ", "Tohoku Univ", "KOSEN", "Nagoya Univ"],
    # JKPJ Korea
    "BIA027": ["INTEC", "UniKL-MIIT", "Seoul Nat'l", "KAIST", "POSTECH", "Yonsei", "Korea Univ"],
    # JKPJ Perancis STEM
    "BIA028": ["INTEC", "Grenoble EM", "SKEMA"],
    # JKPJ Perancis Sains Sosial
    "BIA029": ["UniKL-MFI", "Sciences Po", "Grenoble EM", "SKEMA"],
    # JKPJ Jerman
    "BIA030": ["Sunway", "Carl Duisberg", "TU Munich"],
    # PPN STEM
    "BIA031": ["MIT", "Stanford", "Harvard", "Caltech", "Oxford", "Cambridge",
               "Imperial", "UCL", "ETH Zurich", "Princeton", "Yale", "Cornell",
               "Columbia", "UChicago"],
    # PPN Lain
    "BIA032": ["MIT", "Stanford", "Harvard", "Oxford", "Cambridge", "LSE",
               "UCL", "Yale", "Columbia", "Cornell", "Princeton", "UChicago"],
    # LSPM
    "BIA033": ["UM", "UKM", "UPM", "UTM", "USM", "UMPSA", "UUM", "UIAM",
               "UiTM", "UNIMAS", "USIM", "UniMAP", "UTP", "MMU", "UNITEN",
               "UniKL", "Taylors", "UCSI", "Sunway", "UTAR"],
}

# Mapping berdasarkan ipt_kategori untuk biasiswa lama (BIA001-BIA023)
KATEGORI_MAP = {
    "Universiti Awam": None,        # semua UA
    "Universiti Swasta": None,      # semua US
    "Universiti Luar Negara": None, # semua ULN
    "Semua": None,                  # semua
}

def fuzzy_match(senarai_text, ipt_list):
    """Match IPT names from senarai text against ipt table."""
    matched = []
    senarai_lower = senarai_text.lower()
    for ipt_id, nama, nama_penuh, kategori in ipt_list:
        if nama.lower() in senarai_lower or any(w in senarai_lower for w in nama.lower().split() if len(w) > 3):
            matched.append(ipt_id)
        elif nama_penuh and any(w in senarai_lower for w in nama_penuh.lower().split(';') if w.strip()):
            matched.append(ipt_id)
    return list(set(matched))

def run():
    conn = get_db()
    cur = conn.cursor()

    # Buat table
    cur.execute(CREATE_TABLE)
    conn.commit()
    print("Table biasiswa_ipt sedia.\n")

    # Load semua IPT
    cur.execute("SELECT id, nama, nama_penuh, kategori FROM ipt")
    all_ipt = cur.fetchall()
    ipt_by_nama = {r[1]: r[0] for r in all_ipt}
    ipt_by_kategori = {}
    for ipt_id, nama, nama_penuh, kategori in all_ipt:
        ipt_by_kategori.setdefault(kategori, []).append(ipt_id)

    # Load semua biasiswa
    cur.execute("SELECT id_biasiswa, nama_biasiswa, ipt_kategori, ipt_senarai FROM biasiswa ORDER BY id_biasiswa")
    all_biasiswa = cur.fetchall()

    total_linked = 0

    for id_b, nama_b, ipt_kat, ipt_senarai in all_biasiswa:
        ipt_ids = set()

        # Guna manual map dulu jika ada
        if id_b in MANUAL_MAP:
            for nama_ipt in MANUAL_MAP[id_b]:
                if nama_ipt in ipt_by_nama:
                    ipt_ids.add(ipt_by_nama[nama_ipt])

        else:
            # Auto-match dari ipt_senarai text
            if ipt_senarai:
                for ipt_id, nama, nama_penuh, kat in all_ipt:
                    senarai_lower = ipt_senarai.lower()
                    if nama.lower() in senarai_lower:
                        ipt_ids.add(ipt_id)

            # Tambah berdasarkan ipt_kategori jika masih kosong
            if not ipt_ids and ipt_kat:
                for kat_key, kat_ids in ipt_by_kategori.items():
                    if ipt_kat and kat_key.lower() in ipt_kat.lower():
                        ipt_ids.update(kat_ids)

            # Jika "Semua" — link ke semua UA + US
            if ipt_kat and "semua" in ipt_kat.lower():
                for kat in ["Universiti Awam", "Universiti Swasta"]:
                    ipt_ids.update(ipt_by_kategori.get(kat, []))

        if not ipt_ids:
            print(f"  WARN (tiada match): {id_b} | {nama_b[:50]}")
            continue

        # Insert links
        count = 0
        for ipt_id in ipt_ids:
            try:
                cur.execute(
                    "INSERT INTO biasiswa_ipt (id_biasiswa, id_ipt) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (id_b, ipt_id)
                )
                count += 1
            except Exception as e:
                print(f"    ERR: {e}")

        print(f"  {id_b} | {nama_b[:45]:<45} → {count} IPT")
        total_linked += count

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nSelesai! {total_linked} biasiswa-IPT links dicipta.")

if __name__ == "__main__":
    run()
