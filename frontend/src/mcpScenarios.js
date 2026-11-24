// Single source of truth for the MCP Hosting & Governance tab.
// Every table, summary and topology diagram on that tab is generated from this file.
// Vendor capability statements come from official documentation read on ACCESSED.
// Nothing here is tenant evidence. "TBD — REQUIRES VALIDATION" marks missing proof.

export const ACCESSED = '2026-11-24';
export const TBD = 'TBD — REQUIRES VALIDATION';

export const SCENARIOS = {
  S1: { id: 'S1', label: 'S1 · Google Apigee MCP', short: 'Apigee only',
    chain: 'Agent runtime (MCP client) → Apigee MCP endpoint → SAP-facing domain capability → SAP Integration Suite → SAP backend',
    summary: 'One MCP gateway, Google Apigee, exposes the SAP Finance domain tools. The baseline is the Apigee-managed pattern: an MCP proxy derives its tools from OpenAPI operations that front SAP Integration Suite APIs. Apigee does not run arbitrary Python MCP-server code; a coded domain MCP server would live on a separate runtime that Apigee proxies.',
    baseline: 'Baseline: Apigee-managed, API-backed MCP exposure. Alternative: separately hosted domain MCP server governed through Apigee (runtime TBD).' },
  S2: { id: 'S2', label: 'S2 · AWS AgentCore MCP', short: 'AgentCore only',
    chain: 'Agent runtime (MCP client) → AgentCore Gateway → Finance domain MCP server / gateway target → SAP Integration Suite → SAP backend',
    summary: 'One MCP gateway, AgentCore Gateway, fronts the Finance domain MCP capability. The gateway routes and authorizes; it does not execute custom tool code. A coded Finance MCP server runs on AgentCore Runtime (container, MCP protocol), or the gateway generates tools from supported API or function targets. AWS Agent Registry is a separate discovery layer.',
    baseline: 'Baseline: custom Finance MCP server on AgentCore Runtime registered as a gateway MCP-server target. Alternative: gateway-generated tools from an OpenAPI or function target.' },
  S3: { id: 'S3', label: 'S3 · AgentCore Gateway + Google Apigee', short: 'Hybrid',
    chain: 'Agent runtime (MCP client) → AgentCore Gateway → Apigee MCP endpoint → SAP-facing domain capability → SAP Integration Suite → SAP backend',
    summary: 'Two gateways in series. AgentCore Gateway is the enterprise agent entry on the AWS side; Apigee remains the SAP-domain MCP endpoint, so Finance-specific logic stays on the SAP-facing side. The AgentCore-to-Apigee hop is a gateway MCP-server target whose protocol and token-exchange behaviour is documented separately by each vendor and unproven together.',
    baseline: 'Baseline: Apigee owns the SAP-domain MCP interface; AgentCore Gateway holds a reference. Cross-gateway protocol, identity exchange and registry sync are open dependencies.' },
};
export const IDS = ['S1', 'S2', 'S3'];

export const GLOSSARY = [
  ['MCP client', 'Agent-side component that discovers and invokes MCP tools.'],
  ['MCP server', 'Protocol endpoint exposing tools and resources over MCP.'],
  ['Domain MCP server', 'Business-domain MCP implementation, e.g. SAP Finance read or posting.'],
  ['MCP gateway', 'Governed entry point that routes, authorizes and may aggregate MCP capabilities. It is not necessarily where tool logic runs.'],
  ['MCP registry', 'Catalog and discovery of MCP servers and tool metadata. Never an invocation hop.'],
  ['Artifact repository', 'Versioned source, specifications and configuration (Git, container registry).'],
  ['Runtime', 'Platform that executes domain logic or MCP-server software.'],
  ['Backend integration', 'API, integration flow or adapter reaching enterprise applications (SAP Integration Suite).'],
  ['Agent runtime', 'Compute and orchestration platform running the agent. Independent of MCP hosting.'],
  ['Model runtime', 'LLM inference provider. Independent of MCP hosting.'],
];

// 21 responsibility rows: [row, S1, S2, S3]
export const MATRIX = [
  ['Agent development environment', `Enterprise-approved pro-code (Python) agent environment. ${TBD}`, `Same as S1. ${TBD}`, `Same as S1. ${TBD}`],
  ['Agent hosting runtime', 'Independent of the MCP choice. Demo assumption: AgentCore Runtime. Apigee does not require a Google-hosted agent.', 'Independent of the MCP choice. AgentCore Runtime is a natural but not mandatory host; choosing AgentCore Gateway does not force it.', 'Independent of the MCP choice. Demo assumption: AgentCore Runtime; enterprise Agent Platform or SAP BTP possible.'],
  ['MCP client location', 'Inside the agent process on the agent runtime.', 'Inside the agent process on the agent runtime.', 'Inside the agent process on the agent runtime; the gateway also acts as a client toward Apigee.'],
  ['MCP gateway', 'Google Apigee: MCP proxy (Discovery Proxy template) with OAuth and API-product policies.', 'AgentCore Gateway: inbound authorizer and outbound credential provider; routes to targets.', 'Two gateways in series: AgentCore Gateway (agent entry), then Apigee (SAP-domain endpoint).'],
  ['Finance domain MCP server creation', 'Baseline: tools derived from OpenAPI 3.0.x operations by the SAP integration/API team. A coded server only in the external-server alternative.', 'Baseline: coded Finance MCP server by finance engineering. Alternative: gateway-generated tools from an OpenAPI or function target.', 'Created on the Apigee side as in S1. AgentCore does not recreate it.'],
  ['Finance domain MCP server hosting', 'Apigee-managed proxy runtime. Not a general Python compute platform. A coded server needs a separate runtime behind Apigee (TBD).', 'AgentCore Runtime container (MCP protocol, ARM64, port 8000) or none when the gateway generates tools.', 'Apigee-managed runtime, as S1.'],
  ['MCP server runtime endpoint', 'Apigee MCP endpoint at <apigee-host>/<mcp-basepath> (conceptual placeholder, not a tenant address).', 'Gateway MCP URL <gateway-id>.gateway…/mcp; Runtime target at /invocations (conceptual placeholders).', 'AgentCore Gateway URL for agents; Apigee endpoint URL held as a gateway target (placeholders).'],
  ['MCP tool definitions', 'Derived from OpenAPI operations; exposed set limited by API products.', 'tools/list from the coded server, or from the target schema when gateway-generated.', 'Tools originate in Apigee; surfaced through the gateway. Name prefixing and collisions: TO VALIDATE.'],
  ['MCP registry and discovery', 'Apigee API hub imports MCP proxies and parses specs into tools; syncs to Google Agent Registry (enabled by default; maturity TO VALIDATE).', 'AWS Agent Registry (agent-registry namespace) is a separate discovery and approval layer. Only approved records are discoverable.', 'API hub is the proposed SAP-domain source of truth. AWS Agent Registry would hold a reference. No automatic cross-platform sync is documented.'],
  ['Enterprise registry / approval authority', `Enterprise AI Foundry publication approval. ${TBD}`, `Enterprise AI Foundry, or the AWS Agent Registry curator role. ${TBD}`, `Enterprise AI Foundry as the single approver across both catalogs. ${TBD}`],
  ['Source-code repository', `Organization Git repository for specs, tool definitions, policies and tests. ${TBD}`, `Organization Git repository for server source, target schemas and infrastructure code. ${TBD}`, `Organization Git repository covering both sides. ${TBD}`],
  ['MCP specifications and versioned artifacts', 'OpenAPI spec versions, Apigee proxy bundles, API products, test collections.', 'MCP server source, target schemas, gateway and target definitions as code.', 'Union of S1 and S2 artifacts, plus a written cross-gateway interface contract.'],
  ['Container / package artifact storage', 'Not needed for the baseline. Needed only if an external coded server is chosen (TBD).', 'Container registry (Amazon ECR) for the Runtime image.', 'Not needed on the AWS side unless an AWS-hosted adapter is added.'],
  ['Gateway-target configuration', 'Proxy target endpoint resolves to the SAP-facing Integration Suite API.', 'Gateway target of type MCP server (or OpenAPI/function) with a credential provider configuration.', 'AgentCore target of type MCP server pointing at the Apigee endpoint. Compatibility must be proven.'],
  ['Authentication and token management', 'Inbound: OAuth 2.1 / OIDC bearer or API key per API product. Outbound to Integration Suite: TBD.', 'Inbound: JWT authorizer or IAM. Outbound to MCP targets: OAuth (client credentials, authorization code, token exchange), API key or gateway role; AgentCore Identity holds providers.', 'Two token hops. Agent-to-AgentCore-to-Apigee token exchange and user-context carry-over are unproven.'],
  ['SAP integration layer', 'SAP Integration Suite (API and iFlow). An Integration Suite MCP Server artifact is a separate option, not assumed.', 'Same as S1.', 'Same as S1.'],
  ['Backend authorization boundary', 'ABAP roles of the mapped user or service identity. Principal propagation not proven in the tenant.', 'Same as S1.', 'Same as S1; the extra hop adds one more identity-mapping point.'],
  ['Logging, monitoring and audit evidence', 'Apigee analytics and logging, Integration Suite monitoring, SAP change documents.', 'AgentCore Gateway and Runtime observability, Integration Suite monitoring, SAP change documents.', `Two gateway logs. Correlation across them needs a propagated trace id. ${TBD}`],
  ['Deployment ownership', 'SAP integration / API platform team deploys proxies and products.', 'Finance engineering and cloud platform team deploy the container and gateway targets.', 'Split ownership between both teams plus an interface-contract owner.'],
  ['Cost and operational responsibility', 'Apigee licensing and operations plus Integration Suite. Unmeasured.', 'AgentCore Runtime, Gateway and Registry consumption plus ECR. Unmeasured.', 'Both stacks plus cross-cloud traffic and latency. Unmeasured.'],
  ['Release prerequisites and outstanding decisions', 'Apigee MCP enabled for the organization (optional switch on hybrid), OpenAPI 3.0.x, direct-access policy, API hub and registry scope.', 'Region availability, Agent Registry status and namespace, choice of coded server or generated tools.', 'Gateway-to-Apigee protocol and auth proof, ownership of double policy, registry synchronization method.'],
];

export const CONN_COLS = ['Source', 'Destination', 'Endpoint type', 'Protocol', 'MCP role', 'Endpoint owner', 'Hosting location', 'Authentication', 'Identity context', 'Network boundary', 'Read / write', 'Registry reference', 'Verification'];
const DOC = 'Vendor-documented · tenant NOT_VERIFIED';
const DES = 'Design assumption';
const T = TBD;
const RW = 'Read tools default; write tools only via the separate posting domain';

export const CONNECTIONS = {
  S1: [
    ['Agent MCP client', 'Apigee MCP endpoint', 'MCP endpoint', 'MCP over Streamable HTTP (JSON-RPC 2.0)', 'client → server', 'SAP integration / API platform team', 'Apigee (Google-managed)', 'OAuth 2.1 / OIDC bearer, or API key per API product', 'Agent identity; end-user delegation TO VALIDATE', 'Agent runtime network → Apigee ingress; private path TBD', RW, 'API hub entry', DOC],
    ['Apigee MCP proxy', 'SAP-facing domain API', 'API proxy target', 'HTTPS, OpenAPI operation', 'tool call mapped to API call', 'SAP integration / API platform team', 'Apigee', 'Target credentials held by Apigee: TBD', 'Mapped technical or user identity: TBD', 'Apigee → Integration Suite', RW, 'OpenAPI spec in API hub', T],
    ['SAP-facing domain API', 'SAP Integration Suite', 'API / iFlow', 'HTTPS REST or OData', 'backend integration', 'SAP integration team', 'SAP Integration Suite', 'OAuth client or certificate', 'Technical user or propagated principal', 'Customer / SAP BTP boundary', RW, 'None (not a registry object)', DES],
    ['SAP Integration Suite', 'SAP S/4HANA · Central Finance · BW/4HANA', 'Backend interface', 'RFC / OData via Cloud Connector, or direct', 'backend integration', 'SAP basis and finance', 'Customer SAP landscape', 'Principal propagation or technical user', 'ABAP roles of the mapped user', 'Cloud Connector or private link: needs proof', 'Read-only in the demo; posting needs a separate approval path', 'None', T],
    ['Apigee API hub', 'Google Agent Registry', 'Registry sync (not invocation)', 'Metadata sync', 'catalog → catalog', 'Google Cloud platform team', 'Google Cloud', 'Google IAM', 'Platform service identity', 'Google Cloud internal', 'Metadata only', 'Registry sync (default on)', 'Vendor-documented · maturity TO VALIDATE'],
    ['Agent runtime', 'API hub / Agent Registry', 'Discovery lookup (not invocation)', 'Registry API or registry MCP endpoint', 'client → catalog', 'Enterprise AI Foundry (TBD)', 'Google Cloud', 'Google IAM or OAuth', 'Agent identity', 'Agent runtime → Google APIs', 'Metadata only', 'API hub / Agent Registry', T],
    ['Git and CI/CD', 'Apigee organization', 'Deployment (not invocation)', 'Apigee management API', 'artifact publication', 'SAP integration team', 'Organization CI/CD', 'Pipeline service account', 'Deployment identity', 'CI/CD → Apigee management plane', 'Not applicable', 'Spec registered in API hub', DES],
  ],
  S2: [
    ['Agent MCP client', 'AgentCore Gateway', 'MCP endpoint', 'MCP over Streamable HTTP', 'client → server', 'Cloud platform team', 'AWS (gateway)', 'JWT bearer validated by the gateway authorizer, or IAM', 'Agent identity; end-user delegation TO VALIDATE', 'Agent runtime → AWS gateway endpoint', RW, 'Registry record (optional)', DOC],
    ['AgentCore Gateway', 'Finance domain MCP server (AgentCore Runtime)', 'Gateway MCP-server target', 'MCP over Streamable HTTP to the Runtime /invocations URL', 'client → server', 'Finance engineering', 'AgentCore Runtime (container)', 'Outbound OAuth, API key or gateway role from an AgentCore Identity credential provider', 'Gateway service identity or exchanged token: TBD', 'Inside the AWS account', RW, 'Registry record', DOC],
    ['AgentCore Gateway', 'Gateway-generated tools (alternative)', 'OpenAPI / function target', 'HTTPS, target schema', 'tool call mapped to API call', 'Finance engineering', 'AgentCore Gateway', 'Credential provider per target', 'TBD', 'AWS → target API', RW, 'Registry record', 'Alternative; ' + DOC.toLowerCase()],
    ['Finance domain MCP server', 'SAP Integration Suite', 'API / iFlow', 'HTTPS REST or OData', 'backend integration', 'SAP integration team', 'SAP Integration Suite', 'OAuth client or certificate', 'Technical user or propagated principal', 'AWS → SAP BTP; private route needs proof', RW, 'None', T],
    ['SAP Integration Suite', 'SAP S/4HANA · Central Finance · BW/4HANA', 'Backend interface', 'RFC / OData via Cloud Connector, or direct', 'backend integration', 'SAP basis and finance', 'Customer SAP landscape', 'Principal propagation or technical user', 'ABAP roles of the mapped user', 'Cloud Connector or private link: needs proof', 'Read-only in the demo; posting needs a separate approval path', 'None', T],
    ['Agent runtime', 'AWS Agent Registry', 'Discovery lookup (not invocation)', 'Registry MCP endpoint or API', 'client → catalog', 'Enterprise AI Foundry or registry curator', 'AWS', 'Bearer token or IAM', 'Agent identity', 'Agent runtime → AWS', 'Metadata only; approved records only', 'agent-registry namespace', DOC],
    ['Git and CI/CD', 'AgentCore Runtime, container registry and gateway targets', 'Deployment (not invocation)', 'AWS control-plane API', 'artifact publication', 'Cloud platform team', 'Organization CI/CD', 'Pipeline role', 'Deployment identity', 'CI/CD → AWS control plane', 'Not applicable', 'Record submitted for approval', DES],
  ],
  S3: [
    ['Agent MCP client', 'AgentCore Gateway', 'MCP endpoint', 'MCP over Streamable HTTP', 'client → server', 'Cloud platform team', 'AWS (gateway)', 'JWT bearer validated by the gateway authorizer, or IAM', 'Agent identity; end-user delegation TO VALIDATE', 'Agent runtime → AWS gateway endpoint', RW, 'AWS Agent Registry reference', DOC],
    ['AgentCore Gateway', 'Apigee MCP endpoint', 'Gateway MCP-server target (cross-cloud)', 'MCP over Streamable HTTP; version compatibility unproven', 'client → server', 'SAP integration / API platform team', 'Apigee (Google-managed)', 'Outbound OAuth (client credentials, authorization code or token exchange) or API key; Apigee must accept it', 'Token exchange and user-context carry-over: unproven', 'AWS → Google ingress; egress and latency unmeasured', RW, 'API hub entry; AWS record is a manual reference', T],
    ['Apigee MCP proxy', 'SAP-facing domain API', 'API proxy target', 'HTTPS, OpenAPI operation', 'tool call mapped to API call', 'SAP integration / API platform team', 'Apigee', 'Target credentials held by Apigee: TBD', 'Mapped technical or user identity: TBD', 'Apigee → Integration Suite', RW, 'OpenAPI spec in API hub', T],
    ['SAP-facing domain API', 'SAP Integration Suite', 'API / iFlow', 'HTTPS REST or OData', 'backend integration', 'SAP integration team', 'SAP Integration Suite', 'OAuth client or certificate', 'Technical user or propagated principal', 'Customer / SAP BTP boundary', RW, 'None', DES],
    ['SAP Integration Suite', 'SAP S/4HANA · Central Finance · BW/4HANA', 'Backend interface', 'RFC / OData via Cloud Connector, or direct', 'backend integration', 'SAP basis and finance', 'Customer SAP landscape', 'Principal propagation or technical user', 'ABAP roles of the mapped user', 'Cloud Connector or private link: needs proof', 'Read-only in the demo; posting needs a separate approval path', 'None', T],
    ['Apigee API hub', 'AWS Agent Registry', 'Registry publication (not invocation)', 'Manual registration or custom synchronization', 'catalog → catalog', 'Enterprise AI Foundry (TBD)', 'Across clouds', 'Both platforms\' IAM', 'Platform identity', 'Cross-cloud', 'Metadata only', 'No automatic sync documented; implementation dependency', T],
    ['Git and CI/CD', 'Apigee organization and AWS gateway target', 'Deployment (not invocation)', 'Apigee management API and AWS control-plane API', 'artifact publication', 'Both platform teams', 'Organization CI/CD', 'Pipeline identities', 'Deployment identity', 'CI/CD → both control planes', 'Not applicable', 'Specs in API hub; reference record in AWS', DES],
  ],
};

// Finance domain model: separate authorizations for read, posting and analytics.
export const DOMAINS = [
  { name: 'Finance Read MCP', mode: 'READ', tools: 'Reconciliation balances · ledger and period data · approved journal and document status · reconciliation exceptions · approved analytics', control: 'Own scope and role. Read-only backend operations. No write tool is registered in this domain.' },
  { name: 'Finance Posting MCP', mode: 'WRITE · APPROVAL-GATED', tools: 'Propose reconciliation adjustment · invoke governed approval · validate posting authorization · post via approved SAP business API · read posting confirmation and audit evidence', control: 'Separate authorization from read. A proposal does not post. Posting needs a business approval, an agent and gateway allowance, an SAP user authorization, idempotency and a posting-period check. The demo never posts.' },
  { name: 'Analytical / Data MCP', mode: 'READ · FUTURE', tools: 'Authorized Databricks or BDC-backed context · governed snapshots and support data', control: 'Data owner and freshness stated per source. Entitlement and scope: TO VALIDATE.' },
];

// Agent hosting x MCP scenario. Values: Documented, Conditional, Tenant validation, Not recommended.
export const HOSTING = [
  ['Approved enterprise Agent Platform / AI Foundry', 'Conditional · remote MCP endpoint reachable', 'Conditional · remote MCP endpoint reachable', 'Tenant validation'],
  ['AWS AgentCore Runtime', 'Conditional · calls Apigee as a remote MCP server', 'Documented · native fit', 'Documented for runtime and gateway; Apigee hop needs proof'],
  ['SAP BTP pro-code runtime', 'Conditional · remote MCP endpoint reachable', 'Tenant validation', 'Tenant validation'],
  ['Microsoft Foundry hosted agent', 'Tenant validation', 'Tenant validation', 'Tenant validation'],
  ['Joule Studio', 'Tenant validation · eligibility TBD', 'Not recommended without proof', 'Not recommended without proof'],
];

// Qualitative assessment per dimension. These are architectural judgments, not approvals.
export const DIMENSIONS = [
  ['MCP development effort', 'Low if tools derive from OpenAPI; higher for a coded server', 'Medium: coded server plus container and target setup', 'Highest: both stacks plus an interface contract'],
  ['MCP hosting flexibility', 'Limited to proxy exposure unless an external server is added', 'High: Runtime hosts arbitrary server code', 'High on both sides'],
  ['Registry maturity', 'API hub plus Agent Registry sync; maturity TO VALIDATE', 'AWS Agent Registry (preview status on release; TO VALIDATE)', 'Two catalogs and no documented sync'],
  ['Enterprise discovery', 'Strong for SAP domain; cross-cloud agents need the Google catalog', 'Strong for AWS-resident agents', 'Weak without a custom synchronization'],
  ['Identity propagation', 'One gateway hop to prove', 'One gateway hop to prove', 'Two hops to prove; highest risk'],
  ['SAP connectivity', 'Via Integration Suite', 'Via Integration Suite', 'Via Integration Suite'],
  ['Security policy ownership', 'SAP-facing team', 'Cloud platform team', 'Split; double enforcement needs justification'],
  ['Operational complexity', 'Lowest of the three', 'Medium', 'Highest'],
  ['Cross-cloud traffic', 'Agent to Google if the agent runs elsewhere', 'None when the agent runs on AWS', 'Always cross-cloud'],
  ['Vendor lock-in', 'Apigee for the domain interface', 'AgentCore for gateway and server', 'Both'],
  ['Cost drivers', 'Apigee licensing', 'AgentCore consumption', 'Both plus egress'],
  ['Observability', 'Apigee analytics', 'AWS-native tracing', 'Needs a propagated trace id'],
  ['Maintainability', 'Spec-driven; one owner', 'Code-driven; one owner', 'Two owners and a contract'],
  ['Portability', 'MCP is open; proxy policy is Apigee-specific', 'MCP server code is portable; gateway config is AWS-specific', 'Server code stays portable; two configs'],
  ['Future BDC alignment', 'Open: depends on the BDC MCP surface', 'Open', 'Open'],
];

export const RECOMMENDATION = {
  headline: 'ARCHITECTURE_RECOMMENDED (proposal for owner decision, not approval): use S1 as the proof-of-concept baseline for the SAP Finance domain interface.',
  why: [
    'It keeps the Finance domain contract on the SAP-facing side (API hub plus Integration Suite), so an agent hosted on AWS or elsewhere consumes it as a remote MCP endpoint without moving Finance logic into AWS.',
    'It has one gateway hop and one identity mapping to prove, against two for S3.',
    'Documented Apigee capability fits the read-heavy baseline: OpenAPI-derived tools, API-product tool filtering, OAuth 2.1 / OIDC.',
  ],
  standards: ['An enterprise rule on who owns domain MCP interfaces', 'An approved agent platform that can reach Apigee', 'An API hub and Agent Registry publication process'],
  open: ['Delegated user versus service identity for reads and posting', 'Principal propagation through Integration Suite and Cloud Connector', 'Registry source of truth and approval authority', 'Whether Apigee MCP and Agent Registry integration are available in the tenant and region'],
  changes: ['If enterprise standards already host domain MCP servers on AgentCore, choose S2.', 'S3 is justified only by a named control that one gateway cannot meet, for example a mandatory AWS-side tool-access policy for all agents plus SAP-owned domain policy. Without that, S3 duplicates policy.', 'A failed Apigee-to-Integration-Suite identity test would reopen all three.'],
  poc: ['Stand up one read tool through the S1 path with a service identity and record the call, token and SAP user in evidence.', 'Repeat with user delegation; mark the result PASS, HOLD or NOT_VERIFIED.', 'Run a single AgentCore Gateway to Apigee call to settle the S3 protocol and token questions before any S3 commitment.'],
};

// Official sources read on ACCESSED. Conclusions are limited to what the page supports.
export const EVIDENCE = [
  ['Google Apigee', 'Apigee MCP overview', 'https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-overview', 'MCP proxies expose existing APIs as MCP tools derived from OpenAPI; OAuth 2.1 and OIDC are supported; a proxy may also front your own MCP server.', 'Apigee exposes and governs MCP endpoints; it is not an arbitrary Python server runtime. Domain tools come from OpenAPI or an external server.', 'Tenant enablement, region, licensing, hybrid enablement'],
  ['Google Apigee', 'Quickstart: MCP Discovery Proxy', 'https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-quickstart', 'OpenAPI 3.0.0 to 3.0.3; JSON-RPC 2.0 payloads; no SSE streams on GET.', 'Spec version and transport limits apply to the baseline.', 'Spec compatibility of the Finance APIs'],
  ['Google Apigee', 'Register MCP APIs in API hub', 'https://docs.cloud.google.com/apigee/docs/apihub/register-mcp-apis', 'API hub imports Apigee MCP proxies and parses specs into tools.', 'API hub is the natural SAP-domain MCP catalog in S1 and S3.', 'API hub licensing and project setup'],
  ['Google Apigee', 'Agent Registry integration', 'https://docs.cloud.google.com/apigee/docs/apihub/manage-agent-registry-integration', 'API hub syncs MCP tools and server metadata to Agent Registry; sync is on by default; manually styled MCP APIs are not synced.', 'Google-side discovery needs no custom sync, but maturity and release status must be checked.', 'Preview or GA status in the tenant'],
  ['AWS AgentCore', 'Gateway outbound authorization', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-outbound-auth.html', 'For MCP-server targets: no authorization, gateway role, OAuth (client credentials, authorization code, token exchange) and API key; caller IAM and passthrough are not offered.', 'S3 outbound auth to Apigee must use one of these; caller identity cannot be passed through.', 'Whether Apigee accepts the chosen method and carries user context'],
  ['AWS AgentCore', 'Runtime MCP servers', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp.html', 'Runtime hosts MCP servers (Streamable HTTP) when the protocol is set to MCP; containers use port 8000 on ARM64.', 'A coded Finance MCP server in S2 runs on Runtime, not in the Gateway.', 'Account, region, image pipeline'],
  ['AWS AgentCore', 'AWS Agent Registry', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html', 'Registry is a discovery and approval catalog; only approved records are discoverable; newer namespace is agent-registry.', 'Registry is a separate layer, not an invocation hop; do not use the older namespace as the target.', 'Release status and the current namespace in the account'],
  ['AWS AgentCore', 'Gateway MCP-server targets', 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html', 'A gateway can register an external MCP server as a target.', 'Makes the S3 hop possible in principle; interoperability with Apigee is unproven.', 'MCP version match and tool discovery against Apigee'],
  ['SAP', 'Integration Suite: MCP Server', 'https://help.sap.com/docs/integration-suite/isuite-integrations-and-apis/model-context-protocol-mcp', 'Integration Suite can expose MCP servers from an API, an HTTP endpoint with OpenAPI, or RFC; servers run on Integration Cell.', 'This is a fourth, SAP-managed option. It is not assumed in S1 to S3, which use Integration Suite only as the API and integration layer.', 'Entitlement, edition and Integration Cell availability'],
  ['SAP', 'Reference architecture for agentic SAP access', 'https://architecture.learning.sap.com/docs/ref-arch/76ec36', 'SAP reference architecture for agents and MCP access.', 'Used as context only.', 'Fit to our landscape'],
  ['SAP Community', 'Principal propagation for MCP servers', 'https://community.sap.com/t5/technology-blog-posts-by-sap/principal-propagation-for-mcp-servers-sap-integration-suite-to-sap-s-4hana/ba-p/14488137', 'Describes propagation through Integration Suite and Cloud Connector; a client-credentials token carries no user.', 'Secondary source. End-to-end propagation must be proven in our tenant.', 'Token exchange, mapping and ABAP authorization'],
];
export const EVIDENCE_NOTE = `Sources were read on ${ACCESSED}. Vendor documents describe product capability only. They are not evidence of our tenant's entitlement, activation or approval.`;

// ---------- topology model ----------
// col: column slot on the main row; row: 0 identity, 1 main, 2 data, 3 registry, 4 artifacts
const N = (id, row, col, title, sub, kind) => ({ id, row, col, title, sub, kind });
const common = {
  idp: N('idp', 0, 0, 'Enterprise identity provider', 'OAuth 2.1 / OIDC · user and agent identity', 'identity'),
  ent: N('ent', 3, 0, 'Enterprise AI Foundry', 'Publication and approval authority · TBD', 'registry'),
  repo: N('repo', 4, 0, 'Git repository', 'Source, specs, tool definitions, tests', 'artifact'),
};
export const TOPOLOGY = {
  S1: {
    cols: 5,
    nodes: [
      common.idp, common.ent, common.repo,
      N('agent', 1, 0, 'Agent runtime · MCP client', 'Approved host · demo: AgentCore Runtime', 'agent'),
      N('gw', 1, 1, 'Apigee MCP endpoint', 'MCP gateway · OAuth and API-product policy', 'gateway'),
      N('dom', 1, 2, 'SAP Finance domain tools', 'Read domain and separate posting domain · derived from OpenAPI', 'domain'),
      N('int', 1, 3, 'SAP Integration Suite', 'API and iFlow layer · Cloud Connector', 'integration'),
      N('sap', 1, 4, 'SAP S/4HANA · CF · BW/4HANA', 'ABAP authorization boundary', 'backend'),
      N('data', 2, 3, 'Analytical MCP · Databricks / BDC', 'Future state · entitlement TO VALIDATE', 'data'),
      N('hub', 3, 2, 'Apigee API hub', 'SAP-domain MCP catalog (proposed)', 'registry'),
      N('reg', 3, 3, 'Google Agent Registry', 'Synced from API hub · maturity TO VALIDATE', 'registry'),
      N('cicd', 4, 1, 'CI/CD → Apigee deploy', 'Proxies, products, policies', 'artifact'),
      N('spec', 4, 2, 'OpenAPI and tool specs', 'Versioned in Git, registered in API hub', 'artifact'),
    ],
    edges: [
      ['agent', 'gw', 'invoke', 'MCP tools/call'], ['gw', 'dom', 'invoke', 'proxy flow'], ['dom', 'int', 'invoke', 'HTTPS API'], ['int', 'sap', 'invoke', 'RFC / OData'],
      ['dom', 'data', 'invoke', 'analytics read'],
      ['idp', 'agent', 'identity', 'agent / user token'], ['idp', 'gw', 'identity', 'token validation'],
      ['agent', 'hub', 'registry', 'discover'], ['hub', 'reg', 'registry', 'sync'], ['ent', 'hub', 'approval', 'approve publication'],
      ['repo', 'cicd', 'deploy', 'commit'], ['cicd', 'gw', 'deploy', 'deploy proxy'], ['spec', 'hub', 'deploy', 'register spec'],
    ],
    bounds: [['Google Apigee (external to AWS)', ['gw', 'dom'], 'google'], ['SAP landscape', ['int', 'sap'], 'sap']],
  },
  S2: {
    cols: 5,
    nodes: [
      common.idp, common.ent, common.repo,
      N('agent', 1, 0, 'Agent runtime · MCP client', 'Approved host · demo: AgentCore Runtime', 'agent'),
      N('gw', 1, 1, 'AgentCore Gateway', 'MCP gateway · inbound auth, outbound credentials · no custom tool code', 'gateway'),
      N('dom', 1, 2, 'Finance domain MCP server', 'Coded server on AgentCore Runtime, or gateway-generated tools', 'domain'),
      N('int', 1, 3, 'SAP Integration Suite', 'API and iFlow layer · Cloud Connector', 'integration'),
      N('sap', 1, 4, 'SAP S/4HANA · CF · BW/4HANA', 'ABAP authorization boundary', 'backend'),
      N('data', 2, 3, 'Analytical MCP · Databricks / BDC', 'Future state · entitlement TO VALIDATE', 'data'),
      N('aid', 0, 1, 'AgentCore Identity', 'Credential providers for outbound auth', 'identity'),
      N('reg', 3, 2, 'AWS Agent Registry', 'Discovery and approval · agent-registry namespace', 'registry'),
      N('cicd', 4, 1, 'CI/CD → AWS deploy', 'Runtime image, gateway targets', 'artifact'),
      N('ecr', 4, 2, 'Container registry (ECR)', 'Runtime image for the MCP server', 'artifact'),
    ],
    edges: [
      ['agent', 'gw', 'invoke', 'MCP tools/call'], ['gw', 'dom', 'invoke', 'MCP target'], ['dom', 'int', 'invoke', 'HTTPS API'], ['int', 'sap', 'invoke', 'RFC / OData'],
      ['dom', 'data', 'invoke', 'analytics read'],
      ['idp', 'agent', 'identity', 'agent / user token'], ['idp', 'gw', 'identity', 'JWT validation'], ['aid', 'gw', 'identity', 'outbound credentials'],
      ['agent', 'reg', 'registry', 'discover'], ['ent', 'reg', 'approval', 'approve records'],
      ['repo', 'cicd', 'deploy', 'commit'], ['cicd', 'ecr', 'deploy', 'push image'], ['cicd', 'gw', 'deploy', 'target config'],
    ],
    bounds: [['AWS trust boundary', ['agent', 'gw', 'dom'], 'aws'], ['SAP landscape', ['int', 'sap'], 'sap']],
  },
  S3: {
    cols: 6,
    nodes: [
      common.idp, common.ent, common.repo,
      N('agent', 1, 0, 'Agent runtime · MCP client', 'Approved host · demo: AgentCore Runtime', 'agent'),
      N('gw', 1, 1, 'AgentCore Gateway', 'First gateway · agent entry on AWS', 'gateway'),
      N('gw2', 1, 2, 'Apigee MCP endpoint', 'Second gateway · SAP-domain policy', 'gateway'),
      N('dom', 1, 3, 'SAP Finance domain tools', 'Owned on the SAP-facing side · from OpenAPI', 'domain'),
      N('int', 1, 4, 'SAP Integration Suite', 'API and iFlow layer', 'integration'),
      N('sap', 1, 5, 'SAP S/4HANA · CF · BW/4HANA', 'ABAP authorization boundary', 'backend'),
      N('data', 2, 4, 'Analytical MCP · Databricks / BDC', 'Future state · TO VALIDATE', 'data'),
      N('aid', 0, 1, 'AgentCore Identity', 'Outbound token handling', 'identity'),
      N('areg', 3, 1, 'AWS Agent Registry', 'Reference record · manual or custom sync', 'registry'),
      N('hub', 3, 3, 'Apigee API hub', 'SAP-domain source of truth (proposed)', 'registry'),
      N('cicd', 4, 2, 'CI/CD → both platforms', 'Apigee bundle and AWS target', 'artifact'),
      N('spec', 4, 3, 'Specs and interface contract', 'OpenAPI plus cross-gateway contract', 'artifact'),
    ],
    edges: [
      ['agent', 'gw', 'invoke', 'MCP tools/call'], ['gw', 'gw2', 'invoke', 'MCP target · unproven'], ['gw2', 'dom', 'invoke', 'proxy flow'], ['dom', 'int', 'invoke', 'HTTPS API'], ['int', 'sap', 'invoke', 'RFC / OData'],
      ['dom', 'data', 'invoke', 'analytics read'],
      ['idp', 'agent', 'identity', 'agent / user token'], ['aid', 'gw', 'identity', 'token exchange?'], ['idp', 'gw2', 'identity', 'token validation'],
      ['agent', 'areg', 'registry', 'discover'], ['hub', 'areg', 'registry', 'manual reference'], ['ent', 'areg', 'approval', 'approve'],
      ['repo', 'cicd', 'deploy', 'commit'], ['cicd', 'gw2', 'deploy', 'deploy proxy'], ['spec', 'hub', 'deploy', 'register spec'],
    ],
    bounds: [['AWS', ['agent', 'gw'], 'aws'], ['Google Apigee', ['gw2', 'dom'], 'google'], ['SAP landscape', ['int', 'sap'], 'sap']],
  },
};

const FILL = { control: '#FFFFFF', decision: '#FFF8EE', agent: '#E8F1FB', gateway: '#FFF1E0', domain: '#EAF6EC', integration: '#F0EAF8', backend: '#E3E9EF', data: '#EEF2F5', registry: '#E5F5F2', artifact: '#F3F3F3', identity: '#FFF7DA' };
const EDGE = {
  invoke: { c: '#0A4F9E', w: 2.6, d: '' },
  registry: { c: '#0C8F76', w: 2, d: '7 4' },
  deploy: { c: '#6B6B6B', w: 2, d: '2 4' },
  identity: { c: '#C26A00', w: 2, d: '8 3 2 3' },
  approval: { c: '#B3261E', w: 2.4, d: '10 3' },
  return: { c: '#0C8F76', w: 2.2, d: '7 4' },
};
export const LEGEND = [['invoke', 'Runtime invocation'], ['registry', 'Registry / discovery'], ['deploy', 'Deployment / artifacts'], ['identity', 'Identity / authentication'], ['approval', 'Approval-gated operation']];
const BOUND = { google: '#C26A00', aws: '#0A4F9E', sap: '#5B3F8C' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrap(text, max) {
  const out = []; let line = '';
  for (const word of String(text).split(' ')) {
    if ((line + ' ' + word).trim().length > max && line) { out.push(line); line = word; } else line = (line + ' ' + word).trim();
  }
  if (line) out.push(line);
  return out;
}

export const CAPTIONS = [[104, 'IDENTITY AND SECURITY'], [224, 'RUNTIME INVOCATION PATH'], [392, 'DATA / ANALYTICS BRANCH'], [514, 'REGISTRY AND DISCOVERY (NOT AN INVOCATION HOP)'], [654, 'ARTIFACT REPOSITORY AND DEPLOYMENT']];
const MCP_FOOTER = 'Proposed design for review. Vendor names are design projections, not connected services. Placeholders are not tenant addresses. Registry and deployment arrows are not invocation traffic.';

export function topologySvg(id) {
  const t = TOPOLOGY[id], sc = SCENARIOS[id];
  return renderTopology({ ...t, title: `${sc.label} · MCP topology`, chain: sc.chain, banner: 'PROPOSED DESIGN · NOT TENANT-VERIFIED · NOT AN APPROVED ARCHITECTURE', captions: CAPTIONS, legend: LEGEND, footer: MCP_FOOTER });
}

// Shared renderer: every architecture diagram in the app (MCP topology and landscape paths) is drawn here
// so lanes, node styling, edge styles, legend and header stay identical.
export function renderTopology(t) {
  const W = 1200, H = t.height || 840, M = 30, GAP = 30, NH = t.nh || 92;
  const nw = (W - 2 * M - (t.cols - 1) * GAP) / t.cols;
  const ys = t.ys || [118, 258, 398, 528, 668];
  const pos = {};
  for (const n of t.nodes) { const span = n.span || 1; pos[n.id] = { x: M + n.col * (nw + GAP), y: ys[n.row], w: span * nw + (span - 1) * GAP, h: n.h || NH, n }; }
  const parts = [];
  // boundaries first
  for (const [label, members, kind] of t.bounds) {
    const bs = members.map(m => pos[m]);
    const x = Math.min(...bs.map(b => b.x)) - 10, y = Math.min(...bs.map(b => b.y)) - 24;
    const x2 = Math.max(...bs.map(b => b.x + b.w)) + 10, y2 = Math.max(...bs.map(b => b.y + b.h)) + 10;
    parts.push(`<rect x="${x}" y="${y}" width="${x2 - x}" height="${y2 - y}" rx="8" fill="none" stroke="${BOUND[kind]}" stroke-width="2" stroke-dasharray="14 5"/>`);
    parts.push(`<text x="${x + 8}" y="${y + 15}" font-size="12" font-weight="700" fill="${BOUND[kind]}">${esc(label)}</text>`);
  }
  // identity band label
  const cap = (y, text, anchor = 'end') => parts.push(`<text x="${anchor === 'end' ? W - M : M}" y="${y}" font-size="11.5" font-weight="700" fill="#506778" text-anchor="${anchor}">${text}</text>`);
  for (const [y, text, anchor] of t.captions) cap(y, text, anchor);
  // edges
  const labels = [];
  const arrows = [];
  const idCount = {};
  for (const [a, b, type, label, opts = {}] of t.edges) {
    const slot = type === 'identity' ? (idCount[a] = (idCount[a] ?? -1) + 1) : 0;
    const A = pos[a], B = pos[b], st = opts.active ? { ...EDGE[type], c: '#E9730C', w: EDGE[type].w + 1 } : EDGE[type];
    const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 }, bc = { x: B.x + B.w / 2, y: B.y + B.h / 2 };
    let d, lx, ly, ex, ey, dx, dy;
    if (type === 'return' && A.n.row === B.n.row && !opts.straight) {
      const sx = A.x + A.w / 2, tx = B.x + B.w / 2, y0 = A.y + A.h, y1 = y0 + 56;
      d = `M${sx},${y0} L${sx},${y1} L${tx},${y1} L${tx},${y0}`; lx = (sx + tx) / 2; ly = y1 - 7; ex = tx; ey = y0; dx = 0; dy = -1;
    } else if (A.n.row === B.n.row) {
      const left = A.x < B.x;
      const sx = left ? A.x + A.w : A.x, tx = left ? B.x : B.x + B.w, y = ac.y + (type === 'identity' ? 14 : 0);
      d = `M${sx},${y} L${tx},${y}`; lx = (sx + tx) / 2; ly = A.y + A.h + (A.n.row === 1 ? 26 : 14); ex = tx; ey = y; dx = left ? 1 : -1; dy = 0;
    } else {
      const down = A.y < B.y;
      const sy = down ? A.y + A.h : A.y, ty = down ? B.y : B.y + B.h;
      const off = type === 'identity' ? 14 + slot * 40 : type === 'approval' ? -12 : (opts.off || 0);
      const sx = ac.x + off, tx = bc.x + off, my = opts.my ?? (sy + ty) / 2;
      d = `M${sx},${sy} L${sx},${my} L${tx},${my} L${tx},${ty}`;
      if (type === 'identity') { lx = sx; ly = sy + (down ? 18 + slot * 14 : -8); } else if (opts.labelAt === 'mid') { lx = (sx + tx) / 2; ly = my - 6; } else { lx = tx; ly = down ? ty - 8 : ty + 20; } ex = tx; ey = ty; dx = 0; dy = down ? 1 : -1;
    }
    parts.push(`<path d="${d}" fill="none" stroke="${st.c}" stroke-width="${st.w}"${st.d ? ` stroke-dasharray="${st.d}"` : ''}${opts.active ? ' class="live-flow"' : ''} data-edge="${a}-${b}"/>`);
    const s = 7;
    arrows.push(dx !== 0
      ? `<polygon points="${ex},${ey} ${ex - dx * s * 1.6},${ey - s * 0.7} ${ex - dx * s * 1.6},${ey + s * 0.7}" fill="${st.c}"/>`
      : `<polygon points="${ex},${ey} ${ex - s * 0.7},${ey - dy * s * 1.6} ${ex + s * 0.7},${ey - dy * s * 1.6}" fill="${st.c}"/>`);
    if (label) labels.push([lx, ly, label, st.c]);
  }
  parts.push(...arrows);
  // nodes
  for (const n of t.nodes) {
    const p = pos[n.id];
    const tag = `${n.stage ? ' data-stage="1"' : ''}${n.kind === 'control' ? ' data-control="1"' : ''}`;
    parts.push(`<rect data-node="${n.id}"${tag} x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="7" fill="${FILL[n.kind]}" stroke="${n.stroke || '#506778'}" stroke-width="${n.strokeWidth || 1.4}"${n.dashed ? ' stroke-dasharray="7 4"' : ''}${n.cls ? ` class="${n.cls}"` : ''}/>`);
    const title = wrap(n.title, Math.floor(p.w / 7.1)).slice(0, 2);
    title.forEach((line, i) => parts.push(`<text x="${p.x + 8}" y="${p.y + 20 + i * 15}" font-size="12.5" font-weight="700" fill="#1D2D3E">${esc(line)}</text>`));
    const sub = wrap(n.sub, Math.floor((p.w - 8) / 5.7)).slice(0, Math.max(2, Math.floor((p.h - 20 - title.length * 15 - 8) / 12.5) - (n.status ? 1 : 0)));
    sub.forEach((line, i) => parts.push(`<text x="${p.x + 8}" y="${p.y + 20 + title.length * 15 + i * 12.5}" font-size="10.5" fill="#34495C">${esc(line)}</text>`));
    if (n.status) parts.push(`<text x="${p.x + 8}" y="${p.y + p.h - 9}" font-size="10.5" font-weight="700" fill="${n.statusColor || '#34495C'}">${esc(n.status)}</text>`);
    if (n.zone) parts.push(`<rect data-zone="${esc(n.zone)}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="7" fill="transparent"/>`);
  }
  for (const [lx, ly, label, c] of labels) {
    const w = label.length * 5.6 + 10;
    parts.push(`<rect x="${lx - w / 2}" y="${ly - 11}" width="${w}" height="15" rx="3" fill="#F1F4F7" opacity="0.94"/><text x="${lx}" y="${ly}" font-size="10.5" font-weight="600" fill="${c}" text-anchor="middle">${esc(label)}</text>`);
  }
  // legend
  let lx0 = M;
  parts.push(`<rect x="${M - 8}" y="${H - 54}" width="${W - 2 * M + 16}" height="40" rx="6" fill="#FFFFFF" stroke="#D9E1E7"/>`);
  parts.push(`<text x="${M}" y="${H - 36}" font-size="11" font-weight="700" fill="#506778">LEGEND</text>`);
  for (const [type, text] of t.legend) {
    const st = EDGE[type];
    parts.push(`<line x1="${lx0 + 60}" y1="${H - 40}" x2="${lx0 + 90}" y2="${H - 40}" stroke="${st.c}" stroke-width="${st.w}"${st.d ? ` stroke-dasharray="${st.d}"` : ''}/><text x="${lx0 + 96}" y="${H - 36}" font-size="11" fill="#1D2D3E">${esc(text)}</text>`);
    lx0 += 96 + text.length * 5.4 + 8;
  }
  parts.push(`<text x="${M}" y="${H - 20}" font-size="10.5" fill="#506778">${esc(t.footer)}</text>`);
  const title = t.title;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${H}" role="img" aria-labelledby="t d" font-family="'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif" text-rendering="geometricPrecision"><title id="t">${esc(title)}</title><desc id="d">${esc(t.chain)}</desc><rect width="1200" height="${H}" fill="#F1F4F7"/><text x="${M}" y="40" font-size="20" font-weight="700" fill="#1D2D3E">${esc(title)}</text><text x="${M}" y="62" font-size="12" fill="#34495C">${esc(t.chain.length > 150 ? t.chain.slice(0, 147) + '…' : t.chain)}</text><text x="${M}" y="82" font-size="11" fill="#B3261E" font-weight="700">${esc(t.banner)}</text>${parts.join('')}</svg>\n`;
}
