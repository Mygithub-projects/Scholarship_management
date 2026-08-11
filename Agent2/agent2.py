"""
Agent 2: Scholarship Matching
Logic:
  STEP 1 — Filter (layak atau tidak):
    - Bilangan A dalam SPM >= min_a biasiswa
    - Kategori pendapatan layak
    - Bidang pengajian match (jika murid dah set)
  STEP 2 — Rank (antara yang layak):
    - PAJSK score sebagai pembeza utama
    - Bilangan A sebagai tiebreaker
"""

import json, os, requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

BASE   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT = os.path.join(BASE, "Agent2", "matches.json")

load_dotenv(os.path.join(BASE, ".env"))


# ── DB connection ───────────────────────────────────────────
def get_db():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        port=int(os.getenv("PG_PORT", 5432)),
        dbname=os.getenv("PG_DATABASE", "sekolah_5ik"),
        user=os.getenv("PG_USER", "postgres"),
        password=os.getenv("PG_PASSWORD", ""),
    )


# ── Load scholarships from PostgreSQL ──────────────────────
def load_scholarships():
    conn = get_db()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM biasiswa")
    rows = cur.fetchall()

    # Load IPT links
    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute("""
        SELECT bi.id_biasiswa, i.id, i.nama, i.nama_penuh, i.kategori
        FROM biasiswa_ipt bi
        JOIN ipt i ON bi.id_ipt = i.id
        ORDER BY bi.id_biasiswa, i.kategori, i.nama
    """)
    ipt_map = {}
    for r in cur2.fetchall():
        ipt_map.setdefault(r["id_biasiswa"], []).append({
            "id": r["id"], "nama": r["nama"],
            "nama_penuh": r["nama_penuh"], "kategori": r["kategori"]
        })

    # Load kursus links
    cur2.execute("""
        SELECT bk.id_biasiswa, k.id, k.kod, k.nama, k.bidang, k.holland
        FROM biasiswa_kursus bk
        JOIN kursus k ON bk.id_kursus = k.id
        ORDER BY bk.id_biasiswa, k.bidang, k.nama
    """)
    kursus_map = {}
    for r in cur2.fetchall():
        kursus_map.setdefault(r["id_biasiswa"], []).append({
            "id": r["id"], "kod": r["kod"],
            "nama": r["nama"], "bidang": r["bidang"], "holland": r["holland"]
        })

    conn.close()
    scholarships = []
    for row in rows:
        syarat_raw = row.get("syarat_tambahan") or ""
        try:
            syarat = json.loads(syarat_raw) if syarat_raw else {}
        except Exception:
            syarat = {}
        bid = row["id_biasiswa"]
        scholarships.append({
            "id":        bid,
            "name":      row["nama_biasiswa"],
            "provider":  row["penganjur"] or "",
            "level":     row["peringkat_pengajian"] or "",
            "min_a":     int(row["min_a"]) if row["min_a"] else 0,
            "income_cat":row["kategori_pendapatan_layak"] or "B40, M40, T20",
            "fields":    row["bidang_pengajian"] or "Semua Bidang",
            "holland":              row["kod_holland_sesuai"] or "Semua",
            "url":                  row["url_permohonan"] or "",
            "ipt_kategori":         row["ipt_kategori"] or "",
            "ipt_senarai":          row["ipt_senarai"] or "",
            "kategoriScholarship":  row["kategori"] or "",
            "syarat_tambahan":      syarat,
            "ipt_list":             ipt_map.get(bid, []),
            "kursus_list":          kursus_map.get(bid, []),
        })
    return scholarships


# ── Load students from PostgreSQL (profil sahaja, bukan SPM) ─
def load_students():
    conn = get_db()
    cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT p.id, p.nama,
               pd.jumlah_pendapatan, pd.kategori_pendapatan,
               ps.peratus AS pajsk_peratus,
               i.kod_holland, i.tafsiran_utama, i.bidang_1, i.bidang_2, i.bidang_3, i.cadangan_kerjaya
        FROM pelajar p
        LEFT JOIN pendapatan_penjaga pd ON p.id = pd.id
        LEFT JOIN pajsk ps ON p.id = ps.id
        LEFT JOIN imk i ON p.id = i.id
    """)
    rows = cur.fetchall()
    conn.close()
    students = []
    for row in rows:
        students.append({
            "id":              row["id"],
            "name":            row["nama"],
            "pajskScore":      float(row["pajsk_peratus"]) if row["pajsk_peratus"] else 0.0,
            "parentCategory":  row["kategori_pendapatan"] or "M40",
            "hollandCode":     row["kod_holland"] or "",
            "hollandTafsiran": row["tafsiran_utama"] or "",
            "hollandBidang1":  row["bidang_1"] or "",
            "hollandBidang2":  row["bidang_2"] or "",
            "hollandBidang3":  row["bidang_3"] or "",
        })
    return students


# ── Eligibility & Scoring ────────────────────────────────────

A_GRADES = {"A+", "A", "A-"}

def count_a_grades(subjects):
    """Count number of A (A+/A/A-) grades from spm subjects list."""
    return sum(1 for s in subjects if s.get("grade","") in A_GRADES)

# Malay↔English bidang keyword mapping for cross-language matching
# Sub-fields of kejuruteraan also include the parent "engineering/kejuruteraan"
# so a scholarship offering broad "Engineering" will match specific sub-fields
_BIDANG_MAP = {
    "mekanikal":    ["mechanical", "mekanikal", "mekanik",   "engineering", "kejuruteraan"],
    "elektrik":     ["electrical", "electric", "elektronik", "engineering", "kejuruteraan"],
    "awam":         ["civil", "awam",                        "engineering", "kejuruteraan"],
    "kimia":        ["chemical", "chemistry", "kimia",       "engineering", "kejuruteraan"],
    "petroleum":    ["petroleum", "oil", "gas",              "engineering", "kejuruteraan"],
    "komputer":     ["computer", "computing", "information technology", "ict", "komputer", "it;", "/ it", "it /"],
    "perniagaan":   ["business", "commerce", "perniagaan"],
    "pengurusan":   ["management", "pengurusan", "business administration"],
    "perakaunan":   ["accounting", "finance", "perakaunan"],
    "kejuruteraan": ["engineering", "kejuruteraan"],
    "perubatan":    ["medicine", "medical", "health science", "perubatan"],
    "undang":       ["law", "legal", "shariah", "undang"],
    "sains":        ["science", "sains"],
    "matematik":    ["mathematics", "statistics", "actuarial", "matematik"],
    "ekonomi":      ["economics", "economy", "ekonomi"],
    "pendidikan":   ["education", "teaching", "pendidikan"],
    "hospitaliti":  ["hospitality", "tourism", "hotel", "hospitaliti"],
    "senibina":     ["architecture", "design", "senibina"],
    "psikologi":    ["psychology", "psikologi"],
    "pertanian":    ["agriculture", "pertanian"],
    "teknologi":    ["technology", "teknologi"],
    "it":           ["information technology", "computer science", "computing", "it;", "/ it"],
}

def check_field_match(student_bidang, scholarship_fields):
    """Check if student's chosen field matches scholarship's offered fields."""
    if not student_bidang:
        return True  # murid belum set bidang — jangan penalti
    sf = scholarship_fields.lower().strip()
    # "semua" anywhere = terbuka untuk semua bidang
    if "semua" in sf or sf in ["all", ""]:
        return True
    sb = student_bidang.lower().strip()
    # Direct substring match
    if sb in sf:
        return True
    # Word-level matching with Malay↔English expansion
    words = [w for w in sb.split() if len(w) > 2]
    for word in words:
        if word in sf:
            return True
        # Try mapped variants
        for malay_key, variants in _BIDANG_MAP.items():
            if word == malay_key or word in malay_key or malay_key in word:
                if any(v in sf for v in variants):
                    return True
    return False

def check_income_eligible(student_category, scholarship_income_cat):
    """Check if student's family income category is eligible."""
    cats = scholarship_income_cat
    if "B40, M40, T20" in cats or cats.strip() == "":
        return True  # tiada syarat pendapatan
    return student_category in cats

# Mapping DB ipt.kategori → terms used in scholarship ipt_kategori column
_IPT_KAT_MAP = {
    "universiti awam":    ["universiti awam"],
    "universiti swasta":  ["universiti swasta"],
    "politeknik":         ["politeknik"],
    "kolej komuniti":     ["politeknik", "kolej komuniti"],
    "matrikulasi":        ["universiti awam"],   # matrik leads to UA
    "form six":           ["universiti awam"],   # stpm leads to UA
    "ipg":                ["ipg"],
    "institut kemahiran": ["universiti awam", "universiti swasta"],
}

def check_ipt_match(student_ipt_kat, student_ipt_nama, scholarship):
    """Check if student's target IPT is accepted by this scholarship."""
    # Student belum pilih IPT — jangan penalti, tunjuk semua
    if not student_ipt_kat:
        return True

    sc_ipt = (scholarship.get("ipt_kategori") or "").lower().strip()
    if not sc_ipt or "semua" in sc_ipt:
        return True

    # Scholarship dari Institusi Pendidikan Swasta — khusus untuk institusi mereka sahaja
    # Hanya relevan jika murid memilih "Universiti Swasta" sebagai kategori IPT
    if scholarship.get("kategoriScholarship", "") == "Institusi Pendidikan Swasta":
        if student_ipt_kat.lower() != "universiti swasta":
            return False  # murid ke KK/Politeknik/UA — bukan untuk IPTS
        if not student_ipt_nama:
            return True   # murid pilih Universiti Swasta tapi belum spesifik — tunjuk semua IPTS
        # Match nama institusi murid dengan ipt_kategori biasiswa
        name_words = [w for w in student_ipt_nama.lower().split() if len(w) > 2]
        return any(w in sc_ipt for w in name_words)

    # Scholarship terbuka — semak kategori IPT murid vs ipt_kategori biasiswa
    kat = student_ipt_kat.lower().strip()
    mapped = _IPT_KAT_MAP.get(kat, [kat])
    return any(m in sc_ipt for m in mapped)


def check_jpa_subjects(student, syarat):
    """
    Check JPA-specific subject-grade requirements.
    syarat: dict from syarat_tambahan JSON
    """
    if not syarat.get("jpa"):
        return True
    spm_subjects = student.get("spmSubjects", [])
    if not spm_subjects:
        return True  # tiada SPM data — jangan penalti, tunjuk sahaja

    # Build subject→grade map (lowercase keys)
    grade_map = {}
    for s in spm_subjects:
        subj = (s.get("subject") or s.get("nama") or "").lower().strip()
        grade = (s.get("grade") or "").strip().upper()
        if subj:
            grade_map[subj] = grade

    GRADE_RANK = {"A+": 5, "A": 4, "A-": 3, "B+": 2, "B": 1, "C+": 0, "C": -1}

    def meets(grade, required_min):
        return GRADE_RANK.get(grade, -99) >= GRADE_RANK.get(required_min, 0)

    # Check min_grade_by_subject (PKJM/JKPJ pattern)
    mbg = syarat.get("min_grade_by_subject", {})
    for required_min, subjects in mbg.items():
        for subj in subjects:
            subj_l = subj.lower()
            # Fuzzy match: check if any key in grade_map contains this subject keyword
            matched_grade = None
            for k, g in grade_map.items():
                if subj_l in k or k in subj_l or any(w in k for w in subj_l.split() if len(w) > 3):
                    matched_grade = g
                    break
            if matched_grade is None:
                continue  # subject tidak dimasukkan — jangan penalti
            if not meets(matched_grade, required_min):
                return False

    # Check min_a_plus_count (PPN/LSPM pattern)
    min_aplus = syarat.get("min_a_plus_count", 0)
    if min_aplus > 0:
        aplus_count = sum(1 for s in spm_subjects if (s.get("grade") or "").strip().upper() == "A+")
        if aplus_count < min_aplus:
            return False

    return True


def check_eligible(student, scholarship):
    """
    STEP 1 — Filter: semua syarat mesti pass.
    """
    # 1. Bilangan A mencukupi
    count_a = student.get("countA", 0)
    if scholarship["min_a"] > 0 and count_a < scholarship["min_a"]:
        return False
    # 2. Kategori pendapatan layak
    if not check_income_eligible(student.get("parentCategory","M40"), scholarship["income_cat"]):
        return False
    # 3. Bidang match (jika murid dah set bidang)
    if not check_field_match(student.get("bidang",""), scholarship["fields"]):
        return False
    # 4. IPT match (jika murid dah pilih IPT)
    if not check_ipt_match(student.get("iptKat",""), student.get("iptNama",""), scholarship):
        return False
    # 5. Syarat tambahan JPA (mata pelajaran spesifik)
    syarat = scholarship.get("syarat_tambahan", {})
    if syarat and not check_jpa_subjects(student, syarat):
        return False
    return True

def grade_to_marks(grade):
    """Convert SPM letter grade to numeric marks (A+ = 18, A = 16, ...)."""
    return {
        "A+": 18, "A": 16, "A-": 14,
        "B+": 12, "B": 10,
        "C+": 8,  "C": 6,
        "D":  4,  "E": 2,  "G": 0,
    }.get(str(grade).strip().upper(), 0)

def spm_academic_score(spm_subjects):
    """
    Calculate SPM academic score (0-90).
    Formula: 5 core subjects + 3 best electives, max 18 marks each = 144 max.
    Normalised to 0-90 range.
    Core subjects: BM, BI, MM, SEJ, PAI/MT (first 5 by highest marks).
    """
    if not spm_subjects:
        return 0.0
    marks = sorted([grade_to_marks(s.get("grade", "")) for s in spm_subjects], reverse=True)
    # Take best 8 subjects (5 core + 3 electives handled by sorted top-8)
    top8 = marks[:8]
    total = sum(top8)
    max_possible = 8 * 18  # 144
    return round((total / max_possible) * 90, 2)

def score_match(student, scholarship):
    """
    STEP 2 — Rank: SPM akademik (90%) + Ko-kurikulum PAJSK (10%).
    Formula: Skor = SPM_score (0-90) + PAJSK_score (0-10)
    Pendapatan keluarga menentukan kelayakan (filter), B40 dapat sedikit keutamaan.
    """
    # Academic score 0-90 (dari SPM subjects jika ada, else guna countA sebagai anggaran)
    spm_subjects = student.get("spmSubjects", [])
    if spm_subjects:
        academic = spm_academic_score(spm_subjects)
    else:
        # Anggaran: setiap A = 16 markah, normalize ke 0-90
        count_a = student.get("countA", 0)
        estimated_total = min(count_a * 16, 8 * 18)
        academic = round((estimated_total / 144) * 90, 2)

    # Co-curricular score 0-10
    pajsk = student.get("pajskScore", 0)  # 0-100
    cocurr = round((pajsk / 100) * 10, 2)

    # Income keutamaan: B40 dapat +2 bonus (dalam had 100)
    income_bonus = 2 if student.get("parentCategory", "M40") == "B40" else 0

    return round(min(100, academic + cocurr + income_bonus), 2)

def holland_match_info(student_holland, scholarship_holland):
    """Return how many of student's 3 Holland codes match scholarship (for display only)."""
    if scholarship_holland.lower() in ["semua", "all", ""]:
        return {"match": 3, "total": 3, "label": "Semua bidang sesuai"}
    sc    = set(student_holland.upper()[:3])
    codes = [set(c.strip()[:3].upper()) for c in scholarship_holland.split("/") if c.strip()]
    if not codes: return {"match": 0, "total": 3, "label": "—"}
    best  = max(len(sc & c) for c in codes)
    label = {3:"Sangat sesuai", 2:"Sesuai", 1:"Kurang sesuai", 0:"Tidak sesuai"}.get(best,"—")
    return {"match": best, "total": 3, "label": label}


# ── Load murid_status (bidang lepas SPM) from DB ────────────
def load_murid_bidang(student_id):
    """Return bidang and ipt info from murid_status table, or empty strings if not set."""
    try:
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT bidang, ipt_id FROM murid_status WHERE id = %s", (student_id,))
        row = cur.fetchone()
        conn.close()
        if row:
            return {"bidang": row["bidang"] or "", "ipt_id": row["ipt_id"]}
    except Exception:
        pass
    return {"bidang": "", "ipt_id": None}


_KATEGORI_PRIORITY = {
    "kerajaan": 0,   # JPA, MARA — paling atas
    "badan berkanun": 1,
    "GLC": 2,
    "korporat": 3,
    "swasta": 4,
    "institusi pendidikan swasta": 5,
}

def _kategori_rank(scholarship):
    """Lower number = higher priority in sort. JPA always first."""
    name = scholarship.get("name", "")
    if "JPA" in name:
        return -1
    kat = scholarship.get("kategoriScholarship", "").lower().strip()
    for key, rank in _KATEGORI_PRIORITY.items():
        if key in kat:
            return rank
    return 9

def sort_key(entry, scholarship_map):
    """Sort key: JPA/Kerajaan dulu → score desc → min_a desc."""
    sch = scholarship_map.get(entry["scholarshipId"], {})
    return (
        _kategori_rank(sch),           # JPA(-1) → Kerajaan(0) → lain dulu
        -entry["totalScore"],          # dalam kategori sama, skor tinggi dulu
        -(sch.get("min_a", 0)),        # syarat lebih ketat dulu
    )

def build_match_entry(student, scholarship):
    """Build a single match result dict using Filter+Rank logic."""
    eligible   = check_eligible(student, scholarship)
    total      = score_match(student, scholarship) if eligible else 0.0
    holland    = holland_match_info(student.get("hollandCode",""), scholarship["holland"])
    return {
        "scholarshipId":   scholarship["id"],
        "scholarshipName": scholarship["name"],
        "provider":        scholarship.get("provider", ""),
        "eligible":        eligible,
        "totalScore":      total,
        "kategori":        scholarship.get("kategoriScholarship", ""),
        "breakdown": {
            "countA":     student.get("countA", 0),
            "minA":       scholarship["min_a"],
            "pajsk":      round(student.get("pajskScore", 0), 2),
        },
        "holland":     holland,
        "url":         scholarship["url"],
        "iptKategori": scholarship.get("ipt_kategori", ""),
        "iptSenarai":  scholarship.get("ipt_senarai", ""),
    }


# ── Main run (all students, bulk) ───────────────────────────
def run(progress_cb=None):
    def log(msg):
        if progress_cb: progress_cb(msg)
        else: print(msg)

    log("Loading student profiles from PostgreSQL...")
    students = load_students()
    log(f"OK {len(students)} students loaded")

    log("Loading scholarship database...")
    scholarships = load_scholarships()
    log(f"OK {len(scholarships)} scholarships loaded")
    log("Strategy: Filter+Rank (no LLM calls needed)")

    all_matches = []
    for student in students:
        # Load post-SPM bidang from murid_status
        status = load_murid_bidang(student["id"])
        student = dict(student)
        student["bidang"]   = status["bidang"]
        # For bulk run, countA comes from DB gpScore approximation
        # (bulk run is for admin reporting, not student-facing matching)
        student["countA"]   = 0  # bulk run without SPM override — countA unknown

        sch_map = {s["id"]: s for s in scholarships}
        student_matches = [build_match_entry(student, s) for s in scholarships]
        student_matches.sort(key=lambda x: sort_key(x, sch_map))
        eligible_top5 = [m for m in student_matches if m["eligible"]][:10]

        all_matches.append({
            "studentId":   student["id"],
            "studentName": student["name"],
            "matches":     student_matches,
            "top5":        eligible_top5 or student_matches[:10],
        })

    output = {
        "agent":             "Agent 2 — Scholarship Matching Agent",
        "mode":              "bulk",
        "totalStudents":     len(students),
        "totalScholarships": len(scholarships),
        "totalMatches":      len(students) * len(scholarships),
        "results":           all_matches,
    }

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    log(f"DONE matches.json saved -> {OUTPUT}")
    return output


# ── On-demand: single student ───────────────────────────────
def run_single(student_id, progress_cb=None):
    """Score ONE student against all scholarships using manually entered SPM results."""
    def log(msg):
        if progress_cb: progress_cb(msg)
        else: print(msg)

    log(f"Loading profile for student {student_id} from PostgreSQL...")
    all_students = load_students()
    student = next((s for s in all_students if s["id"] == student_id), None)
    if not student:
        raise ValueError(f"Student ID '{student_id}' not found in database")
    log(f"OK Found: {student['name']}")

    # Require manually entered SPM results — never use pre-loaded DB grades for matching
    override_file = os.path.join(BASE, "Agent2", f"spm_override_{student_id}.json")
    if not os.path.exists(override_file):
        raise ValueError("SPM_NOT_ENTERED")
    with open(override_file, encoding="utf-8") as f:
        override = json.load(f)

    student    = dict(student)
    spm_subjects           = override.get("subjects", [])
    student["spmSubjects"] = spm_subjects
    student["countA"]      = count_a_grades(spm_subjects)

    # Bidang + IPT: from override file first, fallback to murid_status DB
    murid_db = load_murid_bidang(student_id)
    student["bidang"]  = override.get("bidang",   "") or murid_db["bidang"]
    student["iptKat"]  = override.get("iptKat",   "")
    student["iptNama"] = override.get("iptNama",  "")
    kos         = override.get("kos",         "")
    use_holland = override.get("useHolland",  False)

    # If kos provided, use AI to extract bidang from course name
    if kos and not student["bidang"]:
        log(f"AI extracting bidang from kos: '{kos}'")
        student["bidang"] = extract_bidang_keywords(kos)
        log(f"OK Bidang extracted: '{student['bidang']}'")

    log(f"OK SPM: {student['countA']} A grade(s) from {len(spm_subjects)} subjects | bidang: '{student['bidang']}'")

    log("Loading scholarship database...")
    scholarships = load_scholarships()
    log(f"OK {len(scholarships)} scholarships | running Filter+Rank {'(Holland mode)' if use_holland else ''}...")

    sch_map = {s["id"]: s for s in scholarships}
    student_matches = [build_match_entry(student, s) for s in scholarships]
    if use_holland:
        # Holland mode: sort by Holland match first, then kategori priority, then score
        student_matches.sort(
            key=lambda x: (
                -(x["holland"]["match"] if x["eligible"] else -1),
                sort_key(x, sch_map)[1],   # kategori priority
                -x["totalScore"],
            )
        )
    else:
        student_matches.sort(key=lambda x: sort_key(x, sch_map))
    eligible_top5 = [m for m in student_matches if m["eligible"]][:10]

    # ── Holland plan: kos + IPT + biasiswa per kos ──────────
    holland_plan = []
    ipt_recs     = []

    if not student.get("iptKat"):
        if use_holland:
            # Load IPT list from DB to ground recommendations
            try:
                conn2 = get_db()
                cur2  = conn2.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur2.execute("SELECT nama, nama_penuh, kategori FROM ipt ORDER BY kategori, nama")
                ipts_db = cur2.fetchall()
                conn2.close()
                ipt_list_str = "\n".join(
                    f"- {r['nama']} ({r['kategori']})" + (f": {r['nama_penuh']}" if r['nama_penuh'] else "")
                    for r in ipts_db
                )
            except Exception:
                ipt_list_str = ""

            log("AI: generating kos + IPT plan from Holland profile...")
            kos_ipt_list = recommend_kos_with_ipts(
                student.get("hollandCode",""),
                student.get("hollandTafsiran",""),
                student.get("hollandBidang1",""),
                student.get("hollandBidang2",""),
                student.get("hollandBidang3",""),
                ipt_list_str,
            )
            log(f"OK {len(kos_ipt_list)} kos generated | matching scholarships per kos...")

            # For each kos, match scholarships using that kos bidang
            for k in kos_ipt_list:
                kos_bidang = k.get("bidang","")
                tmp = dict(student)
                tmp["bidang"] = kos_bidang
                matched = [s for s in scholarships if check_eligible(tmp, s)]
                matched.sort(key=lambda s: (_kategori_rank(s), -score_match(tmp, s)))
                kos_scholarships = [{
                    "scholarshipName": s["name"],
                    "provider":        s.get("provider",""),
                    "url":             s.get("url",""),
                } for s in matched[:3]]
                holland_plan.append({
                    "kos":          k.get("kos",""),
                    "bidang":       kos_bidang,
                    "reason":       k.get("reason",""),
                    "ipts":         k.get("ipts", []),
                    "scholarships": kos_scholarships,
                })
            log(f"OK Holland plan built — {len(holland_plan)} kos entries")
        else:
            # Kos path: recommend IPTs + match scholarships for the extracted bidang
            log("AI: getting IPT recommendations for kos path...")
            ipt_recs = recommend_universities(
                student["bidang"],
                student.get("hollandCode",""),
                progress_cb,
                student.get("hollandBidang1",""),
                student.get("hollandBidang2",""),
            )
            log(f"OK {len(ipt_recs)} IPTs recommended")

    # Kos path: build single-row plan if kos was entered
    kos_plan = []
    if not use_holland and kos and ipt_recs:
        kos_scholarships = [{
            "scholarshipName": s["scholarshipName"],
            "provider":        s.get("provider",""),
            "url":             s.get("url",""),
        } for s in eligible_top5[:3]]
        kos_plan = [{
            "kos":          kos,
            "bidang":       student["bidang"],
            "reason":       "",
            "ipts":         ipt_recs,
            "scholarships": kos_scholarships,
        }]

    result = {
        "agent":             "Agent 2 — Scholarship Matching Agent (On-Demand)",
        "mode":              "single",
        "totalStudents":     1,
        "totalScholarships": len(scholarships),
        "totalMatches":      len(scholarships),
        "results": [{
            "studentId":         student["id"],
            "studentName":       student["name"],
            "countA":            student["countA"],
            "bidang":            student["bidang"],
            "matches":           student_matches,
            "top5":              eligible_top5 or student_matches[:10],
            "hollandPlan":       holland_plan,
            "kosPlan":           kos_plan,
            "iptRecommendations": ipt_recs,
        }],
    }

    single_out = os.path.join(BASE, "Agent2", f"matches_{student_id}.json")
    with open(single_out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    log(f"DONE {len(eligible_top5)} eligible scholarships found. Saved -> {single_out}")
    return result


# ── AI: suitable courses from Holland code ───────────────────
def recommend_kos_with_ipts(holland_code, tafsiran="", bidang1="", bidang2="", bidang3="", ipt_list_str=""):
    """Use Groq to suggest 5 kos each with 3 suitable IPTs, based on Holland profile."""
    import re
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return []
    profile_lines = []
    if holland_code:  profile_lines.append(f"Kod Holland: {holland_code}")
    if tafsiran:      profile_lines.append(f"Tafsiran: {tafsiran}")
    if bidang1:       profile_lines.append(f"Bidang utama: {bidang1}")
    if bidang2:       profile_lines.append(f"Bidang kedua: {bidang2}")
    if bidang3:       profile_lines.append(f"Bidang ketiga: {bidang3}")
    profile = "\n".join(profile_lines) if profile_lines else "Profil tidak tersedia"
    prompt = (
        f"Profil psikometri pelajar:\n{profile}\n\n"
        f"Senarai institusi tersedia:\n{ipt_list_str}\n\n"
        "Cadangkan 5 kos diploma atau ijazah yang sesuai. Untuk setiap kos, cadangkan 3 IPT yang menawarkan kos tersebut.\n"
        "Return ONLY a JSON array of exactly 5 objects with keys:\n"
        '  "kos": nama kos dalam Bahasa Malaysia\n'
        '  "bidang": kata kunci bidang dalam Bahasa Malaysia (1-3 patah perkataan)\n'
        '  "reason": 1 ayat pendek kenapa sesuai dengan profil pelajar\n'
        '  "ipts": array of 3 objects each with "nama" (tepat dari senarai institusi) and "kategori"\n'
        "JSON sahaja, tiada teks lain."
    )
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1500,
                "temperature": 0.3,
            },
            timeout=30,
        )
        content = resp.json()["choices"][0]["message"]["content"].strip()
        m = re.search(r'\[.*\]', content, re.DOTALL)
        return json.loads(m.group()) if m else []
    except Exception:
        return []


# ── AI university recommendation ────────────────────────────
def recommend_universities(bidang, holland_code, progress_cb=None, bidang2="", bidang3=""):
    """Use Groq to recommend 5 suitable Malaysian institutions from the ipt DB table."""
    import re
    def log(msg):
        if progress_cb: progress_cb(msg)

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return []

    try:
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT nama, nama_penuh, kategori FROM ipt ORDER BY kategori, nama")
        ipts = cur.fetchall()
        conn.close()
    except Exception:
        return []

    ipt_list = "\n".join(
        f"- {r['nama']} ({r['kategori']})" + (f": {r['nama_penuh']}" if r['nama_penuh'] else "")
        for r in ipts
    )
    bidang_info = bidang or ""
    if bidang2: bidang_info += f", {bidang2}"
    if bidang3: bidang_info += f", {bidang3}"
    prompt = (
        "Anda adalah kaunselor universiti Malaysia.\n"
        f"Bidang pengajian pelajar: {bidang_info or 'Umum'}\n"
        f"Kod Holland pelajar: {holland_code or 'Tidak dinyatakan'}\n\n"
        "Daripada senarai institusi di bawah, cadangkan 5 yang paling sesuai untuk pelajar ini.\n\n"
        f"{ipt_list}\n\n"
        "Return ONLY a JSON array of exactly 5 objects with keys:\n"
        '  "nama": nama tepat dari senarai di atas\n'
        '  "kategori": kategori tepat dari senarai di atas\n'
        '  "reason": 1 ayat pendek dalam Bahasa Malaysia kenapa institusi ini sesuai\n'
        "JSON sahaja, tiada teks lain."
    )
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 500,
                "temperature": 0.2,
            },
            timeout=20,
        )
        content = resp.json()["choices"][0]["message"]["content"].strip()
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            return json.loads(match.group())
        return []
    except Exception:
        return []


# ── AI keyword extraction from free-text course name ────────
def extract_bidang_keywords(kos_text):
    """Use Groq LLM to extract Malay field-of-study keywords from a free-text course name."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return kos_text
    prompt = (
        "You are a Malaysian education field classifier.\n"
        "Given a course/program name, extract the field of study as 1-3 Malay keywords (lowercase).\n"
        "Examples:\n"
        "- Diploma Kejuruteraan Mekanikal → kejuruteraan mekanikal\n"
        "- Bachelor of Computer Science with AI → sains komputer\n"
        "- Nursing and Health Sciences → perubatan sains kesihatan\n"
        "- Business Administration → pengurusan perniagaan\n"
        "- Diploma Teknologi Maklumat → teknologi maklumat\n"
        "- Ijazah Undang-Undang → undang-undang\n"
        f"Course: {kos_text}\n"
        "Reply with ONLY the keyword phrase in Malay (lowercase), nothing else."
    )
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 30,
                "temperature": 0.1,
            },
            timeout=15,
        )
        keyword = resp.json()["choices"][0]["message"]["content"].strip().lower()
        return keyword or kos_text
    except Exception:
        return kos_text


# ── Interest-based search (bidang typed by student) ─────────
def run_interest(student_id, interest, progress_cb=None):
    """Score scholarships using a typed interest string as the bidang override."""
    def log(msg):
        if progress_cb: progress_cb(msg)
        else: print(msg)

    log(f"Loading profile for {student_id} from PostgreSQL...")
    all_students = load_students()
    student = next((s for s in all_students if s["id"] == student_id), None)
    if not student:
        raise ValueError(f"Student ID '{student_id}' not found in database")
    log(f"OK Found: {student['name']}")

    # Use SPM override if available, otherwise countA = 0
    override_file = os.path.join(BASE, "Agent2", f"spm_override_{student_id}.json")
    student = dict(student)
    if os.path.exists(override_file):
        with open(override_file, encoding="utf-8") as f:
            override = json.load(f)
        student["gpScore"]     = override["gpScore"]
        student["spmSubjects"] = override.get("subjects", [])
        student["countA"]      = count_a_grades(student["spmSubjects"])
    else:
        student["countA"] = 0

    # Override bidang with typed interest
    student["bidang"] = interest

    log("Loading scholarship database...")
    scholarships = load_scholarships()
    log(f"OK {len(scholarships)} scholarships | Filter+Rank with bidang='{interest}'")

    student_matches = [build_match_entry(student, s) for s in scholarships]
    sch_map_interest = {s["id"]: s for s in scholarships}
    student_matches.sort(key=lambda x: sort_key(x, sch_map_interest))
    eligible_top5 = [m for m in student_matches if m["eligible"]][:10]

    result = {
        "agent":       "Agent 2 — Interest Search",
        "interest":    interest,
        "studentId":   student["id"],
        "studentName": student["name"],
        "top5":        eligible_top5 or student_matches[:10],
    }

    out = os.path.join(BASE, "Agent2", f"interest_{student_id}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    log(f"DONE {len(eligible_top5)} eligible match(es). Saved -> {out}")
    return result


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 3 and sys.argv[1] == "--single":
        run_single(sys.argv[2])
    elif len(sys.argv) == 4 and sys.argv[1] == "--interest":
        run_interest(sys.argv[2], sys.argv[3])
    else:
        run()
