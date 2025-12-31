<?php

namespace Database\Seeders;

use App\Models\YouTubeVideo;
use Illuminate\Database\Seeder;

class YouTubeVideoSeeder extends Seeder
{
    public function run(): void
    {
        $videos = [
            [
                'title' => 'Les fakes news ont changé le monde',
                'description' => 'Une analyse approfondie de l\'impact des fake news sur notre société moderne. Comment la désinformation a transformé notre perception de la réalité et influencé les événements majeurs de ces dernières années.',
                'video_id' => 'odb8rPl6JTE',
                'video_url' => 'https://www.youtube.com/watch?v=odb8rPl6JTE',
                'thumbnail' => 'storage/youtube/fake-news.jpg',
                'category' => 'essay',
                'published_at' => '2024-10-15',
                'views' => 0,
                'likes' => 0,
                'featured' => true,
                'order' => 1,
                'tags' => ['Fake News', 'Société', 'Médias', 'Information'],
            ],
            [
                'title' => 'Pourquoi l\'IA ne sera JAMAIS un artiste ?',
                'description' => 'Exploration philosophique et technique des limites de l\'intelligence artificielle dans le domaine de la création artistique. Analyse de ce qui différencie fondamentalement la créativité humaine de la génération algorithmique.',
                'video_id' => 'BzDudVVE9k8',
                'video_url' => 'https://www.youtube.com/watch?v=BzDudVVE9k8',
                'thumbnail' => 'storage/youtube/ia-artiste.jpg',
                'category' => 'essay',
                'published_at' => '2024-11-02',
                'views' => 0,
                'likes' => 0,
                'featured' => true,
                'order' => 2,
                'tags' => ['IA', 'Art', 'Intelligence Artificielle', 'Créativité', 'Philosophie'],
            ],
            [
                'title' => 'L\'IA détruit le jeux vidéo ?',
                'description' => 'Analyse critique de l\'impact de l\'intelligence artificielle sur l\'industrie du jeu vidéo. Entre opportunités de gameplay innovant et risques de standardisation, où se situe vraiment l\'IA dans le futur du gaming ?',
                'video_id' => 'gnD2mqq52gk',
                'video_url' => 'https://www.youtube.com/watch?v=gnD2mqq52gk',
                'thumbnail' => 'storage/youtube/ia-gaming.jpg',
                'category' => 'essay',
                'published_at' => '2024-11-20',
                'views' => 0,
                'likes' => 0,
                'featured' => true,
                'order' => 3,
                'tags' => ['IA', 'Jeux Vidéo', 'Gaming', 'Industrie', 'Technologie'],
            ],
        ];

        foreach ($videos as $video) {
            YouTubeVideo::create($video);
        }
    }
}
