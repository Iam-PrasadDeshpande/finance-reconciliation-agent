param([int]$Port = 8502)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 (Join-Path $PSScriptRoot 'local_demo.py') --mode streamlit --port $Port
} else {
    & python (Join-Path $PSScriptRoot 'local_demo.py') --mode streamlit --port $Port
}
if ($LASTEXITCODE -ne 0) { throw "Local Streamlit demo exited with code $LASTEXITCODE" }
