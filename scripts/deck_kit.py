"""Layout kit for the Enterprise AI Foundation governance deck: Arial, white page, kicker + status chip, action title,
takeaway bar, footnote, source, confidentiality tag and page counter. Native shapes only (editable). A text-fit estimate
records a warning for any box whose text will not fit, so overflow is caught before rendering."""
import math

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.dml import MSO_LINE
from pptx.enum.shapes import MSO_CONNECTOR, MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

FONT = "Arial"
C = dict(ink="1D2D3E", mute="556B82", line="D9DEE5", navy="0B2545", blue="0A6ED1", bluebg="EEF5FD", gray="F5F6F7", white="FFFFFF",
         green="107E3E", greenbg="E5F4EA", amber="C98A00", amberbg="FFF6DD", orange="E9730C", orangebg="FFF2E6", red="BB0000",
         redbg="FDEAEA", purple="6A4BBE", purplebg="F3EEFB", slate="354A5F", slatebg="EDF0F4", soft="9AA5B5")
KIND = {  # fill, border
    "agent": ("bluebg", "blue"), "gw": ("greenbg", "green"), "gw2": ("amberbg", "amber"), "reg": ("amberbg", "amber"),
    "llm": ("purplebg", "purple"), "idn": ("orangebg", "orange"), "sap": ("slatebg", "slate"), "plain": ("white", "soft"),
    "ok": ("greenbg", "green"), "warn": ("amberbg", "amber"), "bad": ("redbg", "red"), "ui": ("white", "slate"), "mute": ("gray", "soft"),
}
WARN = []


def rgb(name):
    return RGBColor.from_string(C.get(name, name))


class Deck:
    def __init__(self, total):
        self.prs = Presentation()
        self.prs.slide_width, self.prs.slide_height = Inches(13.333), Inches(7.5)
        self.total = total
        self.n = 0

    def save(self, path):
        self.prs.save(path)


def _est_lines(text, width_in, size, bold=False):
    cw = size * (0.56 if bold else 0.51)
    usable = max(width_in * 72 - 10, 10)
    return sum(max(1, math.ceil(len(part) * cw / usable)) for part in text.split("\n"))


def check_fit(tag, paras, w, h, default_size, margin=0.05):
    total = 0
    for p in paras:
        size = p.get("size", default_size)
        raw = p["text"]
        flat = "".join(r[0] for r in raw) if isinstance(raw, list) else raw
        total += _est_lines(flat, w - 2 * margin, size, p.get("bold", False)) * size * 1.2 + p.get("space", 0)
    if total / 72 > h + 0.02:
        WARN.append(f"{tag}: needs {total / 72:.2f}in, has {h:.2f}in :: {paras[0]['text'][:50]}")


def txt(slide, x, y, w, h, paras, size=10, color="ink", bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, tag="", margin=0.05, italic=False, fill=None):
    """paras: str | list of (str | dict(text, size, bold, color, space, italic))"""
    if isinstance(paras, str):
        paras = [paras]
    paras = [p if isinstance(p, dict) else {"text": p} for p in paras]
    check_fit(tag or "txt", paras, w, h, size, margin)
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(margin)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    fill_tf(tf, paras, size, color, bold, align, italic)
    if fill:
        box.fill.solid()
        box.fill.fore_color.rgb = rgb(fill)
    return box


def fill_tf(tf, paras, size, color, bold, align, italic=False):
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align
        if p.get("space"):
            para.space_before = Pt(p["space"])
        runs = p["text"] if isinstance(p["text"], list) else [(p["text"], {})]
        for text_, over in runs:
            r = para.add_run()
            r.text = text_
            f = r.font
            f.name = FONT
            f.size = Pt(over.get("size", p.get("size", size)))
            f.bold = over.get("bold", p.get("bold", bold))
            f.italic = over.get("italic", p.get("italic", italic))
            f.color.rgb = rgb(over.get("color", p.get("color", color)))


def rect(slide, x, y, w, h, fill="white", line="line", lw=1.0, dash=False, shape=MSO_SHAPE.RECTANGLE):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    s.shadow.inherit = False
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = rgb(fill)
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = rgb(line)
        s.line.width = Pt(lw)
        if dash:
            s.line.dash_style = MSO_LINE.DASH
    return s


def node(slide, x, y, w, h, title, sub="", kind="agent", dashed=False, ts=10.5, ss=8.5, tag="", lw=1.25):
    fill, line = KIND[kind]
    s = rect(slide, x, y, w, h, fill, line, lw, dashed)
    tf = s.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Inches(0.05)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    paras = [{"text": title, "size": ts, "bold": True, "color": "navy"}]
    if sub:
        paras.append({"text": sub, "size": ss, "color": "mute"})
    check_fit(tag or f"node '{title}'", paras, w, h, ts, 0.05)
    fill_tf(tf, paras, ts, "ink", False, PP_ALIGN.CENTER)
    return s


def arrow(slide, x1, y1, x2, y2, kind="run", head=True, width=1.75):
    col, dash = {"run": ("navy", False), "reg": ("green", True), "llm": ("purple", False), "id": ("orange", True), "dep": ("slate", True), "red": ("red", True)}[kind]
    line = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    line.line.color.rgb = rgb(col)
    line.line.width = Pt(width)
    if dash:
        line.line.dash_style = MSO_LINE.DASH
    if head:
        ln = line.line._get_or_add_ln()
        ln.append(etree.SubElement(ln, qn("a:tailEnd"), type="triangle", w="med", len="med"))
    return line


def _border(cell, color, sides):
    tcPr = cell._tc.get_or_add_tcPr()
    for s in sides:
        tag = {"l": "a:lnL", "r": "a:lnR", "t": "a:lnT", "b": "a:lnB"}[s]
        for e in tcPr.findall(qn(tag)):
            tcPr.remove(e)
        ln = etree.SubElement(tcPr, qn(tag), w="6350", cap="flat", cmpd="sng", algn="ctr")
        sf = etree.SubElement(ln, qn("a:solidFill"))
        etree.SubElement(sf, qn("a:srgbClr"), val=C[color])
        etree.SubElement(ln, qn("a:prstDash"), val="solid")


def table(slide, x, y, w, colw, rows, size=9.5, rowh=0.3, header=True, hl_col=None, first_bold=True, section_rows=(), align_center_cols=(), cell_fill=None, status_col=None):
    """cell_fill: dict {(r,c): ('fill name','text color name')}"""
    shape = slide.shapes.add_table(len(rows), len(rows[0]), Inches(x), Inches(y), Inches(w), Inches(rowh * len(rows)))
    tbl = shape.table
    tbl.first_row = False
    tbl.horz_banding = False
    total = sum(colw)
    for j, cw in enumerate(colw):
        tbl.columns[j].width = Inches(w * cw / total)
    for i, row in enumerate(rows):
        tbl.rows[i].height = Inches(rowh)
        sec = i in section_rows
        for j, val in enumerate(row):
            cell = tbl.cell(i, j)
            _border(cell, "line", "b")
            cell.margin_left = cell.margin_right = Inches(0.07)
            cell.margin_top = cell.margin_bottom = Inches(0.025)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            is_head = header and i == 0
            fill, tcol, bold = "white", "ink", (first_bold and j == 0)
            if is_head:
                fill, tcol, bold = "navy", "white", True
            elif sec:
                fill, tcol, bold = "slatebg", "navy", True
            elif hl_col is not None and j == hl_col:
                fill = "bluebg"
            if cell_fill and (i, j) in cell_fill:
                fill, tcol = cell_fill[(i, j)]
                bold = True
            cell.fill.solid()
            cell.fill.fore_color.rgb = rgb(fill)
            tf = cell.text_frame
            tf.word_wrap = True
            fill_tf(tf, [{"text": str(val)}], size, tcol, bold, PP_ALIGN.CENTER if j in align_center_cols else PP_ALIGN.LEFT)
    return tbl


def new_slide(deck, kicker, chip, chip_kind, title, takeaway, source, footnote="", subtitle="", notes=""):
    deck.n += 1
    s = deck.prs.slides.add_slide(deck.prs.slide_layouts[6])
    txt(s, 0.5, 0.2, 8.5, 0.26, [{"text": [(f"{deck.n:02d}  ·  ", {}), (kicker, {})]}], 10, "blue", True, tag="kicker")
    cw = 0.115 * len(chip) + 0.4
    fill, line, tcol = {"navy": ("navy", "navy", "white"), "warn": ("amberbg", "amber", "navy"), "ok": ("greenbg", "green", "navy"),
                        "bad": ("redbg", "red", "navy"), "mute": ("gray", "soft", "navy")}[chip_kind]
    chip_shape = rect(s, 12.83 - cw, 0.2, cw, 0.26, fill, line, 1.0, False, MSO_SHAPE.ROUNDED_RECTANGLE)
    chip_shape.adjustments[0] = 0.5
    tf = chip_shape.text_frame
    tf.margin_left = tf.margin_right = Inches(0.05)
    tf.margin_top = tf.margin_bottom = Inches(0)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    fill_tf(tf, [{"text": chip}], 10, tcol, True, PP_ALIGN.CENTER)
    txt(s, 0.5, 0.5, 12.33, 0.85, title, 24, "navy", True, anchor=MSO_ANCHOR.TOP, tag=f"title {deck.n}")
    if subtitle:
        txt(s, 0.5, 0.98, 12.33, 0.52, subtitle, 13, "mute", tag=f"subtitle {deck.n}")
    line = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(0.5), Inches(6.47), Inches(12.83), Inches(6.47))
    line.line.color.rgb = rgb("line")
    line.line.width = Pt(0.75)
    txt(s, 0.5, 6.5, 12.33, 0.32, [{"text": [("TAKEAWAY   ", {"size": 10, "bold": True, "color": "blue"}), (takeaway, {"size": 13, "bold": True, "color": "navy"})]}], 13, tag=f"takeaway {deck.n}", anchor=MSO_ANCHOR.MIDDLE)
    if footnote:
        txt(s, 0.5, 6.83, 12.33, 0.22, footnote, 10, "mute", tag="footnote")
    txt(s, 0.5, 7.08, 7.6, 0.22, source, 9, "mute", tag=f"source {deck.n}")
    txt(s, 8.2, 7.08, 3.1, 0.22, "CONFIDENTIAL · PRE-POC BASELINE", 10, "slate", True, align=PP_ALIGN.RIGHT, tag="conf")
    logo = rect(s, 11.45, 7.06, 0.85, 0.26, None, "soft", 0.75, True)
    tf = logo.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    fill_tf(tf, [{"text": "Logo"}], 9, "soft", False, PP_ALIGN.CENTER)
    txt(s, 12.3, 7.08, 0.53, 0.22, f"{deck.n}/{deck.total}", 9, "slate", True, align=PP_ALIGN.RIGHT, tag="page", margin=0.02)
    if notes:
        s.notes_slide.notes_text_frame.text = notes
    return s


def card(slide, x, y, w, h, kicker, title, bullets, border="line", title_size=15, bullet_size=10.5, tag=""):
    rect(slide, x, y, w, h, "white", border, 1.0)
    paras = [{"text": kicker, "size": 10, "bold": True, "color": "blue"}, {"text": title, "size": title_size, "bold": True, "color": "navy", "space": 3}]
    paras += [{"text": "▪ " + b, "size": bullet_size, "space": 5} for b in bullets]
    txt(slide, x + 0.1, y + 0.06, w - 0.2, h - 0.1, paras, bullet_size, tag=tag or f"card {title[:30]}")


def legend(slide, items, x=0.5, y=1.4):
    cx = x
    for label, kind in items:
        if kind == "future":
            rect(slide, cx, y + 0.06, 0.32, 0.14, "gray", "soft", 0.75, True)
            w = 0.38
        else:
            arrow(slide, cx, y + 0.1, cx + 0.4, y + 0.1, kind, True, 1.75)
            w = 0.46
        tw = 0.085 * len(label) + 0.2
        txt(slide, cx + w, y, tw, 0.2, label, 10, "mute", tag="legend")
        cx += w + tw + 0.2
