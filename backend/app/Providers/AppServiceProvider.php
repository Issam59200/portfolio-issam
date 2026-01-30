<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Démarrer automatiquement le serveur du Dilemme du Prisonnier
        // Seulement quand on lance php artisan serve
        if (php_sapi_name() === 'cli-server') {
            $this->startDilemmeServer();
        }
    }

    /**
     * Démarre le serveur du jeu Dilemme du Prisonnier
     */
    private function startDilemmeServer(): void
    {
        $dilemmePath = public_path('dilemme-prisonnier');
        
        if (!is_dir($dilemmePath)) {
            return;
        }

        // Vérifier si le serveur n'est pas déjà démarré
        $lockFile = storage_path('framework/dilemme-server.lock');
        if (file_exists($lockFile)) {
            return;
        }

        // Créer le fichier de verrou
        file_put_contents($lockFile, getmypid());

        // Démarrer le serveur sur le port 8001
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            pclose(popen('start /B php -S localhost:8001 -t "' . $dilemmePath . '"', 'r'));
        } else {
            pclose(popen('php -S localhost:8001 -t ' . escapeshellarg($dilemmePath) . ' > /dev/null 2>&1 &', 'r'));
        }
    }
}
