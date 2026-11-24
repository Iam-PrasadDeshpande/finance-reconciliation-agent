"""Install once and launch the synthetic demo on this laptop only."""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
import urllib.request
import venv
from pathlib import Path


ROOT = Path(__file__).resolve().parent
VENV = ROOT / ".venv"
PYTHON = VENV / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")


def check() -> None:
    if sys.version_info < (3, 11):
        raise SystemExit("Python 3.11 or newer is required.")
    print(f"Python {sys.version.split()[0]}: OK", flush=True)
    required_assets = (
        ROOT / "frontend/dist/index.html",
        ROOT / "frontend/dist_streamlit/finance_architecture.js",
        ROOT / "frontend/dist_streamlit/finance_architecture.css",
        ROOT / "requirements-local.txt",
    )
    missing = [str(path.relative_to(ROOT)) for path in required_assets if not path.is_file()]
    if missing:
        raise SystemExit(f"Bundle incomplete: {', '.join(missing)}. Extract the full ZIP into a writable folder.")
    print("Compiled UI and local requirements: OK", flush=True)
    print(f"Folder: {ROOT}", flush=True)


def prepare(mode: str) -> None:
    check()
    if not PYTHON.is_file():
        print("Creating local Python environment...", flush=True)
        venv.EnvBuilder(with_pip=True).create(VENV)
    requirements = ROOT / ("requirements-local.txt" if mode == "web" else "requirements.txt")
    marker = VENV / f".finance-{mode}-requirements-sha256"
    digest = hashlib.sha256(requirements.read_bytes()).hexdigest()
    if not marker.is_file() or marker.read_text(encoding="utf-8").strip() != digest:
        print("Installing Python dependencies (first launch or requirements changed)...", flush=True)
        subprocess.run([str(PYTHON), "-m", "pip", "install", "-r", str(requirements)], cwd=ROOT, check=True)
        marker.write_text(digest + "\n", encoding="utf-8")
    print(f"Local {mode} runtime: READY", flush=True)


def verify(port: int) -> None:
    base = f"http://127.0.0.1:{port}"
    try:
        with urllib.request.urlopen(f"{base}/api/health", timeout=5) as response:
            health = json.load(response)
        with urllib.request.urlopen(f"{base}/api/bootstrap", timeout=5) as response:
            bootstrap = json.load(response)
        with urllib.request.urlopen(base + "/", timeout=5) as response:
            page_status = response.status
    except Exception as exc:
        raise SystemExit(f"Local demo is not reachable at {base}/. Start step 03 in another window first. Detail: {exc}") from exc
    periods = bootstrap.get("history", {}).get("available_periods", [])
    decisions = bootstrap.get("decision_questions", [])
    routes = bootstrap.get("route_playbooks", {})
    if health.get("status") != "ready" or not health.get("simulation") or page_status != 200:
        raise SystemExit("Local server responded, but its health or page check failed.")
    if len(periods) != 12 or len(decisions) != 6 or set(routes) != {"S1", "S2", "S3"}:
        raise SystemExit("Local data check failed: expected 12 periods, six decisions and three routes.")
    print(f"PASS: {base}/", flush=True)
    print("PASS: 12 periods, six open decisions, three architecture routes", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the synthetic finance demo locally.")
    parser.add_argument("--mode", choices=("web", "streamlit"), default="web")
    parser.add_argument("--action", choices=("run", "check", "setup", "verify"), default="run")
    parser.add_argument("--port", type=int)
    args = parser.parse_args()
    port = args.port or (8876 if args.mode == "web" else 8502)
    if not 1 <= port <= 65535:
        parser.error("port must be between 1 and 65535")
    if args.action == "check":
        check()
        return
    if args.action == "verify":
        if args.mode != "web":
            parser.error("verify currently checks the local web mode only")
        verify(port)
        return
    prepare(args.mode)
    if args.action == "setup":
        return
    print(f"Opening http://127.0.0.1:{port}/ (press Ctrl+C to stop)", flush=True)
    if args.mode == "web":
        command = [str(PYTHON), "-m", "poc.launcher", "--port", str(port)]
    else:
        command = [str(PYTHON), "-m", "streamlit", "run", "streamlit_app.py",
                   "--server.address", "127.0.0.1", "--server.port", str(port),
                   "--server.headless", "false", "--browser.gatherUsageStats", "false"]
    try:
        raise SystemExit(subprocess.call(command, cwd=ROOT))
    except KeyboardInterrupt:
        raise SystemExit(0)


if __name__ == "__main__":
    main()
