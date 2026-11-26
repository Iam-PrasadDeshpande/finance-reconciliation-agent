"""Navigation helper for the browser checks: the shell is SAP Fiori Spaces and Pages (Finance apps, Agents, Architecture & operations).
Old checks addressed level 1 by position (apps first, then Agents, then Architecture); nav(f).nth(i).click() keeps that contract:
an app index opens the Finance apps page and its tile, the next index opens the Agents space, the last the Architecture page of tiles."""
N_APPS = 3


import re

_MOBILE = {"Finance apps": "Apps", "Architecture": "Architecture"}  # the phone layout shows the short label


def space(f, name):
    short = _MOBILE.get(name, name)
    f.get_by_role("tablist", name="Spaces").get_by_role("tab", name=re.compile(f"^({re.escape(name)}|{re.escape(short)})")).click()


def go(f, index, n_apps=N_APPS):
    if index < n_apps:
        space(f, "Finance apps")
        f.locator(".fi-gtile").nth(index).click()
    elif index == n_apps:
        space(f, "Agents")
    else:
        space(f, "Architecture")


class _Item:
    def __init__(self, f, index):
        self.f, self.index = f, index

    def click(self):
        go(self.f, self.index)


class _Nav:
    def __init__(self, f):
        self.f = f

    def nth(self, index):
        return _Item(self.f, index)


def nav(f):
    return _Nav(f)


def agent_page(f, name):
    """Open a page of the Agents space: Ask the agents, Agent catalog or Technical options."""
    f.get_by_role("tablist", name="Agent pages").get_by_role("tab", name=name).click()
