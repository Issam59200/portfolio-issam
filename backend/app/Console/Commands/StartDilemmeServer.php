<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class StartDilemmeServer extends Command
{
    protected $signature = 'dilemme:start';
    protected $description = 'Démarre le serveur du jeu Dilemme du Prisonnier';

    public function handle()
    {
        $dilemmePath = public_path('dilemme-prisonnier');
        
        if (!is_dir($dilemmePath)) {
            $this->error('Le dossier dilemme-prisonnier n\'existe pas dans public/');
            return 1;
        }

        $this->info('Démarrage du serveur Dilemme du Prisonnier...');
        
        // Démarrer le serveur PHP sur le port 8001
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows
            pclose(popen('start /B php -S localhost:8001 -t ' . escapeshellarg($dilemmePath), 'r'));
        } else {
            // Linux/Mac
            pclose(popen('php -S localhost:8001 -t ' . escapeshellarg($dilemmePath) . ' > /dev/null 2>&1 &', 'r'));
        }
        
        sleep(1);
        
        $this->info('✓ Serveur Dilemme du Prisonnier démarré sur http://localhost:8001');
        $this->info('Le jeu sera accessible via la page de détail du projet');
        
        return 0;
    }
}
