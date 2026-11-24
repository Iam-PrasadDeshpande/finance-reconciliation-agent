"""Install once and launch the synthetic demo on this laptop only."""
from __future__ import annotations

import argparse
import hashlib
import subprocess
import sys
import venv
from pathlib import Path


ROOT = Path(__file__).resolve().parent
VENV = ROOT / ".venv"
PYTHON = VENV / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
def prepare(mode: str) -> None:
    if sys.version_info < (3, 11):
        raise SystemExit("Python 3.11 or newer is required.")
    required_assets = (
        ROOT / "frontend/dist/index.html",
        ROOT / "frontend/dist_streamlit/finance_architecture.js",
        ROOT / "frontend/dist_streamlit/finance_architecture.css",
    )
    missing = [str(path.relative_to(ROOT)) for path in required_assets if not path.is_file()]
    if missing:
        raise SystemExit(f"Compiled frontend assets are missing: {', '.join(missing)}. Use the complete repository download.")
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the synthetic finance demo locally.")
    parser.add_argument("--mode", choices=("web", "streamlit"), default="web")
    parser.add_argument("--port", type=int)
    args = parser.parse_args()
    port = args.port or (8876 if args.mode == "web" else 8502)
    if not 1 <= port <= 65535:
        parser.error("port must be between 1 and 65535")
    prepare(args.mode)
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
