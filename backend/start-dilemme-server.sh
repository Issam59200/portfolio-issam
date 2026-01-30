#!/bin/bash

# Script pour démarrer automatiquement le serveur du Dilemme du Prisonnier
# Ce script est appelé automatiquement au démarrage de Laravel

DILEMME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/public/dilemme-prisonnier"

# Vérifier si le dossier existe
if [ -d "$DILEMME_DIR" ]; then
    echo "Démarrage du serveur Dilemme du Prisonnier..."
    
    # Démarrer un serveur HTTP simple pour le jeu
    cd "$DILEMME_DIR"
    
    # Utiliser PHP built-in server sur un port différent
    php -S localhost:8001 > /dev/null 2>&1 &
    
    # Sauvegarder le PID pour pouvoir arrêter le serveur plus tard
    echo $! > /tmp/dilemme-server.pid
    
    echo "Serveur Dilemme du Prisonnier démarré sur http://localhost:8001"
else
    echo "Dossier du Dilemme du Prisonnier non trouvé"
fi
