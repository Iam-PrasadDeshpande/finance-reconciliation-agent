param([int]$Port = 8502)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path -LiteralPath '.venv\Scripts\python.exe')) { py -3.13 -m venv .venv }
$python = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath 'frontend\dist_streamlit\finance_architecture.js')) {
    Push-Location frontend
    try { npm ci; if ($LASTEXITCODE -ne 0) { throw 'Node dependency installation failed' }; npm run build; if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed' } }
    finally { Pop-Location }
}
& $python -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw 'Python dependency installation failed' }
& $python -m streamlit run streamlit_app.py --server.address 127.0.0.1 --server.port $Port --server.headless true
