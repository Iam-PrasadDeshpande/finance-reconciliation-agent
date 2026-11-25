"""Build the editable Enterprise AI Foundation & Governance deck (Architecture V5.2) from the canonical model.

Native PowerPoint shapes, tables and text only (no pictures), so every slide stays editable.

    python scripts/build_governance_deck.py [output.pptx]
"""
import sys
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from poc import architecture_model as m  # noqa: E402

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "docs" / "Enterprise_AI_Foundation_Governance_V5_2.pptx"
NAVY, BLUE, GREY, LIGHT, WHITE = RGBColor(0x1D, 0x2D, 0x3E), RGBColor(0x0A, 0x6E, 0xD1), RGBColor(0x50, 0x67, 0x78), RGBColor(0xF1, 0xF4, 0xF7), RGBColor(0xFF, 0xFF, 0xFF)
FILL = {"agent": RGBColor(0xE8, 0xF1, 0xFB), "gateway": RGBColor(0xFF, 0xF1, 0xE0), "registry": RGBColor(0xE5, 0xF5, 0xF2), "integration": RGBColor(0xF0, 0xEA, 0xF8), "backend": RGBColor(0xE3, 0xE9, 0xEF),
        "llm": RGBColor(0xF4, 0xEA, 0xFA), "identity": RGBColor(0xFF, 0xF7, 0xDA), "artifact": RGBColor(0xF3, 0xF3, 0xF3), "decision": RGBColor(0xFF, 0xF8, 0xEE), "ui": RGBColor(0xEE, 0xF4, 0xFA)}
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
BLANK = prs.slide_layouts[6]
TOTAL = 12


def text(slide, x, y, w, h, value, size=12, bold=False, color=NAVY, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0.05)
    lines = value if isinstance(value, list) else [value]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.size, run.font.bold, run.font.color.rgb = Pt(size), bold, color
    return box


def box(slide, x, y, w, h, title, sub="", kind="agent", size=11, dashed=False):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid(); shape.fill.fore_color.rgb = FILL.get(kind, LIGHT)
    shape.line.color.rgb = GREY; shape.line.width = Pt(1.25)
    if dashed:
        shape.line.dash_style = 4
    tf = shape.text_frame; tf.word_wrap = True; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Inches(0.06); tf.margin_top = tf.margin_bottom = Inches(0.03)
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = title; r.font.size = Pt(size); r.font.bold = True; r.font.color.rgb = NAVY
    if sub:
        q = tf.add_paragraph(); q.alignment = PP_ALIGN.CENTER
        s = q.add_run(); s.text = sub; s.font.size = Pt(size - 2.5); s.font.color.rgb = GREY
    return shape


def arrow(slide, a, b, color=BLUE, dashed=False, width=2.0):
    line = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, a[0], a[1], b[0], b[1])
    line.line.color.rgb = color; line.line.width = Pt(width)
    if dashed:
        line.line.dash_style = 4
    line.line._get_or_add_ln().append(line.line._ln.makeelement("{http://schemas.openxmlformats.org/drawingml/2006/main}tailEnd", {"type": "triangle"}))
    return line


def link(slide, s1, s2, **kw):
    """Arrow from the right edge of s1 to the left edge of s2 when side by side, else bottom to top."""
    if s2.left >= s1.left + s1.width - 10:
        return arrow(slide, (s1.left + s1.width, s1.top + s1.height // 2), (s2.left, s2.top + s2.height // 2), **kw)
    return arrow(slide, (s1.left + s1.width // 2, s1.top + s1.height), (s2.left + s2.width // 2, s2.top), **kw)


def table(slide, x, y, w, rows, widths, size=10, header=True, row_h=0.34):
    shape = slide.shapes.add_table(len(rows), len(rows[0]), Inches(x), Inches(y), Inches(w), Inches(row_h * len(rows)))
    tbl = shape.table
    for j, wd in enumerate(widths):
        tbl.columns[j].width = Inches(wd)
    for i, row in enumerate(rows):
        for j, value in enumerate(row):
            cell = tbl.cell(i, j)
            cell.text = str(value)
            cell.margin_left = cell.margin_right = Inches(0.05); cell.margin_top = cell.margin_bottom = Inches(0.02)
            for p in cell.text_frame.paragraphs:
                for r in p.runs:
                    r.font.size = Pt(size); r.font.bold = (header and i == 0) or j == 0
                    r.font.color.rgb = WHITE if (header and i == 0) else NAVY
            cell.fill.solid()
            cell.fill.fore_color.rgb = NAVY if (header and i == 0) else (LIGHT if i % 2 == 0 else WHITE)
    return tbl


def slide(title, subtitle, n):
    s = prs.slides.add_slide(BLANK)
    band = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.95))
    band.fill.solid(); band.fill.fore_color.rgb = NAVY; band.line.fill.background()
    text(s, 0.4, 0.1, 12.5, 0.5, title, 24, True, WHITE)
    text(s, 0.4, 0.55, 12.5, 0.35, subtitle, 12, False, RGBColor(0xC8, 0xD6, 0xE3))
    text(s, 0.4, 7.08, 11.5, 0.3, "Proposed design for evaluation · not tenant-verified · not an approved architecture · S3 is preferred for evaluation, not approved", 9, False, GREY)
    text(s, 12.2, 7.08, 0.8, 0.3, f"{n} / {TOTAL}", 9, False, GREY, PP_ALIGN.RIGHT)
    return s


# 1 ------------------------------------------------------------------------------------------------ executive summary
s = slide("Enterprise AI Foundation and Governance", "Architecture V5.2 · three hosting and registration scenarios, evaluated by evidence", 1)
rows = [["", "S1 SAP-hosted hybrid", "S2 AWS AgentCore-native", "S3 AgentCore + Apigee hybrid"],
        ["Classification", "SAP-hosted alternative", "AWS-native alternative", "Preferred to evaluate first · conditional"],
        ["Agent execution", "SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "AWS AgentCore Runtime"],
        ["Runtime gateway", "Google Apigee", "AgentCore Gateway", "AgentCore Gateway → Apigee"],
        ["Registry", "AWS Agent Registry", "AWS Agent Registry", "AWS Agent Registry"],
        ["LLM gateway", "Portkey", "Portkey", "Portkey"]]
table(s, 0.5, 1.3, 12.3, rows, [2.1, 3.4, 3.4, 3.4], 12, row_h=0.42)
text(s, 0.5, 4.1, 12.3, 2.8, ["Direction: use AWS for managed agent execution in a dedicated SAP-agent account, keep Apigee for SAP-specific MCP/API governance, keep Portkey for model access, deploy everything from GitLab.",
                              "S3 is the preferred candidate to evaluate first. It is not an unconditional winner: account approval, identity validation, gateway interoperability, enterprise policy and verified cost decide, and S2 or S1 remain valid outcomes.",
                              "Nothing is provisioned or approved by this deck. SAP Integration Suite stays the integration boundary and the SAP backend stays the business authority."], 14)

# 2 ------------------------------------------------------------------------------------------------ reference architecture
s = slide("Reference architecture aligned with S3", "Control plane, runtime plane and evidence plane; registration is never an execution hop", 2)
text(s, 0.4, 1.05, 3, 0.3, "RUNTIME PLANE", 10, True, GREY)
ui = box(s, 0.4, 1.4, 1.5, 0.9, "SAP Fiori / app client", "", "ui")
ag = box(s, 2.2, 1.4, 1.8, 0.9, "AgentCore Runtime agent", "AWS SAP-agent account", "agent")
gw = box(s, 4.3, 1.4, 1.8, 0.9, "AgentCore Gateway", "runtime gateway", "gateway")
ap = box(s, 6.4, 1.4, 1.8, 0.9, "Google Apigee MCP", "SAP-facing gateway", "gateway")
ints = box(s, 8.5, 1.4, 1.8, 0.9, "SAP Integration Suite", "integration boundary", "integration")
cc = box(s, 10.6, 1.4, 1.1, 0.9, "Cloud Connector", "conditional", "integration", dashed=True)
sap = box(s, 12.0, 1.4, 1.0, 0.9, "SAP backend", "authorizes", "backend")
for a, b in ((ui, ag), (ag, gw), (gw, ap), (ap, ints), (ints, cc), (cc, sap)):
    link(s, a, b)
text(s, 0.4, 2.6, 4, 0.3, "LLM · IDENTITY · DEPLOYMENT", 10, True, GREY)
pk = box(s, 2.2, 2.95, 1.8, 0.8, "Portkey", "LLM gateway", "llm")
llm = box(s, 4.3, 2.95, 1.8, 0.8, "Approved LLM", "only via Portkey", "llm")
link(s, pk, llm, color=RGBColor(0x7B, 0x3F, 0xA0))
arrow(s, (ag.left + ag.width // 2, ag.top + ag.height), (pk.left + pk.width // 2, pk.top), RGBColor(0x7B, 0x3F, 0xA0))
idp = box(s, 0.4, 2.95, 1.5, 0.8, "Corporate IdP · IAS", "identity", "identity")
gl = box(s, 6.4, 2.95, 2.4, 0.8, "GitLab CI/CD", "deploys runtime, targets, bundles, records", "artifact")
text(s, 0.4, 4.0, 4, 0.3, "CONTROL PLANE · EVIDENCE PLANE", 10, True, GREY)
reg = box(s, 2.2, 4.35, 3.0, 0.9, "AWS Agent Registry", "agent and MCP records · discovery · approval", "registry")
fnd = box(s, 5.6, 4.35, 2.4, 0.9, "AI Foundry governance", "registry owner · approval", "decision")
obs = box(s, 8.4, 4.35, 3.4, 0.9, "Observability and audit", "one correlation id across all systems", "artifact")
arrow(s, (fnd.left, fnd.top + fnd.height // 2), (reg.left + reg.width, reg.top + reg.height // 2), RGBColor(0xB3, 0x26, 0x1E), dashed=True)
arrow(s, (ag.left + 200000, ag.top + ag.height), (reg.left + 400000, reg.top), RGBColor(0x0C, 0x8F, 0x76), dashed=True)
arrow(s, (gl.left, gl.top), (ag.left + ag.width, ag.top + ag.height), GREY, dashed=True)
text(s, 0.4, 5.5, 12.5, 1.4, ["Solid arrows are runtime calls; dashed green is registration and discovery; dashed grey is deployment from GitLab; purple is LLM traffic.",
                             "S1 replaces AgentCore with SAP BTP Cloud Foundry and drops the gateway hop; S2 drops Apigee unless SAP Integration requires it."], 12, False, GREY)

# 3 ------------------------------------------------------------------------------------------------ scenarios
s = slide("Three scenarios: hosting, gateways and registration", "Four independent decisions, with gateway mediation and the LLM gateway identified separately", 3)
rows = [["Decision", "S1 SAP-hosted hybrid", "S2 AWS AgentCore-native", "S3 AgentCore + Apigee"],
        ["Agent hosting and execution", "SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "AWS AgentCore Runtime"],
        ["Agent registration", "AWS Agent Registry", "AWS Agent Registry", "AWS Agent Registry"],
        ["MCP implementation hosting", "Cloud Foundry, if required", "AgentCore Runtime, when required", "Conditional; AgentCore Runtime preferred, via Apigee"],
        ["MCP registration", "AWS Agent Registry", "AWS Agent Registry", "AWS Agent Registry"],
        ["Runtime gateway", "Apigee", "AgentCore Gateway (Apigee optional)", "AgentCore Gateway in front of Apigee"],
        ["MCP pattern", "A by default; B if code is needed", "API/OpenAPI target or custom MCP", "A by default; B if Apigee-managed is insufficient"],
        ["AWS account", "Registry only (governance account)", "Dedicated SAP-agent account", "Dedicated SAP-agent account"]]
table(s, 0.4, 1.2, 12.5, rows, [2.7, 3.2, 3.3, 3.3], 11, row_h=0.5)
text(s, 0.4, 5.4, 12.5, 1.5, ["Rules: AgentCore Runtime hosts; AgentCore Gateway mediates and is not an agent host; AWS Agent Registry registers and is neither a gateway nor a hop; Apigee exposes SAP MCP/API capabilities and does not host arbitrary agent code.",
                             "Registration, deployment, authentication, authorization and execution are separate states. A registered skill never grants tool permissions."], 12)

# 4 ------------------------------------------------------------------------------------------------ AWS account
s = slide("Dedicated SAP-agent AWS account (proposal)", "Isolated execution for SAP-related agents; one central registry; nothing is provisioned", 4)
org = box(s, 0.5, 1.2, 12.3, 0.7, "AWS Organizations and landing zone", "SCPs · region and data-residency policy · enterprise compliance", "decision")
gov = box(s, 0.5, 2.3, 5.2, 1.3, "AI Foundry governance account", "central AWS Agent Registry · curator and approval roles · shared with workload accounts (AWS RAM, to confirm)", "registry")
wl = box(s, 7.6, 2.3, 5.2, 1.3, "SAP-agent workload account (proposed)", "AgentCore Runtime and Gateway · development, test and production separated", "agent")
arrow(s, (wl.left, wl.top + wl.height // 2), (gov.left + gov.width, gov.top + gov.height // 2), RGBColor(0x0C, 0x8F, 0x76), dashed=True)
text(s, 5.75, 2.4, 1.8, 0.6, "publish records", 10, False, RGBColor(0x0C, 0x8F, 0x76), PP_ALIGN.CENTER)
gl = box(s, 0.5, 4.0, 5.2, 0.9, "GitLab (central platform)", "pipelines deploy the runtime and publish registry records", "artifact")
net = box(s, 7.6, 4.0, 5.2, 0.9, "Network, egress, Portkey", "approved path to Apigee and Integration Suite", "integration")
arrow(s, (gl.left + gl.width, gl.top + gl.height // 2), (wl.left, wl.top + wl.height), GREY, dashed=True)
arrow(s, (org.left + org.width // 2, org.top + org.height), (gov.left + gov.width // 2, gov.top), RGBColor(0xB3, 0x26, 0x1E), dashed=True)
text(s, 0.5, 5.15, 12.3, 1.8, ["Evaluate: landing zone, environment separation, IAM least privilege, SCPs, region, AgentCore availability and quotas, networking, secrets, cost allocation, monitoring, tagging.",
                              "Account provisioning does not prove access to every AgentCore capability; confirm policy, entitlements, permissions and region. Cross-account registry sharing was NOT verified in this build. Do not create a duplicate registry."], 12)

# 5 ------------------------------------------------------------------------------------------------ gateways
s = slide("AgentCore Gateway versus Google Apigee (S3)", "Candidate responsibilities, validated rather than assumed; no duplicated policy", 5)
rows = [["Responsibility", "AgentCore Gateway", "Google Apigee"]] + [[r[0], r[1], r[2]] for r in m.GATEWAY_RESPONSIBILITIES]
table(s, 0.4, 1.15, 12.5, rows, [2.6, 5.0, 4.9], 9, row_h=0.5)
text(s, 0.4, 6.45, 12.5, 0.55, "Tests before any commitment: protocol compatibility, token handling, tool names, authorization at both gateways, timeouts, rate limits, error mapping, duplicate policy, logging correlation, revocation.", 10, False, GREY)

# 6 ------------------------------------------------------------------------------------------------ registration lifecycle
s = slide("Agent and MCP registration lifecycle", "Publication is metadata: not proof of reachability, authorization or SAP execution", 6)
steps = ["Capability developed", "Versioned artifact (GitLab)", "Domain validation", "Approval", "Registry publication", "Discovery", "Invocation under runtime authorization", "Monitoring", "Update or retirement"]
prev = None
for i, step in enumerate(steps):
    x = 0.4 + (i % 5) * 2.55
    y = 1.4 if i < 5 else 3.1
    kind = "registry" if i in (4, 5) else "agent" if i == 6 else "artifact"
    shp = box(s, x, y, 2.2, 0.95, step, "", kind, 11)
    if prev is not None and i not in (5,):
        link(s, prev, shp, dashed=i in (5, 6), color=RGBColor(0x0C, 0x8F, 0x76) if i in (5,) else BLUE)
    prev = shp
text(s, 0.4, 4.4, 12.5, 2.5, ["Registration, discovery, deployment and runtime validation are distinct evidence states; the order of publication and deployment may vary.",
                             "Synchronization from an external endpoint needs an HTTPS URL and a credential provider in the same account, runs on creation and on demand only, reverts the record to draft and is not documented to remove stale tools: retirement and revocation need an explicit process.",
                             "Proposal: the integration team publishes from the GitLab pipeline with the respective technical approvals; the AI Foundry curator approves."], 12)

# 7 ------------------------------------------------------------------------------------------------ placement policy
s = slide("Workload placement policy", "Approval gates lead to S1, S2 or S3; a missing approval never gives an unconditional choice", 7)
start = box(s, 0.4, 1.4, 2.2, 0.9, "Classify the workload", "SAP-specific or enterprise · frequency · bursts", "ui")
q1 = box(s, 3.0, 1.4, 2.6, 0.9, "AWS account and AgentCore approved?", "", "decision")
q2 = box(s, 6.0, 1.4, 2.4, 0.9, "Apigee required for the SAP route?", "", "decision")
q3 = box(s, 8.8, 1.4, 2.8, 0.9, "Identity and interop validated, cost competitive?", "", "decision")
hold = box(s, 3.0, 3.0, 2.6, 0.9, "HOLD / CONDITIONAL", "name the missing evidence", "gateway")
s1 = box(s, 0.4, 4.6, 3.6, 1.0, "S1 SAP-hosted hybrid", "AWS unavailable, or SAP coupling and verified cost favor BTP", "agent")
s2 = box(s, 4.5, 4.6, 3.6, 1.0, "S2 AWS AgentCore-native", "Apigee not mandated, or an exception is approved", "agent")
s3 = box(s, 8.6, 4.6, 4.2, 1.0, "S3 AgentCore + Apigee", "all conditions met, extra gateway justified by cost", "agent")
for a, b in ((start, q1), (q1, q2), (q2, q3)):
    link(s, a, b)
arrow(s, (q1.left + q1.width // 2, q1.top + q1.height), (hold.left + hold.width // 2, hold.top), GREY)
arrow(s, (q1.left + 400000, q1.top + q1.height), (s1.left + s1.width // 2, s1.top), GREY)
arrow(s, (q2.left + q2.width // 2, q2.top + q2.height), (s2.left + s2.width // 2, s2.top), GREY)
arrow(s, (q3.left + q3.width // 2, q3.top + q3.height), (s3.left + s3.width // 2, s3.top), GREY)
text(s, 0.4, 5.9, 12.5, 1.1, ["Labels on the arrows: no → S1 (when SAP-hosted agents are permitted) · pending → HOLD · yes → next gate · no Apigee mandate → S2 · all validated → S3.",
                             "The same rules run in the application (Selection · Recommendation) and are tested; there is no numerical score."], 11, False, GREY)

# 8 ------------------------------------------------------------------------------------------------ cost
s = slide("Cost governance and platform selection", "One workload, three scenarios, no invented rates", 8)
layers = [("Agent runtime", "BTP credits vs AgentCore"), ("AgentCore Gateway", "S2, S3"), ("Apigee", "S1, S3; S2 optional"), ("Integration Suite", "all"), ("Cloud Connector", "where applicable"),
          ("Portkey and model", "all"), ("Network and egress", "highest in S3"), ("Persistence", "conditional"), ("Observability", "per platform"), ("Support and staffing", "teams differ")]
for i, (t_, sub) in enumerate(layers):
    box(s, 0.4 + (i % 5) * 2.55, 1.25 + (i // 5) * 1.15, 2.3, 0.95, t_, sub, "gateway" if "Gateway" in t_ or t_ == "Apigee" else "integration" if "Integration" in t_ else "artifact", 11)
text(s, 0.4, 3.75, 12.5, 3.2, ["The application holds an editable model: monthly volumes for one workload definition and a per-scenario rate with its source for each layer. Totals appear only when every input is present, with plus or minus 20 percent sensitivity and a break-even volume.",
                              "Workload profiles to compare: low-frequency SAP-specific; high-frequency analytical; bursty enterprise; long-running reconciliation; multi-agent and multi-tool orchestration.",
                              "Hypotheses to test, not conclusions: SAP BTP credits may make frequent agent hosting expensive; the existing SAP AWS infrastructure may be unsuitable for AI-native workloads. A high invocation frequency does not automatically make AWS cheaper.",
                              "Needed from FinOps: BTP credit rates, enterprise AWS discounts, Apigee charges, support staffing, measured volumes."], 12)

# 9 ------------------------------------------------------------------------------------------------ identity
s = slide("Identity and principal propagation", "Six separate identities; SAP decides business authorization", 9)
chain = [("Business user", "enterprise authentication", "ui"), ("Agent workload", "AgentCore Identity", "agent"), ("MCP client", "token to the gateway", "agent"), ("Gateways", "AgentCore Gateway → Apigee", "gateway"),
         ("SAP integration", "Integration Suite · Cloud Connector", "integration"), ("SAP backend", "mapped user · SAP roles", "backend")]
prev = None
for i, (t_, sub, kind) in enumerate(chain):
    shp = box(s, 0.4 + i * 2.15, 1.5, 1.95, 1.0, t_, sub, kind, 11)
    if prev is not None:
        link(s, prev, shp, color=RGBColor(0xC2, 0x6A, 0x00), dashed=True)
    prev = shp
idp = box(s, 2.0, 3.1, 6.0, 0.8, "Corporate IdP · SAP Cloud Identity Services (candidate)", "issues and exchanges tokens · Global User ID is a correlation attribute", "identity")
text(s, 0.4, 4.2, 12.5, 2.8, ["Global User ID, a user-name header or a workload token alone is not principal propagation. Token exchange and user mapping are design assumptions until validated at every hop.",
                             "AgentCore Gateway supports outbound OAuth client credentials, authorization code and token exchange but not caller token passthrough; Apigee accepts OAuth 2.1 and OIDC.",
                             "Required negative test: an authorized and an unauthorized business user call the same read-only tool; SAP rejects the unauthorized one and the evidence names the execution identity.",
                             "Evaluate: corporate federation, IAS and provisioning, delegated tokens, Cloud Connector principal propagation, segregation of duties, audit correlation."], 12)

# 10 ----------------------------------------------------------------------------------------------- methodology and guardrails
s = slide("Common implementation methodology and guardrails", "Every scenario follows the same lifecycle", 10)
for i, step in enumerate(m.LIFECYCLE):
    x = 0.4 + (i % 6) * 2.12
    y = 1.3 + (i // 6) * 1.0
    box(s, x, y, 1.95, 0.8, step, "", "artifact" if i not in (7, 8) else "registry", 10)
rows = [["Guardrails (all scenarios)", ""]]
half = (len(m.GUARDRAILS) + 1) // 2
for a, b in zip(m.GUARDRAILS[:half], m.GUARDRAILS[half:] + [""]):
    rows.append([a, b])
table(s, 0.4, 3.5, 12.5, rows, [6.25, 6.25], 10, row_h=0.38)

# 11 ----------------------------------------------------------------------------------------------- RACI
s = slide("Operating ownership", "Who runs, who is accountable, who is consulted", 11)
rows = [["Area", "Responsible", "Accountable", "Consulted", "Informed"]] + m.RACI
table(s, 0.4, 1.3, 12.5, rows, [3.6, 2.6, 2.2, 2.2, 1.9], 11, row_h=0.5)
text(s, 0.4, 5.9, 12.5, 1.0, "To be confirmed by the named owners; two teams share incidents in S3 (AWS platform and integration), which needs one incident process and one correlation id.", 12, False, GREY)

# 12 ----------------------------------------------------------------------------------------------- POC and decisions
s = slide("Proof of concept and decisions awaiting approval", "Compare S2 and S3 first; include S1 as a baseline where SAP BTP is credible", 12)
text(s, 0.4, 1.1, 6.2, 0.3, "POC validations", 13, True)
text(s, 0.4, 1.45, 6.2, 5.5, ["• " + v for v in m.POC_VALIDATIONS], 10)
text(s, 6.9, 1.1, 6.0, 0.3, "Decisions awaiting approval", 13, True)
rows = [["Decision", "State"]]
for d in m.DECISIONS:
    states = [a[2] for a in d["answers"]]
    rows.append([d["title"], "OPEN" if "OPEN" in states else "OWNER-CONFIRMED" if "OWNER-CONFIRMED" in states else "DECIDED"])
table(s, 6.9, 1.45, 6.0, rows, [4.5, 1.5], 10, row_h=0.5)
text(s, 6.9, 5.2, 6.0, 1.7, ["Select S3 only when account, Apigee, gateway interoperability, principal propagation, ownership, cost and operations all pass. Otherwise S2 or S1.",
                             "Owner-confirmed: tenant entitlements are live; the integration team approves publishing. Decided: GitLab is the central platform."], 11)

OUT.parent.mkdir(parents=True, exist_ok=True)
prs.save(OUT)
print(f"wrote {OUT} ({len(prs.slides)} slides)")
