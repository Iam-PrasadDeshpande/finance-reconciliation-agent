"""Export the canonical architecture model (poc/architecture_model.py) to frontend/src/architectureModel.json.

The frontend reads only this file for scenarios, comparison tables and diagram specs. Run it after any change to the model;
``tests/test_architecture_model.py`` fails when the committed JSON is out of date. Refuses to write when the model is invalid.

    python scripts/build_architecture_model.py [--check]
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from poc import architecture_model as model  # noqa: E402

TARGET = ROOT / "frontend" / "src" / "architectureModel.json"


def render() -> str:
    return json.dumps(model.export(), indent=1, ensure_ascii=False, sort_keys=False) + "\n"


if __name__ == "__main__":
    errors = model.validate()
    if errors:
        print("ARCHITECTURE MODEL INVALID")
        print("\n".join(errors))
        raise SystemExit(1)
    text = render()
    if "--check" in sys.argv:
        current = TARGET.read_text(encoding="utf-8") if TARGET.exists() else ""
        print("UP TO DATE" if current.replace("\r\n", "\n") == text else "OUT OF DATE")
        raise SystemExit(0 if current.replace("\r\n", "\n") == text else 1)
    TARGET.write_text(text, encoding="utf-8", newline="\n")
    print(f"wrote {TARGET.relative_to(ROOT)} ({len(text)} bytes)")
