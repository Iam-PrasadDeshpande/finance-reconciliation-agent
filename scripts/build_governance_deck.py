"""Build the editable Enterprise AI Foundation & Governance deck (Architecture V5.2): 18 slides in the enterprise format
(kicker, status chip, action title, takeaway bar, source, confidentiality, page counter), native shapes only.

    python scripts/build_governance_deck.py [output.pptx]
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from pptx.enum.shapes import MSO_SHAPE  # noqa: E402
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN  # noqa: E402

import deck_kit as k  # noqa: E402
from deck_kit import C, arrow, card, legend, new_slide, node, rect, table, txt  # noqa: E402
from poc import architecture_model as m  # noqa: E402

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "docs" / "Enterprise_AI_Foundation_Governance_V5_2.pptx"
TOTAL = 18
D = k.Deck(TOTAL)
JOULE = "‡ Future option: SAP Joule Studio hosting, once our landscape supports it. Unverified; not a baseline dependency."


def dot(slide, x, y, color, d=0.17):
    s = slide.shapes.add_shape(MSO_SHAPE.OVAL, k.Inches(x), k.Inches(y), k.Inches(d), k.Inches(d))
    s.shadow.inherit = False
    s.fill.solid()
    s.fill.fore_color.rgb = k.rgb(color)
    s.line.fill.background()


# ------------------------------------------------------------------------------------------------------------------ 1
s = new_slide(D, "PURPOSE AND DECISIONS", "S3 = preferred to evaluate", "navy",
              "Enterprise AI Foundation — Architecture & Governance Framework",
              "Agree what must be decided before building. Owners and status of each decision are on slide 18.",
              "Source: owner brief; finance-reconciliation-agent repo, Architecture V5.2 decision record (decisions open).",
              JOULE,
              "Reusable, secure and governed AI for any SAP custom agent in any domain, across enterprise technology streams, without disconnected agent platforms or bypassed business-system controls. Finance is the first reference use case.",
              "PURPOSE. One reusable AI foundation so each technology stream does not build its own agent platform, integration pattern, security policy and operating process. Architecture V5.2 evaluates three scenarios (S1 SAP-hosted hybrid, S2 AWS AgentCore-native, S3 AgentCore + Apigee hybrid). S3 is the preferred candidate to evaluate first; it is not approved and not an unconditional winner. GitLab is the central platform that deploys everything and is never a runtime.")
cards = [("1 · EXECUTE", "Where do agents and MCP capabilities execute?",
          ["Hosts: AgentCore Runtime (S2, S3), BTP Cloud Foundry (S1); Joule Studio later ‡", "AgentCore Gateway mediates; Apigee is the SAP-facing gateway, not a runtime", "Custom MCP code only if APIs fall short"]),
         ("2 · REGISTER", "How are capabilities registered, discovered and reused?",
          ["Hosting, registration and gateway are separate", "AWS Agent Registry in all three scenarios, central and shared", "Registered does not mean allowed to run"]),
         ("3 · IDENTIFY", "How are identity and authorization preserved?",
          ["Six identities kept separate", "Global User ID correlates, never authorizes", "SAP backend decides business authorization"]),
         ("4 · GOVERN", "How are solutions governed to production?",
          ["One lifecycle and eight stage gates", "Four risk tiers; read-only first", "Designed ≠ deployed ≠ verified", "GitLab deploys everything; never a runtime"])]
for i, (kk, t, b) in enumerate(cards):
    card(s, 0.5 + i * 3.127, 1.7, 2.95, 2.62, kk, t, b, tag=f"s1 card {i}")
txt(s, 0.5, 4.5, 12.3, 0.24, [{"text": [("DECISION MATURITY  ·  ", {"bold": True}), ("qualitative status, no completion percentages", {"bold": True, "color": "mute"})]}], 10, "mute", tag="maturity")
tiles = [("Architecture direction (S3)", "Preferred to evaluate · not approved", "blue"), ("Dedicated SAP-agent AWS account", "Proposal · approval pending", "orange"),
         ("SAP-facing Apigee gateway", "Required in S1 and S3", "green"), ("AgentCore Gateway to Apigee", "Interoperability · POC pending", "red"),
         ("End-to-end SAP identity proof", "POC pending", "red"), ("Verified cost evidence", "No rates entered · pending", "orange")]
for i, (t, st, col) in enumerate(tiles):
    x = 0.5 + i * 2.076
    rect(s, x, 4.8, 1.95, 1.5, "gray", None)
    txt(s, x + 0.08, 4.86, 1.8, 0.5, t, 10.5, "navy", True, tag=f"tile {i}")
    dot(s, x + 0.1, 5.5, col)
    txt(s, x + 0.34, 5.45, 1.55, 0.8, st, 10.5, col, True, tag=f"tile status {i}")

# ------------------------------------------------------------------------------------------------------------------ 2
s = new_slide(D, "LANDSCAPE AND SCOPE", "Owner landscape · to verify", "warn",
              "Finance landscape as the first reference: attach SAP agents to Invest platforms, not Disinvest ones",
              "Attach agents to Invest / Maintain platforms through Integration Suite; each SAP domain repeats this map.",
              "Source: owner's current-state finance landscape (internal, private); owner brief. Version and connectivity details: to verify.", JOULE,
              notes="WHAT THIS SLIDE FIXES. A shared picture of in-scope systems, boundaries and ownership. It is the declared landscape from the owner brief, not an inventory of what is configured.")
FILL = {"i": "greenbg", "d": "redbg", "m": "slatebg"}
for j, (lab, key) in enumerate((("Invest", "i"), ("Disinvest", "d"), ("Maintain", "m"))):
    rect(s, 5.25 + j * 1.3, 1.44, 0.22, 0.14, FILL[key], "line", 0.75)
    txt(s, 5.53 + j * 1.3, 1.4, 1.0, 0.22, lab, 10, tag="landscape legend")


def tiles_row(y, items, h):
    for x, w, t, st in items:
        rect(s, x, y, w, h, FILL.get(st, "white"), "line", 0.75)
        txt(s, x, y, w, h, t, 9.5, "ink", True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, tag=f"landscape {t[:20]}")


txt(s, 0.5, 1.68, 4.5, 0.2, "SAAS APPLICATIONS", 9, "mute", True, tag="lbl")
tiles_row(1.9, [(0.5, 1.6, "SAP Analytics Cloud", "m"), (2.2, 1.6, "Qlik Sense", "m"), (3.9, 1.6, "Workday", "m"), (5.6, 1.6, "SAP Concur", "m"), (7.3, 1.6, "SAP Ariba", "m")], 0.46)
txt(s, 0.5, 2.55, 4.5, 0.2, "MIDDLEWARE", 9, "mute", True, tag="lbl")
tiles_row(2.77, [(0.5, 1.9, "SAP Integration Suite", "i"), (2.5, 1.9, "SAP PI/PO", "d"), (4.5, 1.9, "Snaplogic", "m")], 0.46)
txt(s, 6.55, 2.77, 2.5, 0.46, "Agent integrations: Integration Suite only", 9.5, "navy", True, anchor=MSO_ANCHOR.MIDDLE, tag="lbl")
txt(s, 0.5, 3.42, 6, 0.2, "CORE APPLICATIONS (drawn on AWS)", 9, "mute", True, tag="lbl")
tiles_row(3.64, [(0.5, 1.65, "SYNG Core · S/4HANA · invest", "i"), (2.2, 1.65, "nSAP · ECC classic GL · disinvest", "d"), (3.9, 1.65, "FOU · ECC new GL · disinvest", "d"),
                 (5.6, 1.65, "SLT · replication · maintain", "m"), (7.3, 1.75, "Central Finance · S/4HANA · TRM · maintain", "m")], 0.56)
tiles_row(4.26, [(0.5, 1.0, "BW/4HANA maintain", "m"), (1.58, 0.95, "SBFC disinvest", "d"), (2.61, 0.9, "MDG invest", "i"), (3.59, 1.0, "CFIN MDG disinvest", "d"),
                 (4.67, 0.95, "MDMi disinvest", "d"), (5.7, 0.95, "FSCM disinvest", "d"), (6.73, 1.0, "Fiori GW disinvest", "d"), (7.81, 1.24, "EBI/EDWH disinvest", "d")], 0.56)
txt(s, 0.5, 4.9, 8.6, 0.8, [{"text": [("Satellite  ", {"bold": True}), ("Celonis · Auto Bank · Biller Direct (D) · Sabrix · VIM · Tagetik (leases) · Edicom (e-invoicing) · RMS · SNOW · Bloomberg · DRC · Salesforce AR · AICO", {})]},
                            {"text": [("HR  ", {"bold": True}), ("ADP · Ramco · Workday · Magnit VMS    ", {}), ("Costing  ", {"bold": True}), ("Supernova (I) · GPC (D) · CRISP (D)    ", {}), ("Analytics  ", {"bold": True}), ("Smartmart on Amazon Redshift (D)", {})], "space": 2},
                            {"text": "(I) invest · (D) disinvest · unmarked = maintain", "color": "mute", "space": 2}], 9, tag="satellite")
rect(s, 9.25, 1.4, 3.58, 4.32, "white", "line", 1.0)
txt(s, 9.35, 1.45, 3.4, 4.2, [{"text": "WHERE AGENTS ATTACH  ·  finance shown", "size": 10, "bold": True, "color": "blue"},
                             {"text": [("Transactional  ", {"bold": True, "color": "navy"}), ("SYNG Core (S/4HANA) through Integration Suite", {})], "space": 7},
                             {"text": [("Reconciliation  ", {"bold": True, "color": "navy"}), ("Source ledgers vs Central Finance; SLT replication", {})], "space": 7},
                             {"text": [("Analytical  ", {"bold": True, "color": "navy"}), ("BW/4HANA and SAP Analytics Cloud", {})], "space": 7},
                             {"text": [("SaaS  ", {"bold": True, "color": "navy"}), ("Concur, Ariba, Workday through approved APIs", {})], "space": 7},
                             {"text": [("RULE  ", {"bold": True, "color": "red"}), ("Build on Invest and Maintain platforms; no new dependency on PI/PO, SBFC, nSAP / FOU (ECC) or Fiori Gateway. Every other SAP domain repeats this map before onboarding.", {})], "space": 10}], 10, tag="attach panel")
rect(s, 0.5, 5.78, 12.33, 0.66, "gray", None)
txt(s, 0.6, 5.8, 12.1, 0.62, [{"text": [("FIXED PRINCIPLES   ", {"bold": True, "color": "blue"}),
                                      ("P1 Central governance, federated build  ·  P2 Hosting ≠ registration ≠ gateway  ·  P3 Apigee is a gateway, not a runtime  ·  P4 Two host families: AWS AgentCore and SAP-hosted (Cloud Foundry now, Joule Studio ‡ later)  ·  P5 Portkey is the LLM gateway  ·  P6 SAP backend authorizes  ·  P7 Registered ≠ allowed  ·  P8 Integration ≠ identity  ·  P9 Reuse before build  ·  P10 Evidence before production  ·  P11 GitLab deploys, never runs", {})]}],
    9.5, "navy", tag="principles")

# ------------------------------------------------------------------------------------------------------------------ 3
s = new_slide(D, "REFERENCE ARCHITECTURE · S3 HYBRID", "S3 · to validate in POC", "warn",
              "Reference architecture: AgentCore-hosted agents behind AgentCore Gateway and Apigee, registered on a separate control plane",
              "Nothing on the invocation path depends on the registry. Both gateways are in the path: interoperability is a POC item.",
              "Source: owner brief; repo V5.2 model (D4, D6); AWS and Google docs as logged in repo (2026-11-25). S3 approval pending.", JOULE,
              notes="S3 IS THE PREFERRED CANDIDATE TO EVALUATE FIRST, NOT AN APPROVED DESIGN. Paths: user to Fiori to the AgentCore Runtime agent; the agent calls the approved LLM only via Portkey; MCP calls pass AgentCore Gateway, then Google Apigee, then Integration Suite, Cloud Connector where applicable, then the SAP backend, which authorizes the mapped user. The registry is a metadata plane: GitLab publishes records, AI Foundry approves them, and nothing at runtime looks them up. GitLab deploys the runtime image, gateway targets, Apigee bundles and registry records.")
legend(s, [("Runtime path", "run"), ("Registration (control plane)", "reg"), ("LLM call", "llm"), ("Identity / token", "id"), ("Deployment (GitLab)", "dep")], 0.5, 1.4)
lanes = [("1 · User", "Business owner"), ("2 · Agent execution", "Domain agent team"), ("3 · AI governance", "AI Foundry · GitLab"), ("4 · MCP / API", "Integration team"),
         ("5 · Identity", "InfoSec"), ("6 · SAP / data", "System owners"), ("7 · Evidence", "Ops · Cloud ALM")]
lh = [0.62, 0.62, 0.66, 0.66, 0.62, 0.66, 0.5]
ly, y0 = [], 1.68
for h in lh:
    ly.append(y0)
    y0 += h + 0.035
for i, (a, b) in enumerate(lanes):
    rect(s, 0.5, ly[i], 12.33, lh[i], "gray" if i % 2 == 0 else "white", None)
    rect(s, 0.5, ly[i], 1.55, lh[i], "slatebg", None)
    txt(s, 0.55, ly[i] + 0.02, 1.5, lh[i] - 0.04, [{"text": a, "size": 10.5, "bold": True, "color": "navy"}, {"text": b, "size": 8.5, "color": "mute"}], 10, anchor=MSO_ANCHOR.MIDDLE, tag=f"lane {a}")


def ny(i):
    return ly[i] + 0.07, lh[i] - 0.14


y, h = ny(0)
node(s, 2.15, y, 1.9, h, "Business user", "", "ui")
node(s, 4.45, y, 2.0, h, "SAP Fiori / UI5", "", "agent")
arrow(s, 4.05, y + h / 2, 4.45, y + h / 2)
y, h = ny(1)
node(s, 2.15, y, 5.0, h, "Domain agent · AWS AgentCore Runtime", "MCP client · bounded autonomy · dedicated SAP-agent account (proposed)", "agent", tag="agent")
node(s, 7.55, y, 1.55, h, "Portkey gateway", "common LLM gateway", "llm")
node(s, 9.3, y, 1.55, h, "Approved LLM", "only via Portkey", "llm")
node(s, 11.0, y, 1.75, h, "CF agent · S1 host", "alternative host", "agent", dashed=True)
arrow(s, 7.15, y + h / 2, 7.55, y + h / 2, "llm")
arrow(s, 9.1, y + h / 2, 9.3, y + h / 2, "llm")
arrow(s, 3.1, ly[0] + lh[0] - 0.07, 3.1, ly[1] + 0.07)
y, h = ny(2)
node(s, 4.3, y, 2.1, h, "GitLab CI/CD", "central platform · deploys, never runs", "mute", tag="gitlab")
node(s, 7.0, y, 2.75, h, "AWS Agent Registry", "agent + MCP endpoint records · metadata only", "reg", tag="registry")
node(s, 10.5, y, 2.25, h, "AI Foundry", "approves records", "ok")
arrow(s, 10.5, y + h / 2, 9.75, y + h / 2, "reg")
arrow(s, 8.4, ly[1] + lh[1] - 0.07, 8.4, y, "reg")
arrow(s, 5.4, y, 5.4, ly[1] + lh[1] - 0.07, "dep")
txt(s, 8.45, ly[1] + lh[1] - 0.1, 1.3, 0.16, "register agent", 8, "green", True, tag="lbl")
y, h = ny(3)
node(s, 2.15, y, 1.9, h, "AgentCore Gateway", "mediates · tool policy", "gw2", tag="gw")
node(s, 4.4, y, 1.9, h, "Google Apigee", "SAP MCP/API · quota · auth", "gw")
node(s, 6.65, y, 1.85, h, "Integration Suite", "SAP mediation · iFlows", "agent")
node(s, 8.8, y, 1.7, h, "Cloud Connector", "where applicable", "agent", dashed=True)
node(s, 10.8, y, 1.95, h, "Custom MCP", "AgentCore Runtime · if required", "agent", dashed=True)
for a, b in ((4.05, 4.4), (6.3, 6.65), (8.5, 8.8)):
    arrow(s, a, y + h / 2, b, y + h / 2)
arrow(s, 3.1, ly[1] + lh[1] - 0.07, 3.1, y)
txt(s, 3.18, ly[2] + 0.15, 1.1, 0.2, "MCP tools/call", 9, "navy", True, tag="lbl")
y, h = ny(4)
node(s, 2.15, y, 1.9, h, "Corporate IdP", "federated · Global User ID", "idn")
node(s, 4.3, y, 2.2, h, "Trust and token exchange", "IAS trust · profile = POC item", "idn", dashed=True)
node(s, 6.75, y, 1.9, h, "SAP user mapping", "to validate", "idn", dashed=True)
arrow(s, 4.05, y + h / 2, 4.3, y + h / 2, "id")
arrow(s, 6.5, y + h / 2, 6.75, y + h / 2, "id")
txt(s, 10.6, y + 0.1, 2.1, 0.3, "Released APIs", 10, "navy", True, anchor=MSO_ANCHOR.MIDDLE, tag="lbl")
y, h = ny(5)
node(s, 2.15, y, 1.9, h, "SaaS / non-SAP APIs", "Concur · Ariba · Workday", "plain", dashed=True)
node(s, 4.3, y, 2.5, h, "Data products / analytics", "BW/4HANA · SAC · BDC (to verify)", "agent", dashed=True)
node(s, 7.1, y, 5.65, h, "SAP backend", "per domain · finance: SYNG Core + Central Finance · authorizes the mapped user", "sap", tag="sap")
arrow(s, 10.4, ly[3] + lh[3] - 0.07, 10.4, y)
y, h = ny(6)
node(s, 2.15, y, 10.6, h, "Evidence plane", "Cloud ALM = SAP-side monitoring · separate evidence store (TBD) joins AgentCore, Apigee, Portkey and registry logs by correlation ID", "ui", ss=8.5, tag="evidence")

# ------------------------------------------------------------------------------------------------------------------ 4
s = new_slide(D, "HOSTING PATTERNS", "S3 = preferred to evaluate", "navy",
              "Three scenarios against the enterprise blueprint; S3 is the preferred candidate to evaluate first, not a decision",
              "S3 reuses the blueprint's registry, gateways and Portkey; it adds Apigee for SAP-specific MCP/API governance.",
              "Source: owner's enterprise AI agent platform blueprint (internal, private); repo V5.2 model. No scores are implied.", JOULE,
              notes="THREE SCENARIOS ONLY. S1 SAP-hosted hybrid; S2 AWS AgentCore-native; S3 AgentCore + Apigee hybrid. Classification: S1 SAP-hosted alternative, S2 AWS-native alternative, S3 preferred candidate for a comparative POC, conditional. The same labels, colours and ownership boundaries are used on every slide.")
topos = [("S1 · SAP-hosted hybrid", [("SAP Fiori / UI", "ui"), ("BTP Cloud Foundry agent", "agent"), ("Google Apigee", "gw"), ("Integration Suite", "agent"), ("SAP backend", "sap")],
          [("Portkey", "", "llm", False), ("AWS Agent Registry", "metadata only", "reg", False), ("Joule Studio ‡", "future host", "mute", True)],
          "+ SAP execution; Apigee-governed SAP route", "– Cloud Foundry cost and quota unverified", False),
         ("S2 · AWS AgentCore-native", [("SAP Fiori / UI", "ui"), ("AgentCore Runtime agent", "agent"), ("AgentCore Gateway", "gw2"), ("Integration Suite / API target", "agent"), ("SAP backend", "sap")],
          [("Portkey", "", "llm", False), ("AWS Agent Registry", "agent + MCP", "reg", False), ("Apigee: optional", "if SAP requires", "gw", True)],
          "+ AWS-managed runtime, gateway, registry", "– Apigee mandate decides; identity unproven", False),
         ("S3 · AgentCore + Apigee hybrid", [("SAP Fiori / UI", "ui"), ("AgentCore Runtime agent", "agent"), ("AgentCore Gateway", "gw2"), ("Google Apigee", "gw"), ("Integration Suite", "agent"), ("SAP backend", "sap")],
          [("Portkey", "", "llm", False), ("AWS Agent Registry", "separate control plane", "reg", False)],
          "+ managed runtime + SAP-facing Apigee", "– Two gateways; interoperability unproven", True)]
for i, (name, stack, side, plus, minus, hot) in enumerate(topos):
    x = 0.5 + i * 4.19
    rect(s, x, 1.45, 3.95, 2.85, "white", "blue" if hot else "line", 2.5 if hot else 1.0)
    txt(s, x + 0.12, 1.5, 3.7, 0.32, name, 14, "navy", True, tag="topo name")
    n = len(stack)
    nh = 0.27 if n == 6 else 0.31
    for j, (t, kd) in enumerate(stack):
        yy = 1.88 + j * (nh + 0.06)
        node(s, x + 0.12, yy, 2.0, nh, t, "", kd, ts=9, lw=1.0, tag=f"topo {t}")
        if j:
            arrow(s, x + 1.12, yy - 0.06, x + 1.12, yy, "run", True, 1.0)
    for j, (t, sub, kd, dsh) in enumerate(side):
        node(s, x + 2.3, 2.2 + j * 0.54, 1.5, 0.48, t, sub, kd, dashed=dsh, ts=9, ss=7.5, lw=1.0, tag=f"side {t}")
    txt(s, x + 0.12, 3.82, 3.7, 0.2, plus, 9, "green", True, tag="plus")
    txt(s, x + 0.12, 4.03, 3.7, 0.2, minus, 9, "red", True, tag="minus")
rows = [["Blueprint layer", "S1 · SAP-hosted hybrid", "S2 · AWS AgentCore-native", "S3 · AgentCore + Apigee hybrid"],
        ["Agent runtime", "SAP BTP Cloud Foundry (Joule Studio ‡ later)", "AWS AgentCore Runtime", "AWS AgentCore Runtime"],
        ["Tool / MCP gateway", "Apigee only; no AgentCore Gateway", "AgentCore Gateway; Apigee optional", "AgentCore Gateway in front of Apigee"],
        ["Agent + MCP registries", "AWS Agent Registry (registration only)", "AWS Agent Registry", "AWS Agent Registry (separate path)"],
        ["Model gateway", "Portkey", "Portkey", "Portkey"],
        ["Identity", "Corporate IdP + SAP trust; CF workload identity", "Corporate IdP + AgentCore Identity", "Corporate IdP + AgentCore Identity; exchange to prove"],
        ["AWS account", "Governance account (registry) only", "Dedicated SAP-agent account (proposed)", "Dedicated SAP-agent account (proposed)"]]
table(s, 0.5, 4.38, 12.33, [2.0, 3.4, 3.4, 3.53], rows, 9, 0.28, hl_col=3)

# ------------------------------------------------------------------------------------------------------------------ 5
s = new_slide(D, "AWS ACCOUNT AND REGISTRY", "Proposal · approval pending", "warn",
              "Dedicated SAP-agent AWS account: isolated execution, one central registry, nothing provisioned yet",
              "Execution is isolated per account; governance stays central. Account approval and registry sharing decide S2 and S3.",
              "Source: owner brief; repo V5.2 model (D6); AWS registry docs (2026-11-25). Cross-account sharing: NOT verified.",
              notes="PROPOSAL, NOT PROVISIONED. Account provisioning does not prove access to every AgentCore capability: confirm enterprise service policy, actual entitlements, permissions and regional support. Do not create a duplicate registry because execution uses a dedicated account.")
node(s, 0.5, 1.45, 7.2, 0.55, "AWS Organizations and landing zone", "SCPs · region and data-residency policy · enterprise compliance · cost allocation", "mute", tag="org")
node(s, 0.5, 2.3, 3.3, 1.55, "AI Foundry governance account", "Central AWS Agent Registry · curator and approval roles · shared to workload accounts through AWS Organizations and AWS RAM (to confirm)", "reg", ss=9, tag="gov")
node(s, 4.4, 2.3, 3.3, 1.55, "SAP-agent workload account (proposed)", "AgentCore Runtime and Gateway for SAP-related agents · development, test and production separated · IAM least privilege", "agent", ss=9, tag="wl")
arrow(s, 4.4, 3.1, 3.8, 3.1, "reg")
txt(s, 3.8, 2.72, 0.6, 0.34, ["publish", "records"], 8, "green", True, align=PP_ALIGN.CENTER, tag="lbl", margin=0)
arrow(s, 2.2, 2.0, 2.2, 2.3, "red")
arrow(s, 6.05, 2.0, 6.05, 2.3, "red")
node(s, 0.5, 4.15, 3.3, 0.95, "GitLab (central platform)", "pipelines deploy the runtime and publish registry records", "mute", tag="gitlab")
node(s, 4.4, 4.15, 3.3, 0.95, "Network, egress, Portkey", "approved path to Apigee and Integration Suite", "agent", tag="net")
arrow(s, 3.8, 4.62, 4.4, 4.62, "dep")
arrow(s, 6.05, 3.85, 6.05, 4.15, "run")
txt(s, 0.5, 5.2, 7.2, 1.2, [{"text": "Account provisioning does not prove access to every AgentCore capability: confirm policy, entitlements, permissions and region.", "bold": True, "color": "navy"},
                           {"text": "Do not create a duplicate registry because execution uses a dedicated account.", "space": 4}], 10.5, tag="acct note")
rect(s, 8.0, 1.45, 4.83, 2.3, "white", "line", 1.0)
txt(s, 8.1, 1.5, 4.65, 2.25, [{"text": "EVALUATE BEFORE ANY REQUEST", "size": 10, "bold": True, "color": "blue"}] +
    [{"text": "▪ " + t, "space": 3} for t in ["Dedicated account within the approved organization; landing-zone compliance", "Separate dev, test and production; IAM least privilege; SCP restrictions",
                                                 "Region and data residency; AgentCore availability and quotas", "Runtime and Gateway permissions; approved networking and egress",
                                                 "Access to Apigee, Integration Suite and Portkey; secrets and encryption", "Cost allocation, billing owner, monitoring, tagging"]], 9.5, tag="evaluate")
rect(s, 8.0, 3.9, 4.83, 1.7, "white", "orange", 1.0)
txt(s, 8.1, 3.95, 4.65, 1.6, [{"text": "CENTRAL REGISTRY · CONFIRM", "size": 10, "bold": True, "color": "orange"}] +
    [{"text": "▪ " + t, "space": 3} for t in ["Registry owned by AI Foundry; publisher and consumer permissions", "Curator approval authority; versioning and revocation", "Cross-account sharing (AWS Organizations, RAM) and region compatibility",
                                                 "Metadata sync and endpoint reachability (HTTPS URL; credential provider in the same account)"]], 9.5, tag="confirm")
rect(s, 8.0, 5.75, 4.83, 0.62, "redbg", "red", 1.0)
txt(s, 8.08, 5.76, 4.68, 0.6, [{"text": [("NOT VERIFIED   ", {"bold": True, "color": "red"}), ("Cross-account registry sharing and account service entitlements were not read in this build.", {})]}], 9.5, "navy", anchor=MSO_ANCHOR.MIDDLE, tag="notverified")

# ------------------------------------------------------------------------------------------------------------------ 6
s = new_slide(D, "GATEWAYS · S3", "Roles to validate in POC", "warn",
              "AgentCore Gateway and Google Apigee: candidate responsibilities, validated rather than assumed",
              "Separate the roles, avoid duplicated policy, and prove the hop before any commitment.",
              "Source: AWS and Google gateway docs as logged in repo (2026-11-25); repo V5.2 model. Capability, not tenant evidence.",
              notes="Neither gateway is assumed to provide every function. Validate supported features, avoid duplicated policy and ambiguous tool names, agree quota ownership and join logs with one correlation id.")
rows = [["Responsibility", "AgentCore Gateway (S2, S3)", "Google Apigee (S1, S3)", "Status"]] + [list(r) for r in m.GATEWAY_RESPONSIBILITIES]
table(s, 0.5, 1.4, 12.33, [2.1, 3.9, 3.4, 2.93], rows, 8.5, 0.4)
rect(s, 0.5, 5.7, 12.33, 0.68, "gray", None)
txt(s, 0.6, 5.72, 12.1, 0.64, [{"text": [("TESTS BEFORE ANY COMMITMENT   ", {"bold": True, "color": "blue"}),
                                       ("Protocol version compatibility · token handling and exchange · tool names (target prefix) · authorization at both gateways · timeouts · rate limits · error mapping · duplicate policy · log correlation · revocation", {})]}], 9.5, "navy", tag="tests")

# ------------------------------------------------------------------------------------------------------------------ 7
s = new_slide(D, "S3 · END TO END", "S3 detail · to validate", "warn",
              "S3 end to end: how a custom agent is built, approved, registered, deployed and run",
              "One path from GitLab to AgentCore; every release passes AI Foundry gates and is registered before it can be called.",
              "Source: owner's blueprint and landscape (internal, private); repo V5.2 model. Toolkit reuse and pipeline: to define.", JOULE,
              notes="BUILD: the domain team writes the agent spec, skills and MCP/tool contracts in GitLab; the CI pipeline builds, tests (including the injection suite) and checks integrity (tools/list hash). GOVERN + REGISTER: AI Foundry gates G0-G6 approve; the integration team publishes records to AWS Agent Registry with the respective technical approvals; GitLab deploys through infrastructure as code into the dedicated account. RUN: S3 runtime path. OBSERVE: drift returns to GitLab as a new version.")
for x, w, t, col in ((0.5, 3.4, "BUILD  ·  domain team (pro-code)", "blue"), (4.1, 3.45, "GOVERN + REGISTER  ·  AI Foundry", "amber"), (7.75, 5.08, "RUN  ·  S3 hybrid", "green")):
    txt(s, x, 1.4, w, 0.24, t, 10, col, True, tag="col head")
build = [("Domain dev team", "agent spec · skills · MCP contract", "agent"), ("GitLab repository", "code · skills · contracts · eval set", "mute"), ("GitLab CI pipeline", "build · tests · injection suite", "mute"),
         ("Quality + integrity", "SonarQube · tools/list hash", "mute"), ("Release artifact", "container image · versioned", "mute")]
for i, (t, sb, kd) in enumerate(build):
    yy = 1.7 + i * 0.7
    node(s, 0.5, yy, 3.4, 0.55, t, sb, kd, tag=f"build {t}")
    if i:
        arrow(s, 2.2, yy - 0.15, 2.2, yy)
node(s, 0.5, 5.25, 3.4, 0.6, "Do not integrate with", "PI/PO · SBFC · nSAP / FOU · Fiori GW (Disinvest)", "bad", dashed=True, ss=8.5, tag="dont")
gov = [("AI Foundry gates", "G0–G6: intake to release", "ok"), ("Agent Registry", "agent record (AWS)", "reg"), ("MCP / Tool Registry", "tool records + approved hash", "reg")]
for i, (t, sb, kd) in enumerate(gov):
    node(s, 4.1, 1.7 + i * 0.7, 3.45, 0.55, t, sb, kd, tag=f"gov {t}")
node(s, 4.1, 3.85, 3.45, 0.95, "Deploy from GitLab", "infrastructure as code into the dedicated AWS account: dev / test / prod", "agent", dashed=True, tag="deploy")
node(s, 4.1, 5.25, 3.45, 0.6, "Joule for Work track", "governed on the next slide", "mute", dashed=True)
arrow(s, 3.9, 2.0, 4.1, 2.0, "dep")
arrow(s, 3.9, 4.3, 4.1, 4.3, "dep")
arrow(s, 7.55, 4.3, 7.75, 4.3, "dep")
runs = [[("Fiori / UI5", "business user", "ui"), ("Corporate IdP", "sign-in · tokens", "idn"), ("Joule Studio ‡", "future agent host", "mute")],
        [("Domain agent", "AgentCore Runtime", "agent"), ("Portkey", "model gateway", "llm"), ("Approved LLMs", "only via Portkey", "llm")],
        [("AgentCore Gateway", "mediation · tool policy", "gw2"), ("Apigee", "MCP · quota · auth", "gw"), ("Integration Suite", "SAP mediation", "agent")],
        [("Cloud Connector", "where applicable", "agent"), ("SYNG Core", "S/4HANA · finance", "sap"), ("Central Finance", "S/4HANA · finance", "sap")],
        [("BW/4HANA · SAC", "analytical path", "agent"), ("SaaS APIs", "Concur Ariba Workday", "plain"), ("Identity chain", "negative test: slide 10", "idn")]]
for r, row in enumerate(runs):
    for c, (t, sb, kd) in enumerate(row):
        node(s, 7.75 + c * 1.72, 1.7 + r * 0.75, 1.62, 0.6, t, sb, kd, dashed=(t in ("Joule Studio ‡", "Cloud Connector", "Identity chain")), ts=9.5, ss=7.5, lw=1.0, tag=f"run {t}")
rect(s, 0.5, 5.95, 12.33, 0.45, "gray", None)
txt(s, 0.6, 5.97, 12.1, 0.42, [{"text": [("OBSERVE + IMPROVE   ", {"bold": True, "color": "blue"}), ("OpenTelemetry · Datadog · AgentCore and Apigee logs → evidence store (TBD) · Cloud ALM (SAP-side) · Confident AI + Amplitude · drift returns to GitLab as a new version", {})]}], 9.5, "navy", anchor=MSO_ANCHOR.MIDDLE, tag="observe")

# ------------------------------------------------------------------------------------------------------------------ 8
s = new_slide(D, "AI GOVERNANCE · TWO TRACKS", "Owner-declared · to verify", "warn",
              "Two AI tracks, one governance: custom agents and embedded Joule, with access run by GRC",
              "Both tracks are governed: AI Foundry gates for custom agents, GRC-run access for embedded Joule.",
              "Source: owner-declared (GRC, Work Zone); SAP pages via search summaries. Entitlement linkage: to verify with SAP.", JOULE,
              notes="TWO TRACKS. Track A = custom agents built by domain teams (pro-code), hosted on AgentCore Runtime in S2 and S3 and on Cloud Foundry in S1. Track B = embedded Joule: SAP-delivered Joule inside SAP applications. Owner-declared: embedded Joule is what is deployed at the moment; entitlement linkage must be verified with SAP.")
txt(s, 0.5, 1.4, 3.4, 0.24, "TRACK A  ·  CUSTOM AGENTS (pro-code)", 10, "blue", True, tag="hd")
for i, (t, sb, kd) in enumerate([("Domain dev team", "builds · tests · releases", "agent"), ("AI Foundry gates + registry", "G0–G6 · records · approvals", "ok"), ("AgentCore Runtime agent", "S1: Cloud Foundry · Joule Studio ‡ later", "agent"),
                                 ("Gateway MCP tools", "AgentCore Gateway · Apigee · quota · auth", "gw"), ("SAP backend", "authorizes the mapped user", "sap")]):
    node(s, 0.5, 1.7 + i * 0.7, 3.3, 0.55, t, sb, kd, tag=f"A {t}")
    if i:
        arrow(s, 2.15, 1.7 + i * 0.7 - 0.15, 2.15, 1.7 + i * 0.7)
txt(s, 4.0, 1.4, 4.6, 0.24, "TRACK B  ·  EMBEDDED JOULE (SAP-delivered)", 10, "purple", True, tag="hd")
colB = [("Corporate IdP", "federated", "idn"), ("Cloud Identity Services", "IAS user store · groups", "idn"), ("Identity Provisioning", "syncs users and roles", "idn"), ("BTP subaccount", "Work Zone + Joule (same one)", "agent"), ("Embedded Joule", "in SAP apps · Joule for Work", "llm")]
for i, (t, sb, kd) in enumerate(colB):
    node(s, 4.0, 1.7 + i * 0.7, 2.3, 0.55, t, sb, kd, tag=f"B {t}")
    if i:
        arrow(s, 5.15, 1.7 + i * 0.7 - 0.15, 5.15, 1.7 + i * 0.7)
colC = [("GRC team", "requests · approvals · SoD · reviews", "warn"), ("Roles + role collections", "Work Zone · GRC-managed", "idn"), ("S/4HANA content provider", "Fiori Launchpad content", "sap"), ("Joule for Consultants", "separate licence · admin-assigned", "mute")]
for i, (t, sb, kd) in enumerate(colC):
    node(s, 6.5, 2.4 + i * 0.7, 2.2, 0.55, t, sb, kd, ts=10, tag=f"C {t}")
rect(s, 8.95, 1.4, 3.88, 3.55, "white", "line", 1.0)
txt(s, 9.05, 1.45, 3.7, 3.5, [{"text": "ENTITLEMENT LINKAGE  ·  to verify with SAP", "size": 10, "bold": True, "color": "blue"}] +
    [{"text": [(f"{i + 1}  ", {"bold": True, "color": "blue"}), (t, {})], "space": 5} for i, t in enumerate([
        "Commercial: SKU, AI units and terms per product", "BTP: global account entitlements; Joule and Work Zone in one subaccount", "Identity: IAS user store, IPS sync, matching IAS domains",
        "Access: groups and roles in Work Zone, run by GRC", "Application: S/4HANA roles; Fiori content exposed to Work Zone", "Data: SAP backend authorizations decide what is returned"])] +
    [{"text": "Application and system details: owner to add", "color": "mute", "italic": True, "space": 6}], 9.5, tag="entitlement")
txt(s, 0.5, 5.2, 12.33, 0.22, [{"text": [("AI GOVERNANCE  ·  ", {"bold": True, "color": "blue"}), ("applies to both tracks", {"bold": True, "color": "mute"})]}], 10, tag="hd")
for i, (t, b) in enumerate([("Access", "A: corporate IdP + registry approval. B: GRC request, approval, SoD, periodic review."),
                            ("Scope + tier", "Approved use cases and features. Embedded Joule: read / recommend by default; actions need human confirmation."),
                            ("Model + data path", "A: via Portkey. B: SAP-managed models, outside Portkey: P5 exception to verify."),
                            ("Monitor + audit", "A: evidence plane. B: Joule / BTP audit and usage reporting (to verify). One incident process.")]):
    x = 0.5 + i * 3.1
    rect(s, x, 5.45, 3.0, 0.92, "gray", None)
    txt(s, x + 0.06, 5.47, 2.9, 0.9, [{"text": t, "bold": True, "color": "navy", "size": 10}, {"text": b, "size": 9, "space": 2}], 9, tag=f"gov {t}")

# ------------------------------------------------------------------------------------------------------------------ 9
s = new_slide(D, "ASSET GOVERNANCE", "Proposed standard", "warn",
              "Agents, MCP tools and skills: three governed assets, one metadata contract",
              "Publish all three against one metadata contract; keep the agent portable and the hosting binding swappable.",
              "Source: owner brief; AWS registry record types per repo log (2026-11-25). Fields are proposed.", JOULE,
              notes="THREE ASSETS, THREE DEFINITIONS. Agent = a deployable capability with execution ownership, identity, runtime configuration, model access, tools and lifecycle controls. MCP server/tool = a governed interface to an approved API or capability. Skill = versioned instructions guiding an agent; it declares expected tools and grants no execution authority.")
assets = [("AGENT", "A deployable capability with execution ownership", ["Portable spec: tier, tools, skills, model alias", "Model access via Portkey only", "Bounded autonomy, lifecycle controls"], "Registration does not permit execution"),
          ("MCP SERVER / TOOL", "A governed interface to an approved API or capability", ["Schema, authentication, permissions", "Endpoint ownership, versioning", "Read / write class per tool"], "Discovery does not authorize a call"),
          ("AGENT SKILL", "Versioned instructions (and resources) guiding an agent", ["Separately versioned, reviewed", "Declares expected tools, holds no rights", "A change in declared tools forces re-approval"], "A skill grants no execution authority")]
for i, (kk, t, bl, no) in enumerate(assets):
    x = 0.5 + i * 4.19
    rect(s, x, 1.4, 3.95, 2.1, "white", "line", 1.0)
    txt(s, x + 0.1, 1.44, 3.75, 1.45, [{"text": kk, "size": 10, "bold": True, "color": "blue"}, {"text": t, "size": 11.5, "bold": True, "color": "navy", "space": 2}] + [{"text": "▪ " + b, "size": 9.5, "space": 3} for b in bl], 9.5, tag=f"asset {kk}")
    rect(s, x + 0.1, 3.0, 3.75, 0.38, "redbg", None)
    txt(s, x + 0.14, 3.0, 3.7, 0.38, "✕  " + no, 10, "red", True, anchor=MSO_ANCHOR.MIDDLE, tag="no")
txt(s, 0.5, 3.6, 12.3, 0.24, [{"text": [("MANDATORY COMMON METADATA  ·  ", {"bold": True, "color": "navy"}), ("same 11 fields for all three asset types (proposed)", {"color": "mute", "bold": True})]}], 10, tag="hd")
fields = ["Owner", "Business purpose", "Endpoint / package", "Environment", "Version", "Security classification", "Tool / action permissions", "Approval status", "Dependencies", "Support owner", "Retirement / revocation"]
for i, f in enumerate(fields):
    r_, c_ = divmod(i, 6)
    x = 0.5 + c_ * 2.07
    rect(s, x, 3.9 + r_ * 0.48, 1.97, 0.4, "gray", None)
    txt(s, x + 0.04, 3.9 + r_ * 0.48, 1.9, 0.4, [{"text": [(f"{i + 1}  ", {"bold": True, "color": "blue"}), (f, {})]}], 9.5, anchor=MSO_ANCHOR.MIDDLE, tag=f"field {f}")
node(s, 0.5, 4.95, 6.0, 0.62, "HOSTING BINDING · swappable", "Runtime type (AgentCore Runtime | Cloud Foundry | Joule Studio ‡), manifest, workload identity, secrets source", "agent", ts=10, ss=9, tag="binding")
node(s, 6.65, 4.95, 6.18, 0.62, "MCP PROFILE · tool assets", "Protocol version, transport, tools/list hash, annotation hints (untrusted), token audience", "gw", ts=10, ss=9, tag="profile")
txt(s, 0.5, 5.68, 12.3, 0.2, [{"text": [("COMMON LIFECYCLE   ", {"bold": True, "color": "blue"}), ("Registered ≠ Deployed ≠ Runtime-verified: three separate states, each with its own evidence", {"bold": True, "color": "navy"})]}], 9.5, tag="life")
for i, st in enumerate(["Design", "Develop", "Validate", "Approve", "Register", "Deploy", "Operate", "Change / retire"]):
    x = 0.5 + i * 1.545
    sh = rect(s, x, 5.95, 1.49, 0.4, "bluebg" if i != 4 else "amberbg", "blue" if i != 4 else "amber", 1.0, False, MSO_SHAPE.PENTAGON)
    tf = sh.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = k.Inches(0.04)
    k.fill_tf(tf, [{"text": st}], 9, "navy", True, PP_ALIGN.CENTER)

# ------------------------------------------------------------------------------------------------------------------ 10
s = new_slide(D, "IDENTITY AND SECURITY", "Contract to validate in POC", "warn",
              "Identity contract: SAP authorizes the mapped business user, not a forwarded token",
              "Six identities stay separate; token exchange and user mapping are POC items, with a mandatory two-user negative test.",
              "Source: owner brief; repo model D7; AWS and Google docs (2026-11-25). Token-exchange and mapping: to validate.", JOULE,
              notes="THIS SLIDE DEFINES THE IDENTITY CONTRACT; IT DOES NOT CLAIM IT WORKS. AgentCore Gateway supports outbound OAuth client credentials, authorization code and token exchange but not caller token passthrough; Apigee accepts OAuth 2.1 and OIDC. Whether the exact exchange profile and the backend user mapping work end to end is a POC validation item.")
cols = [("Business user", ""), ("Corporate IdP", "federated"), ("Agent runtime", "AgentCore (S1: CF)"), ("MCP gateways", "AgentCore GW → Apigee"), ("Integration Suite", "+ Cloud Connector"), ("SAP backend", "")]
cx = [1.18 + i * 1.44 for i in range(6)]
for i, (t, sb) in enumerate(cols):
    node(s, cx[i] - 0.66, 1.4, 1.32, 0.62, t, sb, ["ui", "idn", "agent", "gw", "agent", "sap"][i], ts=9.5, ss=8, lw=1.0, tag=f"actor {t}")
    arrow(s, cx[i], 2.02, cx[i], 5.5, "dep", False, 0.75)
steps = [(0, 1, 2.25, "1  Authenticate (OIDC)", "id"), (0, 2, 2.65, "2  Request + user session", "run"), (2, 1, 3.05, "3  Token exchange †", "id"), (1, 2, 3.4, "4  Delegated user token", "id"),
         (2, 3, 3.8, "5  MCP tools/call + audience token", "run"), (3, 4, 4.2, "6  Gateways verify; user-bound token †", "run"), (4, 5, 4.6, "7  Mapped user / certificate †", "id"), (5, 2, 5.0, "8  Data, or authorization denied", "red")]
for a, b, yy, lab, kd in steps:
    arrow(s, cx[a], yy, cx[b], yy, kd, True, 1.5)
    lx = min(cx[a], cx[b]) + 0.04
    txt(s, lx, yy - 0.25, 0.062 * len(lab) + 0.12, 0.2, lab, 8.5, "navy", True, tag=f"step {lab}", fill="white", margin=0.03)
txt(s, 0.5, 5.55, 9.0, 0.25, "† token exchange, user binding and propagation are POC validation items; no technical-user fallback", 9, "mute", italic=True, tag="dagger")
rect(s, 9.35, 1.4, 3.48, 4.1, "white", "line", 1.0)
txt(s, 9.45, 1.45, 3.3, 4.0, [{"text": "SIX IDENTITIES, KEPT SEPARATE", "size": 10, "bold": True, "color": "blue"}] +
    [{"text": [(f"{i + 1}  {n}", {"bold": True, "color": "navy"}), ("  " + d, {"size": 8.5, "color": "mute"})], "space": 5} for i, (n, d) in enumerate([("Business user", "authenticated; Global User ID correlates only"), ("Agent workload", "workload identity, separate from the user"), ("MCP client", "token presented to the first gateway"), ("Gateway / service", "inbound validation; outbound exchange or credential"), ("SAP integration", "service identity; principal propagation to validate"), ("SAP backend", "mapped user executes; SAP roles decide")])] +
    [{"text": "Global User ID correlates; it never authorizes. Each hop accepts only tokens issued for it. No token passthrough.", "bold": True, "color": "red", "size": 9, "space": 6}], 9.5, tag="identities")
rect(s, 0.5, 5.85, 12.33, 0.55, "orangebg", "orange", 1.0)
txt(s, 0.6, 5.86, 12.1, 0.53, [{"text": [("MANDATORY NEGATIVE TEST   ", {"bold": True, "color": "orange"}), ("User A gets data. User B gets an SAP authorization denial. Two users call the same approved MCP tool; each outcome follows that user's own SAP permissions. No technical-user fallback. Result: PASS / HOLD / NOT_VERIFIED.", {})]}], 9.5, "navy", anchor=MSO_ANCHOR.MIDDLE, tag="negative")

# ------------------------------------------------------------------------------------------------------------------ 11
s = new_slide(D, "INTEGRATION AND DATA", "Selection rules · proposed", "warn",
              "Integration and data access: select the pattern by type of access",
              "Pick the pattern by access type. An analytical interface never authorizes an SAP transaction.",
              "Source: owner brief. BDC / Databricks activation unverified; Fivetran → Databricks for Concur is an evaluation candidate only.",
              notes="FOUR DISTINCT PATTERNS, not collapsed into one path. A: SAP transactional APIs via the gateways and Integration Suite (released APIs; RFC/BAPI/IDoc by approved exception). B: analytical access, never transactional authorization. C: SaaS systems with per-system entitlement. D: event-driven integration where supported.")
pats = [("PATTERN A", "SAP transactional APIs", [("Agent", "agent"), ("AgentCore GW · Apigee", "gw"), ("Integration Suite", "agent"), ("SAP backend", "sap")], "Released APIs per SAP Business Accelerator Hub (OData, SOAP). RFC / BAPI / IDoc by approved exception only. Via Integration Suite, not PI/PO."),
        ("PATTERN B", "SAP analytical access", [("Agent or analytics service", "agent"), ("Analytics API or data product", "agent"), ("BW/4HANA · BDC · Databricks", "sap")], "Analytical data only, not SAP transactional authorization. BDC / Databricks activation: to verify."),
        ("PATTERN C", "SAP SaaS systems", [("Agent", "agent"), ("Apigee / Integration Suite", "gw"), ("Ariba · Concur · Workday · IBP", "sap")], "Per-system entitlement, scopes and limits. IBP is in the brief, not on the finance landscape. Concur via Fivetran: candidate only."),
        ("PATTERN D", "Event-driven integration", [("Source system", "sap"), ("Event capability", "agent"), ("Agent workflow", "agent"), ("Tool call (A / B / C)", "gw")], "Where supported and justified: S/4HANA events, Integration Suite event capability (entitlement to verify).")]
for i, (kk, t, chain, note) in enumerate(pats):
    yy = 1.4 + i * 1.07
    rect(s, 0.5, yy, 12.33, 0.97, "white", "line", 1.0)
    txt(s, 0.6, yy + 0.05, 1.9, 0.85, [{"text": kk, "size": 10, "bold": True, "color": "blue"}, {"text": t, "size": 11, "bold": True, "color": "navy"}], 10, tag=f"pat {kk}")
    n = len(chain)
    wn = 1.4 if n == 4 else 1.85
    gap = 0.24 if n == 4 else 0.3
    for j, (lab, kd) in enumerate(chain):
        x = 2.55 + j * (wn + gap)
        node(s, x, yy + 0.25, wn, 0.48, lab, "", kd, ts=9.5, lw=1.0, tag=f"pat node {lab}")
        if j:
            arrow(s, x - gap, yy + 0.49, x, yy + 0.49)
    txt(s, 9.0, yy + 0.05, 3.75, 0.88, note, 9, "ink", anchor=MSO_ANCHOR.MIDDLE, tag=f"pat note {kk}")
rect(s, 0.5, 5.7, 12.33, 0.55, "gray", None)
txt(s, 0.6, 5.7, 12.1, 0.55, [{"text": [("SELECTION RULE   ", {"bold": True, "color": "blue"}), ("Transaction → A  ·  analysis → B  ·  SaaS-native data → C  ·  change notification → D", {"bold": True, "color": "navy"})]}], 11, anchor=MSO_ANCHOR.MIDDLE, tag="rule")

# ------------------------------------------------------------------------------------------------------------------ 12
s = new_slide(D, "DESIGN STANDARDS", "Review checklist · proposed", "warn",
              "Design contract: what every stream must satisfy before building",
              "Each line is PASS, FAIL or N/A with a written reason; submitted with the Gate 1 and Gate 3 packs.",
              "Source: owner brief (design standards). Timeouts, retention and thresholds are set per use case, not fixed here.", JOULE,
              notes="Standard design contract for project architects and external implementation partners. Each line is PASS, FAIL or N/A with justification. Values (timeouts, retention periods, thresholds) are deliberately not prescribed; they are set per use case.")
blocks = [("AGENT DESIGN", ["Clear business objective", "Defined autonomy tier", "Runtime + hosting binding declared ‡", "Portkey only; LLM data terms approved", "Tool allowlist by approved MCP URI", "Context and persistence bounds", "Timeouts, retries, recovery", "Eval set + injection tests versioned", "Human escalation path"]),
          ("MCP / API DESIGN", ["Pinned protocol version, transport", "Tool versioning, contract tests", "Audience-bound tokens, authz", "Input / output schema checks", "Read / write class (write = Tier 3+)", "Idempotency, timeouts, retries", "tools/list hash at approval", "Gateway + endpoint owner named", "Kill switch + retirement"]),
          ("DATA DESIGN", ["Authoritative source", "Data classification", "Access rights", "Freshness requirement", "Retention policy", "Residency / cross-border", "Analytical vs transactional use", "Volume + paging limits", "Source-of-record boundary"]),
          ("OPERATIONAL DESIGN", ["Telemetry and audit trail", "Trace context + correlation ID", "Support owner, L1 / L2 / L3", "Monitoring thresholds", "Capacity, availability, DR", "Environments, promotion path", "Rollback, retirement", "Secrets in vault, not code", "Incident coordinator named"])]
for i, (hd, items) in enumerate(blocks):
    x = 0.5 + i * 3.1
    table(s, x, 1.4, 3.0, [1], [[hd]] + [["☐  " + t] for t in items], 9.5, 0.46, first_bold=False)

# ------------------------------------------------------------------------------------------------------------------ 13
s = new_slide(D, "METHODOLOGY", "Owners: for confirmation", "warn",
              "One methodology: eight stage gates, each ending in Go or Hold",
              "One Accountable owner per gate; Hold is a valid outcome; release needs four separate sign-offs.",
              "Source: owner brief; repo decision register (decisions open). Owners are proposed, for stakeholder confirmation.", JOULE,
              notes="ONE PROCESS FOR SAP AND NON-SAP STREAMS. Each gate lists required inputs, deliverables, accountable owner, evidence and a Go/Hold rule. Owners are PROPOSED (slide 15) and need stakeholder confirmation; no named executives are implied.")
rows = [["", "0  Intake", "1  Platform", "2  Security + ID", "3  Contracts", "4  Build + eval", "5  E2E POC", "6  Release", "7  Operate"],
        ["Inputs", "Sponsor, KPIs, run-cost, tier; standard-SAP / Joule check first", "Intake, S1 / S2 / S3 options, account, connectivity", "Platform, data classes, user groups", "Approved design, API / tool list", "Contracts, test data, model config", "Real endpoints, users with different roles", "POC evidence, support, rollback plan", "Telemetry, incidents, access reviews"],
        ["Deliverables", "Ranked intake; hosting assumption", "Hosting, registry, gateway, LLM, account decisions", "Threat + AI impact assessment, identity chain, disclosure", "Agent spec, MCP contract, skills, GitLab pipeline", "Functional, injection, authorization, eval-threshold tests", "Identity proof, invocation, readback", "Four approvals, rollout plan", "Drift + SAP-upgrade re-tests, retirement plan"],
        ["Accountable (proposed)", "Business Process Owner", "AI Foundry (A), Ent. Arch. (R)", "Identity & InfoSec", "Domain Dev lead", "Domain Dev + independent tester", "SAP Architecture", "Process Owner (A); AI Foundry chairs", "Operations team"],
        ["Evidence", "Signed intake, score, cost of run", "Decision record, design checklist", "Reviewed threat model", "Versioned artifacts, contract tests", "Test report incl. denials", "Correlated logs, SAP readback match", "Arch, Security, Business, Platform sign-offs", "Review minutes, revocation test"],
        ["Go / Hold", "Go: filters pass\nHold: no sponsor, tier > 2", "Go: policy fit\nHold: account or gateway interop open", "Go: contract approved\nHold: mapping unproven", "Go: all versioned\nHold: owner / schema gap", "Go: criteria met\nHold: any authorization fail", "Go: two-user test passes\nHold: data unreconciled", "Go: all four approve\nHold: any withheld", "Go: stay live\nRollback on drift"]]
table(s, 0.5, 1.4, 12.33, [1.25, 1.4, 1.5, 1.5, 1.4, 1.5, 1.4, 1.4, 1.4], rows, 8.5, 0.62)
rect(s, 0.5, 5.75, 12.33, 0.6, "gray", None)
txt(s, 0.6, 5.75, 12.1, 0.6, [{"text": [("WAIVER ROUTE   ", {"bold": True, "color": "blue"}), ("Tier 1 / 2 may combine Gates 1–3. Other deviations need a documented waiver (AI Foundry chair + Security), logged in the registry.", {"bold": True, "color": "navy"})]}], 10.5, anchor=MSO_ANCHOR.MIDDLE, tag="waiver")

# ------------------------------------------------------------------------------------------------------------------ 14
s = new_slide(D, "GUARDRAILS", "Minimum controls · proposed", "warn",
              "Guardrails and risk tiers: autonomy is earned, never assumed",
              "Read-only is not unrestricted; approval never replaces SAP authorization; Tier 4 stays off by default.",
              "Source: owner brief; repo domain model (Finance Posting MCP: write, approval-gated, not active). Controls are proposed minimums.",
              notes="THE NON-NEGOTIABLE CONTROL FRAMEWORK. Every layer applies to every implementation; a stream cannot waive a layer, only document how it is met.")
tiers = [("TIER 1", "Read-only", "Within approved identity and data controls. Not unrestricted.", "ok"), ("TIER 2", "Analysis / recommendation", "May recommend. Never changes business records.", "agent"),
         ("TIER 3", "Human-approved action", "Specific business approval + policy checks; never triggered by tool content alone. Does not replace SAP authorization.", "warn"),
         ("TIER 4", "Autonomous / transactional", "Not allowed by default. Separate governance, security and process authorization first.", "bad")]
for i, (a, b, c_, kd) in enumerate(tiers):
    x = 0.5 + i * 3.1
    fill, line = k.KIND[kd]
    rect(s, x, 1.4, 3.0, 1.3, fill, line, 1.25)
    txt(s, x + 0.08, 1.43, 2.85, 1.25, [{"text": a, "size": 10, "bold": True, "color": line}, {"text": b, "size": 12, "bold": True, "color": "navy", "space": 1}, {"text": c_, "size": 9.5, "space": 3}], 9.5, tag=f"tier {a}")
rows = [["Control layer", "Mandatory guardrails"], ["AI / model", "Approved models · Portkey routing · evaluations · cost limits"],
        ["Agent execution", "Allowlists · bounded autonomy · tool-output isolation · retries · timeouts · max delegation depth"],
        ["MCP / API", "Authentication · audience-bound tokens · scopes · schema validation · rate limits · tools/list hash"],
        ["Identity", "Least privilege · user delegation · workload identity · no token passthrough"], ["Business", "SAP authorizations · SoD (restricted agent roles) · approvals · transaction checks"],
        ["Data", "Classification · minimization · sharing · masking · retention"], ["Operations", "Monitoring · audit · incidents · rollback · revocation · ownership"]]
table(s, 0.5, 2.9, 6.9, [1.4, 5.5], rows, 9, 0.43)
rect(s, 7.55, 2.9, 5.28, 3.45, "white", "line", 1.0)
threats = ["Prompt injection via content or tool output", "Overprivileged MCP tools", "Agent acting as the wrong user", "Credential leakage", "Unauthorized data extraction", "Unapproved changes to business records",
           "Duplicate transaction execution", "Tool or model version drift", "Uncontrolled agent-to-agent delegation", "Loss of monitoring and audit evidence", "Supply-chain tampering; description rug-pull", "Memory or context poisoning"]
txt(s, 7.65, 2.95, 5.1, 0.24, "THREATS EVERY DESIGN MUST ADDRESS", 10, "red", True, tag="hd")
txt(s, 7.65, 3.25, 2.55, 3.0, [{"text": "▪ " + t, "space": 7} for t in threats[:6]], 9.5, tag="threat1")
txt(s, 10.25, 3.25, 2.55, 3.0, [{"text": "▪ " + t, "space": 7} for t in threats[6:]], 9.5, tag="threat2")

# ------------------------------------------------------------------------------------------------------------------ 15
s = new_slide(D, "OPERATING MODEL", "For stakeholder confirmation", "warn",
              "Operating model: central governance sets standards, domains build and run",
              "Confirm one Accountable party per activity. This RACI is a proposal, not an existing procedure.",
              "Source: owner brief (roles, activities) and review comments. All assignments proposed; no named executives or procedures asserted.",
              notes="THE RACI IS A PROPOSAL FOR STAKEHOLDER CONFIRMATION. It does not describe approved organizational roles, named accountable executives or existing operating procedures. Each row has exactly one A (Accountable); R = Responsible, C = Consulted, I = Informed.")
hdr = ["Activity", "AI\nFoundry", "Ent.\nArch.", "SAP Sol.\nArch.", "SAP Int.\n/ Apigee", "BTP /\nPlatform", "Identity\n/ InfoSec", "GRC\nteam", "Data\nArch.", "Process\nOwner", "Domain\nDev", "Opera-\ntions", "Partner"]
R = [("CENTRAL GOVERNANCE · sets standards and approves",),
     ("Platform standards", "A R C C C C I C I I C I"), ("Agent hosting selection", "A R R C R C I I I C C I"), ("AWS account and landing zone", "C C I I A R I I I C C I"),
     ("Registry approval (EA reviews)", "A R C I I C I I I C I I"), ("Registry operation (sync, creds)", "A I I C C R I I I I C I"), ("Model / Portkey access", "A C I I I C I I I C I I"),
     ("SHARED BOUNDARY · joint design, one accountable owner",),
     ("Identity + principal propagation", "C C R R C A C I I C I I"), ("Joule access + entitlements", "C I C I R C A I C I C I"), ("SAP API / interface exposure", "I I R A I C I I C C I R"), ("Data access approval", "I I C C I C I A C C I I"),
     ("DOMAIN EXECUTION · designs, builds, runs",),
     ("MCP design and publication", "C C C R I C I I C A R R"), ("Business-process authorization", "I I R I I C C I A C I I"), ("Testing and release", "C C C C I C I I A R C R"),
     ("Production monitoring", "C I C R R C I I I R A C"), ("Incident handling, retirement", "R I C R R R C I C R A C")]
rows, secs, fills = [hdr], [], {}
for r in R:
    if len(r) == 1:
        secs.append(len(rows))
        rows.append([r[0]] + [""] * 12)
    else:
        rows.append([r[0]] + r[1].split())
        for j, v in enumerate(r[1].split(), 1):
            if v == "A":
                fills[(len(rows) - 1, j)] = ("navy", "white")
            elif v == "R":
                fills[(len(rows) - 1, j)] = ("bluebg", "blue")
tb = table(s, 0.5, 1.38, 12.33, [3.1] + [0.77] * 12, rows, 8.5, 0.232, section_rows=secs, align_center_cols=tuple(range(1, 13)), cell_fill=fills)
for sr in secs:
    tb.cell(sr, 0).merge(tb.cell(sr, 12))
tb.rows[0].height = k.Inches(0.4)
for i, (lab, col) in enumerate((("A", "Accountable (one per row)"), ("R", "Responsible"), ("C", "Consulted"), ("I", "Informed"))):
    x = 0.5 + i * 2.5
    rect(s, x, 6.12, 0.28, 0.24, "navy" if lab == "A" else "bluebg" if lab == "R" else "white", "line", 0.75)
    txt(s, x, 6.14, 0.28, 0.24, lab, 9, "white" if lab == "A" else "blue" if lab == "R" else "ink", True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, margin=0, tag="raci key")
    txt(s, x + 0.34, 6.14, 2.1, 0.24, col, 9.5, "ink", anchor=MSO_ANCHOR.MIDDLE, tag="raci key lbl")

# ------------------------------------------------------------------------------------------------------------------ 16
s = new_slide(D, "COST AND PLATFORM SELECTION", "No rates entered · evidence pending", "bad",
              "Cost governance: one workload, three scenarios, thirteen cost layers, and no invented rates",
              "Select by verified cost, identity and ownership evidence, never by platform preference or an assumed saving.",
              "Source: repo V5.2 cost model (docs/COST_MODEL.md); owner hypotheses. No rate is known to this deck.",
              notes="The editable model lives in the application (Selection and cost). One workload definition applies to every scenario; a total appears only when every needed volume and rate is present, with plus or minus 20 percent sensitivity and a break-even volume. A high invocation frequency does not automatically make AWS cheaper: it raises gateway and runtime charges too.")
for i, c in enumerate(m.COST_COMPONENTS):
    r_, c_ = divmod(i, 7)
    x = 0.5 + c_ * 1.77
    yy = 1.4 + r_ * 0.85
    rect(s, x, yy, 1.69, 0.77, "white", "line", 1.0)
    txt(s, x + 0.04, yy + 0.02, 1.62, 0.74, [{"text": c["label"], "size": 8.5, "bold": True, "color": "navy"}, {"text": " ".join(c["applies"]), "size": 8, "bold": True, "color": "blue", "space": 2}], 8.5, tag=f"cost {c['label'][:25]}")
blocks = [("WORKLOAD PROFILES TO COMPARE", "blue", [p[1] for p in m.WORKLOAD_PROFILES]),
          ("HYPOTHESES TO TEST", "orange", ["SAP BTP credits may make frequent agent hosting expensive", "Existing SAP AWS infrastructure may suit AI-native workloads poorly", "A high call frequency does not automatically make AWS cheaper"]),
          ("NEEDED FROM FINOPS", "red", ["BTP credit rates and contractual charges", "Enterprise AWS discounts", "Apigee charges", "Support staffing; measured volumes"])]
for i, (hd, col, items) in enumerate(blocks):
    x = 0.5 + i * 4.19
    rect(s, x, 3.3, 3.95, 1.95, "white", "line", 1.0)
    txt(s, x + 0.1, 3.34, 3.75, 1.9, [{"text": hd, "size": 10, "bold": True, "color": col}] + [{"text": "▪ " + t, "space": 4} for t in items], 9.5, tag=f"cost block {hd}")
rect(s, 0.5, 5.4, 12.33, 0.9, "gray", None)
txt(s, 0.6, 5.42, 12.1, 0.86, [{"text": [("HOW TO READ   ", {"bold": True, "color": "blue"}), ("Totals appear only when every input has a source; sensitivity is plus or minus 20 percent; break-even solves the volume at which two scenarios cost the same. AWS may win when runtime dominates; SAP BTP may win when committed credits are paid or SAP coupling is high.", {})]}], 9.5, "navy", anchor=MSO_ANCHOR.MIDDLE, tag="cost read")

# ------------------------------------------------------------------------------------------------------------------ 17
s = new_slide(D, "STANDARDS COVERAGE", "Design intent · not certified", "warn",
              "Standards coverage: where the design meets industry AI and organization standards, and where gaps remain",
              "Core controls are covered by design intent; gateway interoperability and token exchange block conformance.",
              "Source: author assessment; OWASP, MCP, EU AI Act via search; others from knowledge. Not certified.",
              notes="A coverage map of the proposed design against recognised standards and the owner's organization blueprint. 'Covered' means the design intent addresses the standard's main asks; it is NOT a conformance claim, an audit or a certification, and nothing in the landscape has been verified.")
rows = [["Standard / framework", "How the design responds (slides)", "Status", "Gap to close"],
        ["NIST AI RMF (Govern, Map, Measure, Manage)", "Gates, tiers, RACI, monitoring, retirement (13–15)", "Partial", "Impact assessment (added); eval thresholds by tier"],
        ["ISO/IEC 42001 AI management system", "Roles, lifecycle, controls, evidence (9, 13–15)", "Partial", "AI policy, internal audit, supplier controls"],
        ["EU AI Act (classification, oversight, transparency)", "Tiers, human confirmation, Gate 0 / 2 (13, 14)", "Partial", "Legal to confirm role, class and dates"],
        ["OWASP Agentic Top 10 (2026) + LLM Top 10", "Allowlists, hash, identity chain, kill switch (10, 12, 14)", "Partial", "Supply-chain provenance; memory poisoning"],
        ["MCP authorization (OAuth 2.1, RFC 8707 / 9728)", "Audience-bound tokens, no passthrough (10, 12)", "Covered", "Pin spec version; confirm gateway support"],
        ["OAuth token exchange (RFC 8693) / OIDC", "Delegated user token chain (10)", "Open", "Exact profile unproven across both gateways"],
        ["OpenTelemetry GenAI + W3C Trace Context", "Correlation ID, evidence plane (3, 7, 12)", "Partial", "Convention and owner to implement"],
        ["SAP clean core, released APIs", "Released APIs, exception for RFC / BAPI (2, 11)", "Covered", "ECC read path for reconciliation"],
        ["SAP authorizations + SoD (GRC)", "Backend authorizes; GRC runs Joule access (8, 10, 15)", "Covered", "Per-backend user mapping to verify"],
        ["Organization AI blueprint", "Registry, gateways, Portkey reused (4, 5, 6)", "Open", "Account approval; Gateway-to-Apigee; registry sharing"],
        ["Integration practice (resilience, API governance)", "Patterns A–D, design contract (11, 12)", "Partial", "Policy owner per gateway; network ADR"]]
fills = {}
for i, r in enumerate(rows[1:], 1):
    fills[(i, 2)] = {"Covered": ("greenbg", "green"), "Partial": ("amberbg", "amber"), "Open": ("redbg", "red")}[r[2]]
table(s, 0.5, 1.4, 12.33, [3.6, 4.2, 0.9, 3.63], rows, 9.5, 0.4, cell_fill=fills, align_center_cols=(2,))

# ------------------------------------------------------------------------------------------------------------------ 18
s = new_slide(D, "POC AND DECISIONS", "All decisions open", "bad",
              "POC acceptance and enterprise decisions: prove one read-only reconciliation, then decide",
              "Prove S2 and S3 with the finance case in 12 checks, keep capability, tenant and live evidence apart, then decide.",
              "Source: owner brief and review comments; repo V5.2 decision register (all open). No approvals, dates or live results are claimed.", JOULE,
              notes="PRIMARY ARCHITECTURE POC: one SAP Finance read-only reconciliation or analytical use case (the repository's S/4HANA vs Central Finance month-end reconciliation is the reference; today it runs on synthetic data in a simulator that connects to no tenant). Compare S2 and S3 first; include S1 as a baseline where BTP is credible. Risk tier 1/2 only; no posting capability. Select S3 only when account, Apigee, gateway interoperability, principal propagation, ownership, cost and operations all pass; otherwise S2 or S1.")
txt(s, 0.5, 1.4, 4.4, 0.24, [{"text": [("12 CHECKS  ·  ", {"bold": True, "color": "blue"}), ("finance reference case", {"bold": True, "color": "mute"})]}], 10, tag="hd")
checks = [("RUN", ["Agent deployed on AgentCore Runtime in the dedicated account (S1: Cloud Foundry space)", "MCP via gateways; live tools/list equals approved hash", "Portkey model invocation verified"]),
          ("REGISTER + CONNECT", ["Registration validated; no runtime lookup via registry", "Integration Suite connectivity validated", "Errors, retries, denials; no technical-user fallback"]),
          ("IDENTITY + AUTHORIZATION", ["User identity and trust chain verified", "SAP authorization tested with different users", "Business data readback reconciled with SAP"]),
          ("EVIDENCE + OPERATIONS", ["Audit evidence correlated across systems", "Runtime ownership, incident handling shown", "Evidence submitted to architecture / security review"])]
yy, n = 1.7, 1
for hd, items in checks:
    rect(s, 0.5, yy, 4.4, 0.93, "white", "line", 1.0)
    txt(s, 0.58, yy + 0.02, 4.25, 0.9, [{"text": hd, "size": 9, "bold": True, "color": "blue"}] + [{"text": [(f"{n + i}  ", {"bold": True, "color": "blue"}), (t, {})], "size": 8.5, "space": 1} for i, t in enumerate(items)], 8.5, tag=f"check {hd}")
    yy += 0.98
    n += 3
rows = [["Enterprise decision", "Required authority", "Needed by", "Status"],
        ["Dedicated SAP-agent AWS account approved?", "AI Foundry / AWS platform / Security / Ent. Arch.", "Gate 1", "Open"],
        ["Central AWS Agent Registry ownership and cross-account sharing?", "AI Foundry", "Gate 1", "Open"],
        ["AgentCore Gateway to Apigee supported for SAP MCP calls?", "AI Foundry / Security / SAP Integration", "Gate 1", "Open"],
        ["Identity / token-delegation contract?", "Identity / Security / SAP Architecture", "Gate 2", "Open"],
        ["Verified comparative operating cost (no rates entered)?", "Finance / FinOps / AI Foundry", "Gate 1", "Open"],
        ["Is Apigee mandatory for the SAP route (S2)?", "SAP Integration / Security", "Gate 1", "Open"],
        ["Agent / MCP metadata and versioning standard?", "AI Foundry / Domain Architecture", "Gate 3", "Open"],
        ["Approved SAP APIs and integration routes?", "SAP Integration / System Owners", "Gate 3", "Open"],
        ["Use cases beyond read-only?", "Business Owner / Security / SAP Governance", "Gate 6", "Open"],
        ["Monitoring, audit and incident model?", "Operations / Platform Owners", "Gate 6", "Open"]]
fills = {(i, 3): ("redbg", "red") for i in range(1, len(rows))}
table(s, 5.1, 1.4, 7.73, [3.5, 2.9, 0.75, 0.6], rows, 8.5, 0.36, cell_fill=fills, align_center_cols=(2, 3), first_bold=False)
txt(s, 0.5, 5.7, 12.3, 0.22, [{"text": [("NEXT WORKSHOP SEQUENCE  ·  ", {"bold": True, "color": "mute"}), ("order only, no dates or approvals implied", {"color": "mute"})]}], 10, tag="seq hd")
for i, t in enumerate(["Architecture alignment", "Security + Identity review", "Integration contract", "POC execution", "Evidence review", "Production decision"]):
    x = 0.5 + i * 2.07
    sh = rect(s, x, 5.95, 2.0, 0.42, "bluebg" if i < 5 else "navy", "blue", 1.0, False, MSO_SHAPE.PENTAGON)
    tf = sh.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    k.fill_tf(tf, [{"text": t}], 9.5, "navy" if i < 5 else "white", True, PP_ALIGN.CENTER)

OUT.parent.mkdir(parents=True, exist_ok=True)
D.save(OUT)
print(f"wrote {OUT} ({D.n} slides)")
if k.WARN:
    print(f"{len(k.WARN)} fit warnings:")
    print("\n".join(k.WARN))
