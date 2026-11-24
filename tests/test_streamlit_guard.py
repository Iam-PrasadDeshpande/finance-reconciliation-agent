import ast
import sys
import types
from pathlib import Path


def load_guard():
    source = (Path(__file__).resolve().parents[1] / "streamlit_app.py").read_text(encoding="utf-8")
    module = ast.parse(source)
    node = next(n for n in module.body if isinstance(n, ast.FunctionDef) and n.name == "_reload_changed_poc_modules")
    namespace = {"hashlib": __import__("hashlib"), "sys": sys, "Path": Path}
    exec(compile(ast.Module([node], []), "streamlit_app.py", "exec"), namespace)
    return namespace["_reload_changed_poc_modules"]


def test_changed_poc_sources_drop_cached_modules_and_unchanged_sources_keep_them(tmp_path):
    guard = load_guard()
    package = tmp_path / "poc"
    package.mkdir()
    (package / "a.py").write_text("VALUE = 1\n", encoding="utf-8")
    saved = getattr(sys, "_finance_poc_stamp", None)
    sys.modules["poc.guard_probe"] = types.ModuleType("poc.guard_probe")
    try:
        assert guard(package) is True and "poc.guard_probe" not in sys.modules
        sys.modules["poc.guard_probe"] = types.ModuleType("poc.guard_probe")
        assert guard(package) is False and "poc.guard_probe" in sys.modules
        (package / "a.py").write_text("VALUE = 2\n", encoding="utf-8")
        assert guard(package) is True and "poc.guard_probe" not in sys.modules
    finally:
        sys.modules.pop("poc.guard_probe", None)
        if saved is None:
            if hasattr(sys, "_finance_poc_stamp"):
                del sys._finance_poc_stamp
        else:
            sys._finance_poc_stamp = saved
