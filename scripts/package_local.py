"""Create a clean Windows laptop bundle with compiled UI and synthetic Python code."""
from __future__ import annotations

import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "release" / "finance_reconciliation_local_windows.zip"
files = [
    ROOT / "Start Finance Demo.cmd",
    ROOT / "local_demo.py",
    ROOT / "run_poc.ps1",
    ROOT / "run_streamlit.ps1",
    ROOT / "requirements.txt",
    ROOT / "requirements-local.txt",
    ROOT / "streamlit_app.py",
    ROOT / "README.md",
    ROOT / "docs" / "LOCAL_LAPTOP_GUIDE.md",
    ROOT / ".streamlit" / "config.toml",
]
files += sorted((ROOT / "poc").glob("*.py"))
files += sorted((ROOT / "frontend" / "dist").rglob("*.*"))
files += sorted((ROOT / "frontend" / "dist_streamlit").glob("finance_architecture.*"))
assert all(path.is_file() for path in files)
payload = {str(path.relative_to(ROOT)).replace("\\", "/"): path.read_bytes() for path in files}
assert "frontend/dist/index.html" in payload
assert "frontend/dist_streamlit/finance_architecture.js" in payload
assert "poc/route_playbooks.py" in payload
assert not any(any(block in name for block in (".env", ".sqlite", "node_modules", "__pycache__", ".venv", "secrets.toml")) for name in payload)
manifest = {name: hashlib.sha256(data).hexdigest() for name, data in sorted(payload.items())}
payload["LOCAL_BUNDLE_MANIFEST.json"] = json.dumps({"synthetic": True, "files_sha256": manifest}, indent=2).encode()
OUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for name, data in sorted(payload.items()):
        archive.writestr(name, data)
with zipfile.ZipFile(OUT) as archive:
    assert set(archive.namelist()) == set(payload)
    assert all(hashlib.sha256(archive.read(name)).hexdigest() == digest for name, digest in manifest.items())
print(json.dumps({"bundle": str(OUT), "files": len(payload), "bytes": OUT.stat().st_size,
                  "sha256": hashlib.sha256(OUT.read_bytes()).hexdigest()}))
