# Dossier Public Storage

Placez ici vos fichiers médias :

- **projects/** : Images/vidéos de vos projets
- **games/** : Images de vos jeux (Jeux.JPG, Jeux2.JPG, Jeux2.2.JPG, Jeux3.JPG)
- **youtube/** : Miniatures de vos vidéos YouTube
- **skills/** : Icônes/illustrations de compétences
- **experiences/** : Logos d'entreprises, certificats

## Lien symbolique

N'oubliez pas de créer le lien symbolique :
```bash
php artisan storage:link
```

Les fichiers seront accessibles via : `http://127.0.0.1:8000/storage/...`
