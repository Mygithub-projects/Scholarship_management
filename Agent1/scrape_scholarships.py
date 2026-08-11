"""
Scraper: Ambil senarai biasiswa terkini dari biasiswa.co/senarai-biasiswa-terkini/
Baca dari table HTML — detect status: OPEN/ONGOING, CS, strikethrough, atau tarikh aktif.
Output: JSON ke stdout — [{name, desc, tutup, tutup_iso, url}, ...]
"""
import sys, json, re, warnings, io, datetime
import requests
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

BASE_URL  = 'https://biasiswa.co/senarai-biasiswa-terkini/'
HEADERS   = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ms-MY,ms;q=0.9,en;q=0.8',
}
MAX_ITEMS = 30

MONTH_MAP = {
    'jan':1,'januari':1,'january':1,
    'feb':2,'februari':2,'february':2,
    'mac':3,'mar':3,'march':3,
    'apr':4,'april':4,
    'mei':5,'may':5,
    'jun':6,'june':6,
    'jul':7,'julai':7,'july':7,
    'ogos':8,'aug':8,'august':8,
    'sep':9,'sept':9,'september':9,
    'okt':10,'oct':10,'oktober':10,'october':10,
    'nov':11,'november':11,
    'dis':12,'dec':12,'disember':12,'december':12,
}

TODAY = datetime.date.today()


def parse_iso(text):
    """Parse date string ke YYYY-MM-DD. Return '' jika gagal."""
    if not text:
        return ''
    text = text.strip()

    # Range: "3 APRIL — 16 APRIL 2026" → ambil tarikh akhir
    m = re.search(r'\d{1,2}\s+\w+\s+[–—-]\s+(\d{1,2})\s+(\w+)\s+(\d{4})', text, re.IGNORECASE)
    if m:
        d, mon, yr = m.group(1), m.group(2).lower(), m.group(3)
        if mon in MONTH_MAP:
            return f"{yr}-{MONTH_MAP[mon]:02d}-{int(d):02d}"

    # Full date with year: "16 APRIL 2026" or "12 MAC 2026"
    m = re.search(r'(\d{1,2})\s+(\w+)\s+(\d{4})', text, re.IGNORECASE)
    if m:
        d, mon, yr = m.group(1), m.group(2).lower(), m.group(3)
        if mon in MONTH_MAP:
            return f"{yr}-{MONTH_MAP[mon]:02d}-{int(d):02d}"

    # Partial date without year: "16 APRIL", "8 APRIL"
    m = re.search(r'(\d{1,2})\s+([A-Za-z]{3,})', text, re.IGNORECASE)
    if m:
        d, mon = m.group(1), m.group(2).lower()
        if mon in MONTH_MAP:
            yr = TODAY.year
            try:
                candidate = datetime.date(yr, MONTH_MAP[mon], int(d))
                # Kalau dah lepas tahun ini → expired, kekal tahun ini supaya is_expired() skip dia
                return f"{yr}-{MONTH_MAP[mon]:02d}-{int(d):02d}"
            except Exception:
                pass
    return ''


def is_expired(iso_str):
    """Return True jika tarikh dah lepas."""
    if not iso_str:
        return False
    try:
        return datetime.date.fromisoformat(iso_str) < TODAY
    except Exception:
        return False


def get_detail(url):
    """Ambil deskripsi dari halaman detail biasiswa.co."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, verify=False)
        soup = BeautifulSoup(r.text, 'html.parser')

        article = soup.select_one('article.post_body, .entry-content, .post-content')
        if not article:
            return ''

        for para in article.find_all('p'):
            s = re.sub(r'\s+', ' ', para.text).strip()
            if len(s) < 40 or 'http' in s or s.startswith('='):
                continue
            letters = [c for c in s if c.isalpha()]
            lowercase = [c for c in letters if c.islower()]
            ratio = len(lowercase) / len(letters) if letters else 0
            if ratio > 0.45:
                return s[:100]
        return ''
    except Exception as e:
        sys.stderr.write(f'  Detail error {url}: {e}\n')
        return ''


def fetch_scholarships():
    try:
        r = requests.get(BASE_URL, headers=HEADERS, timeout=15, verify=False)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')

        article = soup.select_one('article.post_body, .entry-content, .post-content')
        table   = article.find('table') if article else None
        if not table:
            sys.stderr.write('No table found\n')
            return []

        results = []

        for row in table.find_all('tr')[1:]:  # skip header row
            cells = row.find_all(['td', 'th'])
            if len(cells) < 4:
                continue

            name_cell = cells[1]
            date_cell = cells[3]

            # ── Determine status from date cell ──
            date_text = date_cell.text.strip().upper()
            date_raw  = str(date_cell)

            # 1. SKIP — strikethrough (<s> tag) = dah tutup
            if date_cell.find('s'):
                sys.stderr.write(f'  SKIP (strikethrough): {name_cell.text.strip()[:50]}\n')
                continue

            # 2. SKIP — CS (Coming Soon)
            if date_text == 'CS':
                sys.stderr.write(f'  SKIP (CS): {name_cell.text.strip()[:50]}\n')
                continue

            # 3. INCLUDE — OPEN / ONGOING (sentiasa boleh mohon)
            tutup_display = ''
            tutup_iso     = ''
            if date_text in ('OPEN', 'ONGOING'):
                tutup_display = date_text.capitalize()
                tutup_iso     = ''  # no expiry

            # 4. INCLUDE — Active date (check if expired)
            else:
                raw_date  = date_cell.text.strip()
                tutup_iso = parse_iso(raw_date)

                if tutup_iso and is_expired(tutup_iso):
                    sys.stderr.write(f'  SKIP (expired {tutup_iso}): {name_cell.text.strip()[:50]}\n')
                    continue

                # Build display string
                if '<strong>' in date_raw:
                    tutup_display = raw_date.strip()
                else:
                    tutup_display = raw_date.strip()  # include even without bold

            # ── Get scholarship name and URL ──
            link = name_cell.find('a', href=lambda h: h and 'biasiswa.co/' in h)
            url  = link['href'] if link else ''
            name = re.sub(r'\s+', ' ', name_cell.text).strip()

            # ── Get description from detail page ──
            desc = ''
            if url:
                sys.stderr.write(f'Fetching detail: {url}\n')
                desc = get_detail(url)

            results.append({
                'name':      name,
                'desc':      desc or 'Biasiswa untuk pelajar lepasan SPM Malaysia.',
                'tutup':     tutup_display,
                'tutup_iso': tutup_iso,
                'url':       url,
            })

            if len(results) >= MAX_ITEMS:
                break

        return results

    except Exception as e:
        sys.stderr.write(f'Scrape error: {e}\n')
        return []


if __name__ == '__main__':
    results = fetch_scholarships()
    sys.stdout.write(json.dumps(results, ensure_ascii=False))
    sys.stdout.flush()
