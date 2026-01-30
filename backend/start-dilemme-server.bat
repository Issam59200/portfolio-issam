@echo off
REM Script Windows pour démarrer le serveur du Dilemme du Prisonnier

cd /d "%~dp0\public\dilemme-prisonnier"

if not exist "index.html" (
    echo Erreur: Dossier dilemme-prisonnier introuvable
    exit /b 1
)

echo Demarrage du serveur Dilemme du Prisonnier sur http://localhost:8001...
start /B php -S localhost:8001

echo Serveur demarre avec succes!
echo Le jeu est accessible a: http://localhost:8001
