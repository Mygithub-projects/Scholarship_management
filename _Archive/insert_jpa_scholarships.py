"""
Insert JPA Scholarship Programs into biasiswa table.
4 programs: PKJM, JKPJ, PPN, LSPM
Run once: python insert_jpa_scholarships.py
"""
import os, sys, json, re
import psycopg2
import psycopg2.extras
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

def ensure_syarat_tambahan_column(conn):
    """Add syarat_tambahan column if not exists."""
    cur = conn.cursor()
    cur.execute("""
        ALTER TABLE biasiswa
        ADD COLUMN IF NOT EXISTS syarat_tambahan TEXT
    """)
    conn.commit()
    cur.close()

def next_ids(conn, count):
    """Generate next BIA### IDs."""
    cur = conn.cursor()
    cur.execute("SELECT id_biasiswa FROM biasiswa ORDER BY id_biasiswa DESC LIMIT 1")
    row = cur.fetchone()
    cur.close()
    last_num = int(re.sub(r'\D', '', row[0])) if row else 10
    return [f"BIA{last_num + i + 1:03d}" for i in range(count)]

# JPA scholarship entries
# syarat_tambahan: JSON string with subject requirements
STEM_SYARAT = json.dumps({
    "jpa": True,
    "min_grade_by_subject": {
        "A": ["bahasa melayu", "matematik", "matematik tambahan", "fizik", "kimia"],
        "A-": ["bahasa inggeris", "sejarah"]
    }
})
SOSIAL_SYARAT = json.dumps({
    "jpa": True,
    "min_grade_by_subject": {
        "A": ["bahasa melayu", "matematik"],
        "A-": ["bahasa inggeris", "sejarah"]
    }
})
PPN_STEM_SYARAT = json.dumps({
    "jpa": True,
    "min_a_plus_count": 9,
    "required_A_plus": ["bahasa melayu","bahasa inggeris","matematik","sejarah",
                        "matematik tambahan","fizik","kimia"]
})
PPN_LAIN_SYARAT = json.dumps({
    "jpa": True,
    "min_a_plus_count": 8,
    "required_A_plus": ["bahasa melayu","bahasa inggeris","matematik","sejarah"]
})
LSPM_SYARAT = json.dumps({
    "jpa": True,
    "min_a_plus_count": 9
})

JPA_SCHOLARSHIPS = [
    # ── PKJM (Program Khas JPA-MARA) ──────────────────────────────────────────
    {
        "nama_biasiswa": "JPA - Program Khas JPA-MARA (PKJM) - Luar Negara (Jepun/UK/NZ)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi; Perakaunan; Ekonomi; Kewangan",
        "kod_holland_sesuai": "RIC/IRC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "Kolej/Universiti di Jepun; UK; New Zealand; INTEC Education College",
        "syarat_tambahan": STEM_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - Program Khas JPA-MARA (PKJM) - Dalam Negara (UTP/UNITEN/MMU/UniKL)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Dalam Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi",
        "kod_holland_sesuai": "RIC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Swasta",
        "ipt_senarai": "UTP; UNITEN; MMU; UniKL",
        "syarat_tambahan": STEM_SYARAT,
    },

    # ── JKPJ (Program Khas Jepun, Korea, Perancis, Jerman) ────────────────────
    {
        "nama_biasiswa": "JPA - JKPJ Kejuruteraan/S&T Jepun (JKPJ 001/002)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi",
        "kod_holland_sesuai": "RIC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "INTEC Education College; Universiti di Jepun (KOSEN); Colleges of Technology",
        "syarat_tambahan": STEM_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - JKPJ Kejuruteraan/S&T Korea (JKPJ 003/004/005/006)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi",
        "kod_holland_sesuai": "RIC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "INTEC Education College; UniKL-MIIT; Seoul National University; Universiti di Korea",
        "syarat_tambahan": STEM_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - JKPJ Kejuruteraan/S&T Perancis (JKPJ 007/008)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi",
        "kod_holland_sesuai": "RIC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "INTEC Education College; Grand Ecole Perancis; Instituts Universitaire de Technologie (IUT)",
        "syarat_tambahan": STEM_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - JKPJ Sains Sosial Perancis (JKPJ 009)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Sains Sosial; Hubungan Antarabangsa; Ekonomi; Sains Politik; Perniagaan",
        "kod_holland_sesuai": "ESA",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "UniKL-MFI; Sciences Po; Grenoble Ecole de Management; SKEMA Business School",
        "syarat_tambahan": SOSIAL_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - JKPJ Sains & Teknologi Jerman (JKPJ 010)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Luar Negara)",
        "min_a": 7,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Sains dan Teknologi; Kejuruteraan",
        "kod_holland_sesuai": "RIC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "Sunway College; Carl Duisberg GmbH Jerman; Universiti di Jerman",
        "syarat_tambahan": STEM_SYARAT,
    },

    # ── PPN (Program Penajaan Nasional) ───────────────────────────────────────
    {
        "nama_biasiswa": "JPA - Program Penajaan Nasional (PPN) - Kejuruteraan/S&T",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Universiti Terkemuka Dunia QS Top 20)",
        "min_a": 9,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Kejuruteraan; Sains dan Teknologi; Sains Semula Jadi",
        "kod_holland_sesuai": "RIC/IRC",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "MIT; Stanford; Oxford; Cambridge; Imperial College; ETH Zurich; Harvard; UCL; Caltech",
        "syarat_tambahan": PPN_STEM_SYARAT,
    },
    {
        "nama_biasiswa": "JPA - Program Penajaan Nasional (PPN) - Lain-Lain Bidang",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Universiti Terkemuka Dunia QS Top 20)",
        "min_a": 8,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Sains Sosial; Pengurusan; Ekonomi; Perniagaan; Sains Hayat; Kemanusiaan",
        "kod_holland_sesuai": "ESA/SAI",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Luar Negara",
        "ipt_senarai": "MIT; Stanford; Oxford; Cambridge; LSE; Harvard; UCL; Yale; Columbia; Cornell",
        "syarat_tambahan": PPN_LAIN_SYARAT,
    },

    # ── LSPM (Program Khas Lepasan SPM Dalam Negara) ──────────────────────────
    {
        "nama_biasiswa": "JPA - Program Khas Lepasan SPM Dalam Negara (LSPM)",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "Kerajaan",
        "peringkat_pengajian": "Ijazah Pertama (Dalam Negara)",
        "min_a": 9,
        "kategori_pendapatan_layak": "B40, M40, T20",
        "bidang_pengajian": "Semua Bidang",
        "kod_holland_sesuai": "Semua",
        "url_permohonan": "https://penajaan.jpa.gov.my",
        "ipt_kategori": "Universiti Awam, Universiti Swasta",
        "ipt_senarai": "UM; UKM; UPM; UTM; USM; UMPSA; UUM; UIAM; UiTM; UNIMAS; USIM; UniMAP; UTP; MMU; UNITEN; UniKL; Taylor's; UCSI; Sunway; UTAR",
        "syarat_tambahan": LSPM_SYARAT,
    },
]

def run():
    conn = get_db()
    ensure_syarat_tambahan_column(conn)

    # Check which JPA scholarships already exist
    cur = conn.cursor()
    cur.execute("SELECT nama_biasiswa FROM biasiswa WHERE penganjur LIKE '%JPA%'")
    existing = {row[0] for row in cur.fetchall()}
    cur.close()

    to_insert = [s for s in JPA_SCHOLARSHIPS if s["nama_biasiswa"] not in existing]
    if not to_insert:
        print("Semua biasiswa JPA sudah wujud dalam database.")
        conn.close()
        return

    ids = next_ids(conn, len(to_insert))
    cur = conn.cursor()
    inserted = 0
    for bid, s in zip(ids, to_insert):
        cur.execute("""
            INSERT INTO biasiswa (
                id_biasiswa, nama_biasiswa, penganjur, kategori, peringkat_pengajian,
                min_a, kategori_pendapatan_layak, bidang_pengajian,
                kod_holland_sesuai, url_permohonan, ipt_kategori, ipt_senarai,
                syarat_tambahan
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            bid, s["nama_biasiswa"], s["penganjur"], s["kategori"], s["peringkat_pengajian"],
            s["min_a"], s["kategori_pendapatan_layak"], s["bidang_pengajian"],
            s["kod_holland_sesuai"], s["url_permohonan"], s["ipt_kategori"], s["ipt_senarai"],
            s["syarat_tambahan"],
        ))
        print(f"  ✅ {bid}: {s['nama_biasiswa']}")
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nSelesai! {inserted} biasiswa JPA ditambah ke database.")

if __name__ == "__main__":
    run()
