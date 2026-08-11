"""
Buat table dokumen_rujukan dan masukkan ringkasan JPA.
Run: python insert_dokumen_rujukan.py
"""
import os, sys
import psycopg2
from dotenv import load_dotenv

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE, ".env"))

DOKUMEN_DIR = os.path.join(BASE, "All Scholarship")

def get_db():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        port=int(os.getenv("PG_PORT", 5432)),
        dbname=os.getenv("PG_DATABASE", "sekolah_5ik"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", ""),
    )

CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS dokumen_rujukan (
    id_dokumen      SERIAL PRIMARY KEY,
    kod             VARCHAR(20) UNIQUE NOT NULL,
    nama_dokumen    VARCHAR(255) NOT NULL,
    penganjur       VARCHAR(100),
    kategori        VARCHAR(50),
    kandungan       TEXT NOT NULL,
    tarikh_kemaskini DATE DEFAULT CURRENT_DATE
);
"""

DOKUMEN = [
    {
        "kod": "DOK_JPA_001",
        "nama_dokumen": "Ringkasan Lengkap Program Penajaan JPA 2025/2026",
        "penganjur": "Jabatan Perkhidmatan Awam (JPA)",
        "kategori": "JPA",
        "fail": os.path.join(DOKUMEN_DIR, "JPA", "JPA_RINGKASAN_LENGKAP.md"),
    },
]

def run():
    conn = get_db()
    cur = conn.cursor()

    # Buat table
    cur.execute(CREATE_TABLE)
    conn.commit()
    print("Table dokumen_rujukan sedia.")

    inserted = 0
    for d in DOKUMEN:
        # Semak jika dah wujud
        cur.execute("SELECT id_dokumen FROM dokumen_rujukan WHERE kod = %s", (d["kod"],))
        if cur.fetchone():
            print(f"  SKIP (dah ada): {d['kod']}")
            continue

        # Baca kandungan fail
        if not os.path.exists(d["fail"]):
            print(f"  ERROR: Fail tidak dijumpai — {d['fail']}")
            continue

        with open(d["fail"], "r", encoding="utf-8") as f:
            kandungan = f.read()

        cur.execute("""
            INSERT INTO dokumen_rujukan (kod, nama_dokumen, penganjur, kategori, kandungan)
            VALUES (%s, %s, %s, %s, %s)
        """, (d["kod"], d["nama_dokumen"], d["penganjur"], d["kategori"], kandungan))

        print(f"  OK: {d['kod']} — {d['nama_dokumen']} ({len(kandungan):,} chars)")
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nSelesai! {inserted} dokumen ditambah.")

if __name__ == "__main__":
    run()
