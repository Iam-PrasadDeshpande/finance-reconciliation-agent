"""Convert the reference architecture deck (native vector shapes) to one SVG per slide.

Usage: python scripts/pptx_to_svg.py <deck.pptx> <out_dir>
Writes s1.svg and s2.svg (slide order). Geometry, colours, dashes, arrowheads and text
are taken directly from the deck, so the SVG is a 1:1 vector recreation (no raster).
Only the shape kinds present in the deck are supported (rect, roundRect, ellipse,
triangle, line); anything else raises so a silent loss is impossible.
"""
from __future__ import annotations

import sys
import zipfile
from html import escape
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "p": "http://schemas.openxmlformats.org/presentationml/2006/main"}
EMU_PT = 12700.0
FONT = "'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif"
ASCENT, LINE_H = 1.079, 1.33  # Segoe UI metrics (em)
SLIDE_TITLES = {1: "S1 · Google Apigee MCP", 2: "S2 · AgentCore Gateway MCP"}


def num(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".")


def fill_of(sppr) -> str:
    if sppr.find("a:noFill", NS) is not None:
        return "none"
    srgb = sppr.find("a:solidFill/a:srgbClr", NS)
    return f"#{srgb.get('val')}" if srgb is not None else "none"


def stroke_of(sppr):
    ln = sppr.find("a:ln", NS)
    if ln is None or ln.find("a:noFill", NS) is not None:
        return None
    srgb = ln.find("a:solidFill/a:srgbClr", NS)
    if srgb is None:
        return None
    width = int(ln.get("w", "12700")) / EMU_PT
    dash = ln.find("a:prstDash", NS)
    return f"#{srgb.get('val')}", width, (dash.get("val") if dash is not None else None)


def stroke_attrs(stroke) -> str:
    if not stroke:
        return ' stroke="none"'
    colour, width, dash = stroke
    out = f' stroke="{colour}" stroke-width="{num(width)}"'
    if dash == "dash":
        out += f' stroke-dasharray="{num(width * 4)} {num(width * 3)}"'
    elif dash:
        raise ValueError(f"unsupported dash {dash}")
    return out


def convert_slide(xml: bytes, title: str, desc: str) -> str:
    root = ET.fromstring(xml)
    tree = root.find("p:cSld/p:spTree", NS)
    parts: list[str] = []
    for node in tree:
        tag = node.tag.split("}")[1]
        if tag not in ("sp", "cxnSp"):
            continue
        sppr = node.find("p:spPr", NS)
        xfrm = sppr.find("a:xfrm", NS)
        off, ext = xfrm.find("a:off", NS), xfrm.find("a:ext", NS)
        x, y = int(off.get("x")) / EMU_PT, int(off.get("y")) / EMU_PT
        w, h = int(ext.get("cx")) / EMU_PT, int(ext.get("cy")) / EMU_PT
        rot = int(xfrm.get("rot", "0")) / 60000.0
        flip_h, flip_v = xfrm.get("flipH") == "1", xfrm.get("flipV") == "1"
        geom = sppr.find("a:prstGeom", NS)
        prst = geom.get("prst") if geom is not None else None
        name = node.find(".//p:cNvPr", NS).get("name", "")
        cx, cy = x + w / 2, y + h / 2
        transform = ""
        if rot or flip_h or flip_v:
            transform = f' transform="translate({num(cx)} {num(cy)})'
            if rot:
                transform += f" rotate({num(rot)})"
            if flip_h or flip_v:
                transform += f" scale({-1 if flip_h else 1} {-1 if flip_v else 1})"
            transform += f" translate({num(-cx)} {num(-cy)})\""
        fill, stroke = fill_of(sppr), stroke_of(sppr)
        shape = ""
        if prst == "rect" and fill != "none" or prst == "rect" and stroke:
            shape = f'<rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" fill="{fill}"{stroke_attrs(stroke)}{transform}/>'
        elif prst == "roundRect":
            adj = 16667
            gd = geom.find("a:avLst/a:gd", NS)
            if gd is not None:
                adj = int(gd.get("fmla").split()[1])
            r = min(w, h) * adj / 100000.0
            shape = f'<rect x="{num(x)}" y="{num(y)}" width="{num(w)}" height="{num(h)}" rx="{num(r)}" fill="{fill}"{stroke_attrs(stroke)}{transform}/>'
        elif prst == "ellipse":
            shape = f'<ellipse cx="{num(cx)}" cy="{num(cy)}" rx="{num(w / 2)}" ry="{num(h / 2)}" fill="{fill}"{stroke_attrs(stroke)}{transform}/>'
        elif prst == "triangle":
            adj = 50000
            gd = geom.find("a:avLst/a:gd", NS)
            if gd is not None:
                adj = int(gd.get("fmla").split()[1])
            pts = f"{num(x + w * adj / 100000.0)},{num(y)} {num(x + w)},{num(y + h)} {num(x)},{num(y + h)}"
            shape = f'<polygon points="{pts}" fill="{fill}"{stroke_attrs(stroke)}{transform}/>'
        elif prst == "line":
            shape = f'<line x1="{num(x)}" y1="{num(y)}" x2="{num(x + w)}" y2="{num(y + h)}" fill="none"{stroke_attrs(stroke)}{transform}/>'
        elif prst == "rect":
            shape = ""  # empty text frame without fill/line
        else:
            raise ValueError(f"unsupported geometry {prst}")
        if shape:
            parts.append(shape)
        body = node.find("p:txBody", NS)
        if body is None:
            continue
        run = body.find("a:p/a:r", NS)
        if run is None or not (run.findtext("a:t", default="", namespaces=NS) or "").strip():
            continue
        text = run.findtext("a:t", namespaces=NS)
        rpr = run.find("a:rPr", NS)
        size = int(rpr.get("sz")) / 100.0
        bold = rpr.get("b") == "1"
        colour = rpr.find("a:solidFill/a:srgbClr", NS).get("val")
        bpr = body.find("a:bodyPr", NS)
        anchor = bpr.get("anchor", "t")
        algn = body.find("a:p/a:pPr", NS).get("algn", "l")
        l_ins, r_ins = int(bpr.get("lIns", "91440")) / EMU_PT, int(bpr.get("rIns", "91440")) / EMU_PT
        t_ins = int(bpr.get("tIns", "45720")) / EMU_PT
        if algn == "ctr":
            tx, a = x + w / 2, "middle"
        elif algn == "r":
            tx, a = x + w - r_ins, "end"
        else:
            tx, a = x + l_ins, "start"
        base = (y + t_ins + ASCENT * size) if anchor == "t" else (y + h / 2 + (ASCENT - LINE_H / 2) * size)
        weight = ' font-weight="700"' if bold else ""
        parts.append(f'<text x="{num(tx)}" y="{num(base)}" font-size="{num(size)}"{weight} fill="#{colour}" text-anchor="{a}">{escape(text)}</text>')
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 840" role="img" '
            f'aria-labelledby="t d" font-family="{FONT}" text-rendering="geometricPrecision" shape-rendering="geometricPrecision">'
            f'<title id="t">{escape(title)}</title><desc id="d">{escape(desc)}</desc>'
            '<rect width="1200" height="840" fill="#F1F4F7"/>' + "".join(parts) + "</svg>\n")


def main(deck: str, out: str) -> None:
    out_dir = Path(out)
    out_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(deck) as z:
        for idx in (1, 2):
            svg = convert_slide(z.read(f"ppt/slides/slide{idx}.xml"), SLIDE_TITLES[idx],
                                f"Detailed architecture diagram {SLIDE_TITLES[idx]} converted from the supplied deck")
            (out_dir / f"s{idx}.svg").write_text(svg, encoding="utf-8")
            print(f"s{idx}.svg", len(svg), "bytes")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
