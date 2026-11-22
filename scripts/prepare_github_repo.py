"""Stage an explicit, source-complete repository without local runtime state."""
from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/"release"/"github_repo"
if TARGET.exists():
    raise SystemExit("Staging directory already exists; refusing to overwrite it")
if TARGET.resolve().parent!=(ROOT/"release").resolve():
    raise SystemExit("Unexpected staging path")

files=[]
files += [ROOT/name for name in (
    "README.md", "streamlit_app.py", "requirements.txt", "run_streamlit.ps1", "run_poc.ps1",
    "component_registry.yaml", "edge_registry.yaml", ".streamlit/config.toml",
    "release/finance_architecture_streamlit.zip",
)]
for folder,pattern in (("poc","*.py"),("frontend/src","*"),("frontend/dist","**/*"),
                       ("frontend/dist_streamlit","*"),("scripts","*.py"),("tests","*.py"),("docs","*.md")):
    files += [p for p in (ROOT/folder).glob(pattern) if p.is_file()]
files += [ROOT/"frontend"/name for name in ("package.json","package-lock.json","vite.config.js","index.html")]
files += [ROOT/"docs"/"evidence"/name for name in (
    "agentic_trace_bundle.json", "agentic_architecture_proof.png", "agentic_resolved_dossier.png",
    "agentic_mapping_hold.png", "agentic_streamlit_dossier.png", "release_mobile.png",
)]
assert all(p.is_file() and p.resolve().is_relative_to(ROOT.resolve()) for p in files)
assert len(files)==len(set(files))

patterns={
    "GitHub token":re.compile(rb"gh[opsu]_[A-Za-z0-9]{20,}"),
    "OpenAI-style key":re.compile(rb"sk-[A-Za-z0-9]{20,}"),
    "AWS access key":re.compile(rb"AKIA[0-9A-Z]{16}"),
    "private key":re.compile(rb"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
}
for source in files:
    if source.suffix.lower() in (".png",".zip"): continue
    data=source.read_bytes()
    for label,pattern in patterns.items():
        if pattern.search(data): raise SystemExit(f"Potential {label} in {source.relative_to(ROOT)}; staging stopped")

manifest={}
for source in files:
    relative=source.relative_to(ROOT)
    destination=TARGET/relative
    destination.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,destination)
    data=destination.read_bytes()
    manifest[relative.as_posix()]={"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data)}

ignore=""".venv/
__pycache__/
.pytest_cache*/
.pytest_tmp*/
*.pyc
*.sqlite3
frontend/node_modules/
frontend/.vite/
.env
.env.*
.streamlit/secrets.toml
"""
(TARGET/".gitignore").write_text(ignore,encoding="utf-8")
(TARGET/"PUBLISH_MANIFEST.json").write_text(json.dumps({"purpose":"Private synthetic finance demo source and Streamlit entrypoint","files":manifest},indent=2),encoding="utf-8")
print(json.dumps({"staged":str(TARGET),"source_files":len(files),"total_bytes":sum(item["bytes"] for item in manifest.values()),"manifest_valid":all(hashlib.sha256((TARGET/name).read_bytes()).hexdigest()==item["sha256"] for name,item in manifest.items())}))
