const { spawn } = require('child_process');
const path = require('path');

// Chemin vers le dossier dilemme-prisonnier
const dilemmePath = path.join(__dirname, '..', 'backend', 'public', 'dilemme-prisonnier');

console.log('🎮 Démarrage du serveur Dilemme du Prisonnier sur http://localhost:8001...');

// Démarrer le serveur PHP pour le jeu
const serverProcess = spawn('php', ['-S', 'localhost:8001', '-t', dilemmePath], {
  shell: true,
  detached: false,
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('❌ Erreur lors du démarrage du serveur Dilemme:', error);
});

// Nettoyer le processus à la fermeture
process.on('exit', () => {
  serverProcess.kill();
});

process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  serverProcess.kill();
  process.exit();
});
