# Script de configuration des medias pour le portfolio
# Execute ce script pour copier vos fichiers medias aux bons emplacements

$ErrorActionPreference = "Continue"
$baseDir = "C:\Users\issam\Desktop\portfolio-issam\backend\storage\app\public"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  SETUP MEDIAS PORTFOLIO" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour copier un fichier
function Copy-MediaFile {
    param($source, $destination, $description)
    
    if (Test-Path $source) {
        $destDir = Split-Path $destination -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $source $destination -Force
        Write-Host "  OK  $description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  SKIP $description (fichier source introuvable)" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "Recherche de vos fichiers sur le Bureau..." -ForegroundColor Yellow
Write-Host ""

# Demander a l'utilisateur ou sont ses fichiers
Write-Host "Ou se trouvent vos fichiers medias?" -ForegroundColor Cyan
Write-Host "1. Sur le Bureau"
Write-Host "2. Dans Telechargements"
Write-Host "3. Je vais les specifier manuellement"
Write-Host ""
$choice = Read-Host "Votre choix (1-3)"

$searchPath = ""
switch ($choice) {
    "1" { $searchPath = [Environment]::GetFolderPath("Desktop") }
    "2" { $searchPath = [Environment]::GetFolderPath("UserProfile") + "\Downloads" }
    "3" { 
        $searchPath = Read-Host "Entrez le chemin complet du dossier contenant vos fichiers"
    }
}

Write-Host ""
Write-Host "Dossiers cibles crees:" -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$baseDir\games" -Force | Out-Null
New-Item -ItemType Directory -Path "$baseDir\projects" -Force | Out-Null
New-Item -ItemType Directory -Path "$baseDir\skills" -Force | Out-Null
New-Item -ItemType Directory -Path "$baseDir\experiences" -Force | Out-Null
Write-Host "  $baseDir\games" -ForegroundColor Gray
Write-Host "  $baseDir\projects" -ForegroundColor Gray
Write-Host "  $baseDir\skills" -ForegroundColor Gray
Write-Host "  $baseDir\experiences" -ForegroundColor Gray
Write-Host ""

# Chercher et copier automatiquement si possible
Write-Host "Recherche et copie automatique..." -ForegroundColor Yellow
Write-Host ""

if ($searchPath -and (Test-Path $searchPath)) {
    $files = Get-ChildItem $searchPath -Recurse -Include "*.jpg","*.jpeg","*.png","*.JPG","*.JPEG","*.PNG","*.mp4","*.MP4" -File -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        $name = $file.Name.ToLower()
        
        # Mapping des fichiers
        if ($name -like "*jeux*" -and $name -like "*.jpg") {
            if ($name -match "jeux\s*2\.1") {
                Copy-MediaFile $file.FullName "$baseDir\games\Jeux 2.1.JPG" "Jeux 2.1.JPG"
            } elseif ($name -match "jeux\s*2\.2") {
                Copy-MediaFile $file.FullName "$baseDir\games\Jeux 2.2.JPG" "Jeux 2.2.JPG"
            } elseif ($name -match "jeux\s*2") {
                Copy-MediaFile $file.FullName "$baseDir\games\Jeux 2.JPG" "Jeux 2.JPG"
            } elseif ($name -match "jeux\s*3") {
                Copy-MediaFile $file.FullName "$baseDir\games\Jeux 3.JPG" "Jeux 3.JPG"
            } else {
                Copy-MediaFile $file.FullName "$baseDir\games\Jeux.JPG" "Jeux.JPG"
            }
        }
        elseif ($name -like "*cv*anglais*" -or $name -like "*cvanglais*") {
            Copy-MediaFile $file.FullName "$baseDir\skills\Cvanglais.mp4" "CV anglais video"
        }
        elseif ($name -like "*picture*" -or $name -like "*profil*" -or $name -like "*photo*") {
            Copy-MediaFile $file.FullName "$baseDir\experiences\picture.jpeg" "Photo de profil"
        }
        elseif ($name -like "*phylo*" -or $name -like "*arbre*") {
            Copy-MediaFile $file.FullName "$baseDir\projects\phylogenetic-tree.mp4" "Video projet phylogenetique"
        }
        elseif ($name -like "*mediatheque*" -or $name -like "*media*") {
            Copy-MediaFile $file.FullName "$baseDir\projects\mediatheque.mp4" "Video projet mediatheque"
        }
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  ETAT FINAL" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verification finale
$required = @(
    @{Path="$baseDir\experiences\picture.jpeg"; Desc="Photo de profil"},
    @{Path="$baseDir\skills\Cvanglais.mp4"; Desc="Video CV anglais"},
    @{Path="$baseDir\games\Jeux.JPG"; Desc="Jeu 1 thumbnail"},
    @{Path="$baseDir\games\Jeux 2.JPG"; Desc="Jeu 2 thumbnail"},
    @{Path="$baseDir\games\Jeux 3.JPG"; Desc="Jeu 3 thumbnail"},
    @{Path="$baseDir\projects\phylogenetic-tree.mp4"; Desc="Video projet 1"},
    @{Path="$baseDir\projects\mediatheque.mp4"; Desc="Video projet 2"}
)

$found = 0
$missing = 0

foreach ($item in $required) {
    if (Test-Path $item.Path) {
        $size = (Get-Item $item.Path).Length / 1MB
        Write-Host "  OK  $($item.Desc) ($("{0:N2}" -f $size) MB)" -ForegroundColor Green
        $found++
    } else {
        Write-Host "  X   $($item.Desc) - MANQUANT" -ForegroundColor Red
        Write-Host "      Copiez votre fichier vers: $($item.Path)" -ForegroundColor Gray
        $missing++
    }
}

Write-Host ""
Write-Host "Resultat: $found/$($required.Count) fichiers presents" -ForegroundColor $(if($missing -eq 0){"Green"}else{"Yellow"})
Write-Host ""

if ($missing -eq 0) {
    Write-Host "Tous les fichiers sont en place!" -ForegroundColor Green
    Write-Host "Votre site devrait maintenant afficher toutes les images et videos." -ForegroundColor Green
} else {
    Write-Host "Copiez manuellement les fichiers manquants dans les dossiers indiques." -ForegroundColor Yellow
    Write-Host "Ils seront accessibles via http://localhost:8000/storage/..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir le dossier storage..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
explorer "$baseDir"
