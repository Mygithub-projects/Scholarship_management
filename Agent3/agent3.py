"""
Agent 3: Scholarship Result PDF Generator
Input : Agent2/matches_{student_id}.json
Output: Agent3/report_{student_id}.pdf
"""

import json, os, sys
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NAVY  = colors.HexColor("#0F2057")
BLUE  = colors.HexColor("#1A56DB")
GREEN = colors.HexColor("#059669")
LIGHT = colors.HexColor("#EFF6FF")
GREY  = colors.HexColor("#F1F5F9")
MID   = colors.HexColor("#64748B")
RED   = colors.HexColor("#EF4444")


def run_single(student_id, progress_cb=None):
    def log(msg):
        if progress_cb: progress_cb(msg)
        else: print(msg)

    log(f"Loading Agent 2 results for {student_id}...")
    matches_file = os.path.join(BASE, "Agent2", f"matches_{student_id}.json")
    with open(matches_file, encoding="utf-8") as f:
        data = json.load(f)

    student = data["results"][0]
    top5    = student["top5"][:10]
    log(f"Generating PDF for {student['studentName']}...")

    out_file = os.path.join(BASE, "Agent3", f"report_{student_id}.pdf")
    _build_pdf(student, top5, out_file)

    log(f"DONE saved -> {out_file}")
    return {"pdf": out_file, "studentId": student_id, "studentName": student["studentName"]}


def _build_pdf(student, top5, out_file):
    doc = SimpleDocTemplate(
        out_file, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", fontName="Helvetica-Bold",
                                  fontSize=16, textColor=colors.white,
                                  alignment=TA_CENTER, spaceAfter=4)
    sub_style   = ParagraphStyle("sub", fontName="Helvetica",
                                  fontSize=9, textColor=colors.HexColor("#9DB8F0"),
                                  alignment=TA_CENTER)
    h2_style    = ParagraphStyle("h2", fontName="Helvetica-Bold",
                                  fontSize=11, textColor=NAVY, spaceBefore=14, spaceAfter=6)
    body_style  = ParagraphStyle("body", fontName="Helvetica",
                                  fontSize=9, textColor=colors.HexColor("#374151"),
                                  leading=14)
    label_style = ParagraphStyle("label", fontName="Helvetica-Bold",
                                  fontSize=8, textColor=MID)
    val_style   = ParagraphStyle("val", fontName="Helvetica-Bold",
                                  fontSize=10, textColor=NAVY)
    small_style = ParagraphStyle("small", fontName="Helvetica",
                                  fontSize=8, textColor=MID, alignment=TA_RIGHT)

    W = doc.width  # usable width

    story = []

    # ── Header banner ──
    header_data = [[
        Paragraph("KEMENTERIAN PENDIDIKAN MALAYSIA", title_style),
        Paragraph("Sistem Padanan Biasiswa Berkuasa AI", sub_style),
    ]]
    header_tbl = Table([[
        Paragraph("KEMENTERIAN PENDIDIKAN MALAYSIA", title_style),
    ], [
        Paragraph("Sistem Padanan Biasiswa Berkuasa AI", sub_style),
    ]], colWidths=[W])
    header_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TOPPADDING",    (0,0), (-1,-1), 14),
        ("BOTTOMPADDING", (0,0), (-1,-1), 14),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
    ]))
    story.append(header_tbl)
    story.append(Spacer(1, 0.4*cm))

    # ── Report title ──
    story.append(Paragraph("LAPORAN PADANAN BIASISWA", ParagraphStyle(
        "rpt", fontName="Helvetica-Bold", fontSize=13, textColor=NAVY,
        alignment=TA_CENTER, spaceAfter=2)))
    story.append(Paragraph("Scholarship Matching Report", ParagraphStyle(
        "rpt2", fontName="Helvetica", fontSize=9, textColor=MID,
        alignment=TA_CENTER, spaceAfter=10)))
    story.append(HRFlowable(width=W, thickness=2, color=BLUE, spaceAfter=10))

    # ── Student info box ──
    today = date.today().strftime("%d %B %Y")
    info_data = [
        [Paragraph("NAMA PELAJAR", label_style), Paragraph("ID PELAJAR", label_style), Paragraph("TARIKH DIJANA", label_style)],
        [Paragraph(student["studentName"], val_style), Paragraph(student["studentId"], val_style), Paragraph(today, val_style)],
    ]
    info_tbl = Table(info_data, colWidths=[W*0.5, W*0.25, W*0.25])
    info_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), LIGHT),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("ROUNDEDCORNERS", (0,0), (-1,-1), 4),
    ]))
    story.append(info_tbl)
    story.append(Spacer(1, 0.5*cm))

    # ── Section heading ──
    story.append(Paragraph("TOP 10 BIASISWA YANG SESUAI UNTUK ANDA", h2_style))
    story.append(Paragraph(
        "Senarai biasiswa berikut dipilih berdasarkan analisis profil akademik, "
        "kepimpinan, ko-kurikulum dan minat kerjaya anda.",
        body_style))
    story.append(Spacer(1, 0.3*cm))

    # ── Scholarship cards (as table rows) ──
    for i, m in enumerate(top5):
        rank      = i + 1
        name      = m.get("scholarshipName", "—")
        score     = m.get("totalScore", 0)
        eligible  = m.get("eligible", False)
        breakdown = m.get("breakdown", {})
        provider  = m.get("provider", "—")

        elig_color = GREEN if eligible else RED
        elig_text  = "LAYAK" if eligible else "TIDAK LAYAK"

        # Score bar (drawn as a mini table)
        bar_pct = min(score / 100, 1.0)
        bar_w   = W * 0.35
        bar_data = [[""]]
        bar_tbl  = Table(bar_data, colWidths=[bar_w * bar_pct], rowHeights=[6])
        bar_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), BLUE),
            ("TOPPADDING",    (0,0),(-1,-1), 0),
            ("BOTTOMPADDING", (0,0),(-1,-1), 0),
            ("LEFTPADDING",   (0,0),(-1,-1), 0),
            ("RIGHTPADDING",  (0,0),(-1,-1), 0),
        ]))

        # Breakdown chips text
        chip_parts = []
        label_map = {
            "academic":    "Akademik",
            "aspiration":  "Aspirasi",
            "personality": "Personaliti",
            "cocurriculum":"Ko-K",
            "involvement": "Penglibatan",
        }
        for k, v in breakdown.items():
            chip_parts.append(f"{label_map.get(k, k)}: {v:.0f}")
        chips_text = "   |   ".join(chip_parts)

        card_inner = [
            [
                Paragraph(f"<font color='#9DB8F0'>#{rank}</font>  <b>{name}</b>",
                          ParagraphStyle("cn", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY)),
                Paragraph(elig_text, ParagraphStyle("el", fontName="Helvetica-Bold",
                          fontSize=9, textColor=elig_color, alignment=TA_RIGHT)),
            ],
            [
                Paragraph(f"Pembiaya: {provider}", ParagraphStyle("pr", fontName="Helvetica",
                          fontSize=8, textColor=MID)),
                Paragraph(f"Skor: <b>{score:.1f}/100</b>", ParagraphStyle("sc", fontName="Helvetica",
                          fontSize=9, textColor=BLUE, alignment=TA_RIGHT)),
            ],
            [
                Paragraph(chips_text, ParagraphStyle("ch", fontName="Helvetica",
                          fontSize=7.5, textColor=MID, leading=12)),
                "",
            ],
        ]
        card = Table(card_inner, colWidths=[W*0.7, W*0.3])
        card.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,-1), colors.white),
            ("TOPPADDING",    (0,0), (-1,-1), 8),
            ("BOTTOMPADDING", (0,0), (-1,-1), 8),
            ("LEFTPADDING",   (0,0), (-1,-1), 12),
            ("RIGHTPADDING",  (0,0), (-1,-1), 12),
            ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
            ("SPAN",          (0,2), (-1,2)),
            ("LINEBELOW",     (0,0), (-1,0), 0.5, colors.HexColor("#E5E7EB")),
        ]))

        wrapper = Table([[card]], colWidths=[W])
        wrapper.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,-1), colors.white),
            ("BOX",           (0,0), (-1,-1), 1, colors.HexColor("#E5E7EB")),
            ("TOPPADDING",    (0,0), (-1,-1), 0),
            ("BOTTOMPADDING", (0,0), (-1,-1), 0),
            ("LEFTPADDING",   (0,0), (-1,-1), 0),
            ("RIGHTPADDING",  (0,0), (-1,-1), 0),
        ]))

        story.append(KeepTogether([wrapper, Spacer(1, 0.25*cm)]))

    # ── Footer ──
    story.append(Spacer(1, 0.4*cm))
    story.append(HRFlowable(width=W, thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=8))
    story.append(Paragraph(
        "Dokumen ini dijana secara automatik oleh Sistem Padanan Biasiswa Berkuasa AI — KPM. "
        "Untuk maklumat lanjut, hubungi pihak sekolah.",
        ParagraphStyle("foot", fontName="Helvetica", fontSize=7.5, textColor=MID,
                       alignment=TA_CENTER)))

    doc.build(story)


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--single":
        run_single(sys.argv[2])
    else:
        print("Usage: python agent3.py --single <student_id>")
