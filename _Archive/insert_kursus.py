"""
Buat table kursus + biasiswa_kursus dan populate links.
Run: python insert_kursus.py
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

CREATE_KURSUS = """
CREATE TABLE IF NOT EXISTS kursus (
    id          SERIAL PRIMARY KEY,
    kod         VARCHAR(20) UNIQUE NOT NULL,
    nama        VARCHAR(200) NOT NULL,
    bidang      VARCHAR(100),
    holland     VARCHAR(20)
);
"""

CREATE_BIASISWA_KURSUS = """
CREATE TABLE IF NOT EXISTS biasiswa_kursus (
    id          SERIAL PRIMARY KEY,
    id_biasiswa VARCHAR(20) NOT NULL REFERENCES biasiswa(id_biasiswa) ON DELETE CASCADE,
    id_kursus   INTEGER NOT NULL REFERENCES kursus(id) ON DELETE CASCADE,
    UNIQUE(id_biasiswa, id_kursus)
);
"""

# Senarai kursus — (kod, nama, bidang, holland)
KURSUS_LIST = [
    # ── Kejuruteraan ──────────────────────────────────────────────────────────
    ("K001", "Kejuruteraan Awam",               "Kejuruteraan", "RIC"),
    ("K002", "Kejuruteraan Elektrik",            "Kejuruteraan", "RIC"),
    ("K003", "Kejuruteraan Elektronik",          "Kejuruteraan", "RIC"),
    ("K004", "Kejuruteraan Mekanikal",           "Kejuruteraan", "RIC"),
    ("K005", "Kejuruteraan Kimia",               "Kejuruteraan", "RIC"),
    ("K006", "Kejuruteraan Petroleum",           "Kejuruteraan", "RIC"),
    ("K007", "Kejuruteraan Komputer",            "Kejuruteraan", "RIC"),
    ("K008", "Kejuruteraan Aeroangkasa",         "Kejuruteraan", "RIC"),
    ("K009", "Kejuruteraan Bioperubatan",        "Kejuruteraan", "RIC"),
    ("K010", "Kejuruteraan Industri",            "Kejuruteraan", "RIC"),
    ("K011", "Kejuruteraan Struktur",            "Kejuruteraan", "RIC"),
    ("K012", "Kejuruteraan Alam Sekitar",        "Kejuruteraan", "RIC"),

    # ── Sains & Teknologi ─────────────────────────────────────────────────────
    ("K013", "Sains Komputer",                   "Sains & Teknologi", "IRC"),
    ("K014", "Teknologi Maklumat",               "Sains & Teknologi", "IRC"),
    ("K015", "Kecerdasan Buatan (AI)",           "Sains & Teknologi", "IRC"),
    ("K016", "Sains Data",                       "Sains & Teknologi", "IRC"),
    ("K017", "Keselamatan Siber",                "Sains & Teknologi", "IRC"),
    ("K018", "Sains Fizik",                      "Sains & Teknologi", "IRC"),
    ("K019", "Sains Kimia",                      "Sains & Teknologi", "IRC"),
    ("K020", "Sains Matematik",                  "Sains & Teknologi", "IRC"),
    ("K021", "Statistik",                        "Sains & Teknologi", "IRC"),
    ("K022", "Bioteknologi",                     "Sains & Teknologi", "IRC"),
    ("K023", "Sains Hayat",                      "Sains & Teknologi", "IRC"),
    ("K024", "Sains Alam Sekitar",               "Sains & Teknologi", "IRC"),
    ("K025", "Fizik Gunaan",                     "Sains & Teknologi", "IRC"),
    ("K026", "Nanoteknologi",                    "Sains & Teknologi", "IRC"),

    # ── Perubatan & Kesihatan ─────────────────────────────────────────────────
    ("K027", "Perubatan (MBBS)",                 "Perubatan & Kesihatan", "ISA"),
    ("K028", "Pergigian",                        "Perubatan & Kesihatan", "ISA"),
    ("K029", "Farmasi",                          "Perubatan & Kesihatan", "ISA"),
    ("K030", "Kejururawatan",                    "Perubatan & Kesihatan", "ISA"),
    ("K031", "Sains Bioperubatan",               "Perubatan & Kesihatan", "ISA"),
    ("K032", "Fisioterapi",                      "Perubatan & Kesihatan", "ISA"),
    ("K033", "Pemakanan & Dietetik",             "Perubatan & Kesihatan", "ISA"),

    # ── Perniagaan & Ekonomi ─────────────────────────────────────────────────
    ("K034", "Perakaunan",                       "Perniagaan & Ekonomi", "CSE"),
    ("K035", "Kewangan",                         "Perniagaan & Ekonomi", "CSE"),
    ("K036", "Ekonomi",                          "Perniagaan & Ekonomi", "CSE"),
    ("K037", "Pentadbiran Perniagaan (BBA)",     "Perniagaan & Ekonomi", "CSE"),
    ("K038", "Pemasaran",                        "Perniagaan & Ekonomi", "CSE"),
    ("K039", "Pengurusan",                       "Perniagaan & Ekonomi", "CSE"),
    ("K040", "Perbankan & Kewangan Islam",       "Perniagaan & Ekonomi", "CSE"),
    ("K041", "Actuarial Science",                "Perniagaan & Ekonomi", "CSE"),
    ("K042", "Logistik & Pengurusan Rantaian",   "Perniagaan & Ekonomi", "CSE"),

    # ── Sains Sosial & Kemanusiaan ────────────────────────────────────────────
    ("K043", "Hubungan Antarabangsa",            "Sains Sosial", "ESA"),
    ("K044", "Sains Politik",                    "Sains Sosial", "ESA"),
    ("K045", "Sosiologi",                        "Sains Sosial", "ESA"),
    ("K046", "Psikologi",                        "Sains Sosial", "ESA"),
    ("K047", "Komunikasi & Media",               "Sains Sosial", "ESA"),
    ("K048", "Pengajian Bahasa Inggeris",        "Sains Sosial", "ASE"),
    ("K049", "Pengajian Bahasa Melayu",          "Sains Sosial", "ASE"),
    ("K050", "Undang-Undang",                    "Sains Sosial", "ESA"),
    ("K051", "Pendidikan",                       "Sains Sosial", "SAI"),
    ("K052", "Sejarah",                          "Sains Sosial", "ASE"),

    # ── Seni & Reka Bentuk ────────────────────────────────────────────────────
    ("K053", "Seni Bina (Architecture)",         "Seni & Reka Bentuk", "ARI"),
    ("K054", "Reka Bentuk Grafik",               "Seni & Reka Bentuk", "AER"),
    ("K055", "Reka Bentuk Dalaman",              "Seni & Reka Bentuk", "AER"),
    ("K056", "Animasi & Multimedia",             "Seni & Reka Bentuk", "AER"),
    ("K057", "Muzik",                            "Seni & Reka Bentuk", "AES"),
    ("K058", "Filem & Televisyen",               "Seni & Reka Bentuk", "AES"),

    # ── Pertanian & Alam Sekitar ──────────────────────────────────────────────
    ("K059", "Sains Pertanian",                  "Pertanian", "RIA"),
    ("K060", "Agroteknologi",                    "Pertanian", "RIA"),
    ("K061", "Sains Perhutanan",                 "Pertanian", "RIA"),
    ("K062", "Sains Perikanan & Akuakultur",     "Pertanian", "RIA"),
    ("K063", "Pengurusan Alam Sekitar",          "Pertanian", "RIA"),
]

# Manual mapping biasiswa → kursus (kod kursus)
BIASISWA_KURSUS_MAP = {
    # JPA PPN (lama)
    "BIA001": ["K001","K002","K003","K004","K005","K006","K007","K008","K013",
               "K014","K015","K016","K019","K020","K022","K034","K036","K043","K050"],
    # JPA LSPM (lama)
    "BIA002": [k[0] for k in KURSUS_LIST],  # semua kursus
    # JPA PKJM (lama)
    "BIA003": ["K001","K002","K003","K004","K005","K006","K007","K008","K013",
               "K014","K034","K035","K036"],
    # MARA YTP
    "BIA004": ["K001","K002","K003","K004","K005","K013","K014","K015","K034","K036"],
    # PETRONAS PESP
    "BIA005": ["K001","K002","K003","K004","K005","K006","K013","K019"],
    # Shell
    "BIA006": ["K001","K002","K003","K004","K005","K006","K013","K019","K034","K036"],
    # Khazanah Watan
    "BIA007": [k[0] for k in KURSUS_LIST],
    # YTN TNB
    "BIA008": ["K001","K002","K003","K004","K007","K013"],
    # Yayasan Pahang
    "BIA009": [k[0] for k in KURSUS_LIST],
    # Yayasan UEM
    "BIA010": ["K001","K002","K003","K004","K005","K013","K053"],
    # Bank Rakyat
    "BIA011": [k[0] for k in KURSUS_LIST],
    # Hong Leong
    "BIA012": [k[0] for k in KURSUS_LIST],
    # YTL Cement
    "BIA013": ["K001","K002","K003","K004","K005","K012","K013"],
    # BNM Pre-U
    "BIA014": ["K034","K035","K036","K041","K037","K040"],
    # BNM Undergraduate
    "BIA015": ["K034","K035","K036","K041","K037","K040","K050","K043"],
    # APU
    "BIA016": ["K013","K014","K015","K016","K017","K037","K038","K054","K056"],
    # Sunway Pre-U
    "BIA017": [k[0] for k in KURSUS_LIST],
    # Genting
    "BIA018": ["K034","K035","K036","K037","K038","K039","K013","K014"],
    # Cagamas
    "BIA019": ["K034","K035","K036","K041","K050"],
    # Sunway Diploma
    "BIA020": [k[0] for k in KURSUS_LIST],
    # Bank Rakyat 2
    "BIA021": [k[0] for k in KURSUS_LIST],
    # APU 2 & 3
    "BIA022": ["K013","K014","K015","K016","K017","K037","K038","K054","K056"],
    "BIA023": ["K013","K014","K015","K016","K017","K037","K038","K054","K056"],
    # PKJM Luar Negara
    "BIA024": ["K001","K002","K003","K004","K005","K006","K007","K008",
               "K013","K034","K035","K036"],
    # PKJM Dalam Negara
    "BIA025": ["K001","K002","K003","K004","K005","K007","K013"],
    # JKPJ Jepun
    "BIA026": ["K001","K002","K003","K004","K005","K007","K008","K013","K019","K025"],
    # JKPJ Korea
    "BIA027": ["K001","K002","K003","K004","K005","K007","K013","K019"],
    # JKPJ Perancis STEM
    "BIA028": ["K001","K002","K003","K004","K005","K007","K008","K013"],
    # JKPJ Perancis Sosial
    "BIA029": ["K043","K044","K036","K039","K037","K050"],
    # JKPJ Jerman
    "BIA030": ["K001","K002","K003","K004","K005","K013","K018","K019","K025"],
    # PPN STEM
    "BIA031": ["K001","K002","K003","K004","K005","K006","K007","K008",
               "K013","K018","K019","K020","K022","K023","K025","K026"],
    # PPN Lain
    "BIA032": ["K034","K035","K036","K037","K039","K041","K043","K044",
               "K045","K046","K047","K050","K051","K022","K023"],
    # LSPM
    "BIA033": [k[0] for k in KURSUS_LIST],
}

def run():
    conn = get_db()
    cur = conn.cursor()

    cur.execute(CREATE_KURSUS)
    cur.execute(CREATE_BIASISWA_KURSUS)
    conn.commit()
    print("Tables kursus & biasiswa_kursus sedia.\n")

    # Insert kursus
    cur.execute("SELECT kod FROM kursus")
    existing_kod = {r[0] for r in cur.fetchall()}
    inserted_kursus = 0
    for kod, nama, bidang, holland in KURSUS_LIST:
        if kod not in existing_kod:
            cur.execute(
                "INSERT INTO kursus (kod, nama, bidang, holland) VALUES (%s,%s,%s,%s)",
                (kod, nama, bidang, holland)
            )
            inserted_kursus += 1
    conn.commit()
    print(f"  {inserted_kursus} kursus ditambah ({len(KURSUS_LIST)} total).\n")

    # Load kursus id by kod
    cur.execute("SELECT kod, id FROM kursus")
    kursus_by_kod = {r[0]: r[1] for r in cur.fetchall()}

    # Insert biasiswa_kursus links
    total = 0
    for id_b, kursus_kods in BIASISWA_KURSUS_MAP.items():
        count = 0
        for kod in kursus_kods:
            if kod not in kursus_by_kod:
                continue
            cur.execute(
                "INSERT INTO biasiswa_kursus (id_biasiswa, id_kursus) VALUES (%s,%s) ON CONFLICT DO NOTHING",
                (id_b, kursus_by_kod[kod])
            )
            count += 1
        print(f"  {id_b} → {count} kursus")
        total += count

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nSelesai! {inserted_kursus} kursus + {total} biasiswa-kursus links dicipta.")

if __name__ == "__main__":
    run()
