# Script pour importer les medias dans le portfolio
# Usage: .\import-media.ps1

Write-Host "Import des medias pour le portfolio" -ForegroundColor Cyan
Write-Host ""

$baseDir = "C:\Users\issam\Desktop\portfolio-issam\backend\storage\app\public"
$gamesDir = Join-Path $baseDir "games"
$projectsDir = Join-Path $baseDir "projects"

# Afficher les fichiers manquants
Write-Host "Fichiers de jeux requis dans:" -ForegroundColor Yellow
Write-Host $gamesDir -ForegroundColor Gray
Write-Host ""
@("Jeux.JPG", "Jeux 2.JPG", "Jeux 2.1.JPG", "Jeux 2.2.JPG", "Jeux 3.JPG") | ForEach-Object {
    $file = Join-Path $gamesDir $_
    if (Test-Path $file) {
        Write-Host "  OK $_" -ForegroundColor Green
    } else {
        Write-Host "  MANQUANT $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Fichiers de projets requis dans:" -ForegroundColor Yellow
Write-Host $projectsDir -ForegroundColor Gray
Write-Host ""
@("phylogenetic-tree.mp4", "mediatheque.mp4") | ForEach-Object {
    $file = Join-Path $projectsDir $_
    if (Test-Path $file) {
        Write-Host "  OK $_" -ForegroundColor Green
    } else {
        Write-Host "  MANQUANT $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host "1. Copiez vos images JPG dans: $gamesDir"
Write-Host "2. Copiez vos vidéos MP4 dans: $projectsDir"
Write-Host "3. Les fichiers seront automatiquement accessibles via http://localhost:8000/storage/"
Write-Host ""

# Demander si l'utilisateur veut ouvrir les dossiers
$response = Read-Host "Voulez-vous ouvrir les dossiers maintenant? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    explorer $gamesDir
    explorer $projectsDir
}
