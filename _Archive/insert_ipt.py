"""
Insert missing IPT into ipt table.
Run: python insert_ipt.py
"""
import os, psycopg2
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

IPT_BARU = [
    # ── Universiti Awam (tambahan) ─────────────────────────────────────────────
    ("Universiti Awam", "UMPSA",   "Universiti Malaysia Pahang Al-Sultan Abdullah"),
    ("Universiti Awam", "UNIMAS",  "Universiti Malaysia Sarawak"),
    ("Universiti Awam", "USIM",    "Universiti Sains Islam Malaysia"),
    ("Universiti Awam", "UniMAP",  "Universiti Malaysia Perlis"),
    ("Universiti Awam", "UMP",     "Universiti Malaysia Pahang"),
    ("Universiti Awam", "UPSI",    "Universiti Pendidikan Sultan Idris"),
    ("Universiti Awam", "UMT",     "Universiti Malaysia Terengganu"),
    ("Universiti Awam", "UMS",     "Universiti Malaysia Sabah"),
    ("Universiti Awam", "UniSZA",  "Universiti Sultan Zainal Abidin"),
    ("Universiti Awam", "UNIMAP",  "Universiti Malaysia Perlis"),

    # ── Universiti Swasta (tambahan) ──────────────────────────────────────────
    ("Universiti Swasta", "UTP",    "Universiti Teknologi PETRONAS"),
    ("Universiti Swasta", "UNITEN", "Universiti Tenaga Nasional"),
    ("Universiti Swasta", "UniKL",  "Universiti Kuala Lumpur"),
    ("Universiti Swasta", "UCSI",   "UCSI University"),
    ("Universiti Swasta", "UTAR",   "Universiti Tunku Abdul Rahman"),
    ("Universiti Swasta", "INTI",   "INTI International University"),
    ("Universiti Swasta", "APU",    "Asia Pacific University of Technology & Innovation"),
    ("Universiti Swasta", "MAHSA",  "MAHSA University"),
    ("Universiti Swasta", "LUCT",   "Limkokwing University of Creative Technology"),
    ("Universiti Swasta", "XMUM",   "Xiamen University Malaysia"),

    # ── Kolej Persediaan / Asasi ──────────────────────────────────────────────
    ("Kolej Persediaan", "INTEC",        "INTEC Education College, Shah Alam"),
    ("Kolej Persediaan", "Asasi UM",     "Pusat Asasi Sains Universiti Malaya"),
    ("Kolej Persediaan", "Asasi UiTM",   "Pusat Asasi UiTM"),
    ("Kolej Persediaan", "Asasi UPM",    "Pusat Asasi Sains Pertanian UPM"),
    ("Kolej Persediaan", "PASUM",        "Pusat Asasi Sains Universiti Malaya"),
    ("Kolej Persediaan", "UniKL-MIIT",   "Universiti Kuala Lumpur — Malaysian Institute of Information Technology"),
    ("Kolej Persediaan", "UniKL-MFI",    "Universiti Kuala Lumpur — Malaysian French Institute"),

    # ── Universiti Luar Negara — UK ───────────────────────────────────────────
    ("Universiti Luar Negara", "Oxford",    "University of Oxford, United Kingdom"),
    ("Universiti Luar Negara", "Cambridge", "University of Cambridge, United Kingdom"),
    ("Universiti Luar Negara", "Imperial",  "Imperial College London, United Kingdom"),
    ("Universiti Luar Negara", "UCL",       "University College London, United Kingdom"),
    ("Universiti Luar Negara", "LSE",       "London School of Economics and Political Science, United Kingdom"),
    ("Universiti Luar Negara", "Manchester","University of Manchester, United Kingdom"),
    ("Universiti Luar Negara", "Edinburgh", "University of Edinburgh, United Kingdom"),
    ("Universiti Luar Negara", "Nottingham","University of Nottingham, United Kingdom"),

    # ── Universiti Luar Negara — USA ──────────────────────────────────────────
    ("Universiti Luar Negara", "MIT",       "Massachusetts Institute of Technology, USA"),
    ("Universiti Luar Negara", "Stanford",  "Stanford University, USA"),
    ("Universiti Luar Negara", "Harvard",   "Harvard University, USA"),
    ("Universiti Luar Negara", "Caltech",   "California Institute of Technology, USA"),
    ("Universiti Luar Negara", "Yale",      "Yale University, USA"),
    ("Universiti Luar Negara", "Columbia",  "Columbia University, USA"),
    ("Universiti Luar Negara", "Cornell",   "Cornell University, USA"),
    ("Universiti Luar Negara", "Princeton", "Princeton University, USA"),
    ("Universiti Luar Negara", "UChicago",  "University of Chicago, USA"),

    # ── Universiti Luar Negara — Eropah ───────────────────────────────────────
    ("Universiti Luar Negara", "ETH Zurich",  "ETH Zurich — Swiss Federal Institute of Technology, Switzerland"),
    ("Universiti Luar Negara", "TU Munich",   "Technical University of Munich, Germany"),
    ("Universiti Luar Negara", "Sciences Po", "Sciences Po Paris, France"),
    ("Universiti Luar Negara", "Grenoble EM", "Grenoble Ecole de Management, France"),
    ("Universiti Luar Negara", "SKEMA",       "SKEMA Business School, France"),
    ("Universiti Luar Negara", "Carl Duisberg","Carl Duisberg Centren GmbH, Germany"),

    # ── Universiti Luar Negara — Jepun ────────────────────────────────────────
    ("Universiti Luar Negara", "UTokyo",      "University of Tokyo, Japan"),
    ("Universiti Luar Negara", "Osaka Univ",  "Osaka University, Japan"),
    ("Universiti Luar Negara", "Tohoku Univ", "Tohoku University, Japan"),
    ("Universiti Luar Negara", "KOSEN",       "National Institute of Technology (KOSEN), Japan"),
    ("Universiti Luar Negara", "Nagoya Univ", "Nagoya University, Japan"),

    # ── Universiti Luar Negara — Korea ────────────────────────────────────────
    ("Universiti Luar Negara", "Seoul Nat'l", "Seoul National University, South Korea"),
    ("Universiti Luar Negara", "KAIST",       "Korea Advanced Institute of Science and Technology, South Korea"),
    ("Universiti Luar Negara", "POSTECH",     "Pohang University of Science and Technology, South Korea"),
    ("Universiti Luar Negara", "Yonsei",      "Yonsei University, South Korea"),
    ("Universiti Luar Negara", "Korea Univ",  "Korea University, South Korea"),

    # ── Universiti Luar Negara — Australia & New Zealand ─────────────────────
    ("Universiti Luar Negara", "ANU",         "Australian National University, Australia"),
    ("Universiti Luar Negara", "Melbourne",   "University of Melbourne, Australia"),
    ("Universiti Luar Negara", "Auckland",    "University of Auckland, New Zealand"),
    ("Universiti Luar Negara", "Otago",       "University of Otago, New Zealand"),
]

def run():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT nama FROM ipt")
    existing = {r[0] for r in cur.fetchall()}

    inserted = 0
    skipped = 0
    for kategori, nama, nama_penuh in IPT_BARU:
        if nama in existing:
            skipped += 1
            continue
        cur.execute(
            "INSERT INTO ipt (kategori, nama, nama_penuh) VALUES (%s, %s, %s)",
            (kategori, nama, nama_penuh)
        )
        print(f"  OK: [{kategori}] {nama} — {nama_penuh}")
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nSelesai! {inserted} IPT ditambah, {skipped} skip (dah ada).")

if __name__ == "__main__":
    run()
