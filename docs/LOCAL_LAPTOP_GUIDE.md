# Run the synthetic finance demo on a Windows laptop

## Recommended: local web app

1. Install an organization-approved Python 3.11 or newer and make its `py` launcher or `python` command available. Python 3.13 is the version used for this project's local checks.
2. On the hosted demo's **My Home** page, select **Download Windows bundle**. Copy the ZIP to a writable folder on the laptop and extract **all** files. The archive contains the compiled UI; Node.js and Git are not required to run it.
3. Run these standalone scripts in order from the extracted folder:
   - `01_Check_Prerequisites.cmd` confirms Python and the compiled UI files.
   - `02_Install_Local_Runtime.cmd` creates `.venv` and installs the small web runtime from `requirements-local.txt`. This first setup needs an approved Python package index.
   - `03_Run_Local_Demo.cmd` starts the local server. Keep this window open.
   - In a **second window**, run `04_Verify_Local_Demo.cmd`. It confirms the page, health endpoint, 12 periods, six decisions and three routes.
4. The browser opens at `http://127.0.0.1:8876/`. If it does not open automatically, enter that address in a browser on the same laptop. Press **Ctrl+C** in the Step 03 window to stop it.

`Start Finance Demo.cmd` remains a one-click alternative. It combines setup and start, so the numbered scripts are optional when you want a quick demo.

The FastAPI mode stores synthetic cases in `poc_state.sqlite3` beside the extracted app. It binds only to `127.0.0.1`, so another device cannot browse it over the network. The app does not need a SAP, AWS, Google, Databricks or model account.

The current interface has five primary tabs: **Execution simulator**, **Live architecture**, **Architecture pros & cons**, **Architecture diagrams** and **MCP hosting & governance**. The last tab compares S1, S2 and S3 as MCP topologies with three zoomable SVG diagrams (export as SVG or 2x/4x PNG), responsibility and endpoint matrices, registry and artifact ownership and a recommendation; it needs no network access. The last tab shows the two detailed reference diagrams (S1 Google Apigee MCP, S2 AgentCore Gateway MCP, or both side by side) in a zoom-and-pan viewer; use the mouse wheel or pinch to zoom, drag to pan, **Reset** to fit, **Expand** for a full-screen view and **Open full-size** or **SVG** to open or save the vector file. The third tab is a single-screen overview: four MCP views (**S1**, **S2**, **S3** and **Compare all**) above four agent-hosting candidates (approved enterprise agent platform, SAP BTP pro-code, Microsoft Foundry hosted agent and Joule Studio). Seven landscape architecture diagrams open as dialogs from the route and hosting cards; press **Esc** or **Close** to dismiss them. Handoff, proof, evidence and architecture questions also open as dialogs. S1, S2 and S3 are simulated or proposed designs, not approved tenant architecture, and all platform and SAP connections remain simulated. The demo's SAP access is read-only; asking the assistant to post a journal is refused.

To use a different port, open a terminal in the extracted folder and run `py -3 local_demo.py --port 8899`. If the corporate laptop does not allow local Python or package installation, ask IT for an approved Python runtime and access to the approved package index; no production credentials should be added to this demo.

## Optional: local Streamlit mode

Run `py -3 local_demo.py --mode streamlit --port 8502` from the extracted folder, or use `run_streamlit.ps1` where PowerShell scripts are allowed. This mode installs the larger `requirements.txt` set on first use. Open `http://127.0.0.1:8502/`. This is also local; it does not use Streamlit Community Cloud. Streamlit cases live only for the browser session, while the recommended FastAPI mode keeps its SQLite demo cases locally.

The `run_poc.ps1` PowerShell script is an alternative to the double-click launcher. Neither mode requires Node.js at runtime. Node.js is only needed to rebuild the UI after editing frontend source.
