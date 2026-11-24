"""Build a minimal, deterministic Streamlit upload archive from allowlisted sources."""
from __future__ import annotations

import hashlib
import json
import py_compile
import zipfile
from pathlib import Path

import subprocess


def committed_bytes(root, path):
    """Return the committed Git blob for text files so ZIPs match across CRLF/LF checkouts."""
    rel = path.relative_to(root).as_posix()
    if path.suffix == ".zip":
        return path.read_bytes()
    result = subprocess.run(["git", "show", f"HEAD:{rel}"], cwd=root, capture_output=True)
    return result.stdout if result.returncode == 0 else path.read_bytes()

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"release"
OUT.mkdir(exist_ok=True)
TARGET=OUT/"finance_architecture_streamlit.zip"
files=[ROOT/"streamlit_app.py",ROOT/".streamlit"/"config.toml",ROOT/"README.md",ROOT/"docs"/"POC_LIMITATIONS.md",ROOT/"docs"/"ARCHITECTURE_MAPPING.md"]
files+=sorted((ROOT/"poc").glob("*.py"))
files+=sorted((ROOT/"frontend"/"dist_streamlit").glob("finance_architecture.*"))
files.append(ROOT/"static"/"finance_reconciliation_local_windows.zip")
assert all(path.is_file() for path in files)
assert {path.suffix for path in files if path.parent.name=="dist_streamlit"}=={".js",".css"}
requirements="streamlit==1.67.0\npydantic==2.13.4\nPyYAML==6.0.3\n"
payload={str(path.relative_to(ROOT)).replace("\\","/"):committed_bytes(ROOT,path) for path in files}
payload["requirements.txt"]=requirements.encode()
for path in files:
    if path.suffix==".py": py_compile.compile(str(path),doraise=True)
assert not any(any(bad in name for bad in (".env",".sqlite","node_modules","__pycache__","evidence/",".venv")) for name in payload)
manifest={name:{"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data)} for name,data in sorted(payload.items())}
payload["UPLOAD_MANIFEST.json"]=json.dumps({"entrypoint":"streamlit_app.py","synthetic":True,"files":manifest},indent=2).encode()
with zipfile.ZipFile(TARGET,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for name,data in sorted(payload.items()):
        item=zipfile.ZipInfo(name,date_time=(2026,11,22,0,0,0))
        item.compress_type=zipfile.ZIP_DEFLATED
        item.external_attr=0o644<<16
        archive.writestr(item,data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(TARGET) as archive:
    assert set(archive.namelist())==set(payload)
    assert all(hashlib.sha256(archive.read(name)).hexdigest()==entry["sha256"] for name,entry in manifest.items())
print(json.dumps({"archive":str(TARGET),"files":len(payload),"bytes":TARGET.stat().st_size,"sha256":hashlib.sha256(TARGET.read_bytes()).hexdigest()}))
