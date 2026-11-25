// Render every architecture diagram from the exported model with the same renderer the application uses, and check that each SVG
// contains exactly the nodes and edges of its spec (so a diagram cannot drift from the canonical model).
//   node scripts/render_architecture_svgs.mjs [outputDir]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] || path.join(os.tmpdir(), 'architecture_svgs');
fs.mkdirSync(out, { recursive: true });
const modelPath = path.join(root, 'frontend', 'src', 'architectureModel.json');
const source = fs.readFileSync(path.join(root, 'frontend', 'src', 'mcpScenarios.js'), 'utf8')
  .replace("import MODEL from './architectureModel.json';", `import { readFileSync } from 'node:fs'; const MODEL = JSON.parse(readFileSync(${JSON.stringify(modelPath)}, 'utf8'));`);
const tmp = path.join(out, '_mcpScenarios.mjs');
fs.writeFileSync(tmp, source);
const lib = await import(pathToFileURL(tmp).href);
const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
let failed = 0;
for (const key of Object.keys(model.diagrams)) {
  const spec = model.diagrams[key];
  const svg = lib.diagramSvg(key);
  fs.writeFileSync(path.join(out, `${key}.svg`), svg);
  const nodes = [...svg.matchAll(/data-node="([^"]+)"/g)].map(m => m[1]).sort();
  const edges = [...svg.matchAll(/data-edge="([^"]+)"/g)].map(m => m[1]).sort();
  const wantNodes = spec.nodes.map(n => n.id).sort();
  const wantEdges = spec.edges.map(e => `${e[0]}-${e[1]}`).sort();
  const ok = JSON.stringify(nodes) === JSON.stringify(wantNodes) && JSON.stringify(edges) === JSON.stringify(wantEdges);
  const clipped = [...svg.matchAll(/data-node="([^"]+)" data-clipped/g)].map(m => m[1]);
  if (clipped.length) console.log(`CLIPPED TEXT in ${key}: ${clipped.join(', ')}`);
  if (!ok || clipped.length) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${key} ${spec.title} nodes=${nodes.length}/${wantNodes.length} edges=${edges.length}/${wantEdges.length}`);
}
console.log(`${failed ? 'FAILED' : 'ALL DIAGRAMS MATCH THEIR SPEC'} (${Object.keys(model.diagrams).length} diagrams) -> ${out}`);
process.exit(failed ? 1 : 0);
