# ============================================
# Script de demarrage rapide - PID Reservations
# Usage : .\start.ps1
# Auteur : Abdulrahman SABBAGH (Production)
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PID Reservations - Demarrage rapide"
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verifier si Docker est en cours d'execution
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERREUR] Docker n'est pas demarre. Lancez Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verifier si .env existe, sinon le creer depuis .env.example
if (!(Test-Path ".env")) {
    Write-Host "[INFO] Creation du fichier .env depuis .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] Fichier .env cree. Modifiez-le si necessaire." -ForegroundColor Green
}

# Build et demarrage des conteneurs
Write-Host ""
Write-Host "[1/3] Build des images Docker..." -ForegroundColor Yellow
docker-compose build

Write-Host ""
Write-Host "[2/3] Demarrage des conteneurs..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "[3/3] Verification des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker-compose ps

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Services demarres avec succes"
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend  : http://localhost:8080" -ForegroundColor Cyan
Write-Host "  MySQL    : localhost:3307" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Arreter  : docker-compose down" -ForegroundColor Yellow
Write-Host "  Logs     : docker-compose logs -f" -ForegroundColor Yellow
Write-Host ""
