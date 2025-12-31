<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            // Frontend
            ['name' => 'React', 'category' => 'frontend', 'level' => 85, 'years_experience' => 2, 'featured' => true, 'order' => 1],
            ['name' => 'JavaScript', 'category' => 'frontend', 'level' => 90, 'years_experience' => 3, 'featured' => true, 'order' => 2],
            ['name' => 'HTML/CSS', 'category' => 'frontend', 'level' => 95, 'years_experience' => 4, 'featured' => true, 'order' => 3],
            ['name' => 'Vue.js', 'category' => 'frontend', 'level' => 75, 'years_experience' => 1, 'featured' => false, 'order' => 4],
            ['name' => 'TypeScript', 'category' => 'frontend', 'level' => 80, 'years_experience' => 2, 'featured' => true, 'order' => 5],
            ['name' => 'Vite', 'category' => 'frontend', 'level' => 85, 'years_experience' => 1, 'featured' => false, 'order' => 6],
            
            // Backend
            ['name' => 'PHP', 'category' => 'backend', 'level' => 85, 'years_experience' => 3, 'featured' => true, 'order' => 7],
            ['name' => 'Laravel', 'category' => 'backend', 'level' => 90, 'years_experience' => 2, 'featured' => true, 'order' => 8],
            ['name' => 'Node.js', 'category' => 'backend', 'level' => 80, 'years_experience' => 2, 'featured' => true, 'order' => 9],
            ['name' => 'Python', 'category' => 'backend', 'level' => 75, 'years_experience' => 2, 'featured' => false, 'order' => 10],
            ['name' => 'C', 'category' => 'backend', 'level' => 80, 'years_experience' => 2, 'featured' => true, 'order' => 11],
            ['name' => 'C++', 'category' => 'backend', 'level' => 70, 'years_experience' => 1, 'featured' => false, 'order' => 12],
            ['name' => 'Java', 'category' => 'backend', 'level' => 75, 'years_experience' => 2, 'featured' => false, 'order' => 13],
            
            // Database
            ['name' => 'MySQL', 'category' => 'database', 'level' => 85, 'years_experience' => 3, 'featured' => true, 'order' => 14],
            
            // DevOps
            ['name' => 'Docker', 'category' => 'devops', 'level' => 75, 'years_experience' => 1, 'featured' => true, 'order' => 17],
            ['name' => 'Git', 'category' => 'devops', 'level' => 90, 'years_experience' => 3, 'featured' => true, 'order' => 18],
            ['name' => 'GitHub Actions', 'category' => 'devops', 'level' => 70, 'years_experience' => 1, 'featured' => false, 'order' => 19],
            ['name' => 'Linux', 'category' => 'devops', 'level' => 75, 'years_experience' => 2, 'featured' => false, 'order' => 20],
            
            // Design & Montage
            ['name' => 'Photoshop', 'category' => 'design', 'level' => 80, 'years_experience' => 3, 'featured' => true, 'order' => 21],
            ['name' => 'Canva', 'category' => 'design', 'level' => 85, 'years_experience' => 3, 'featured' => true, 'order' => 22],
            ['name' => 'Écriture', 'category' => 'design', 'level' => 90, 'years_experience' => 4, 'featured' => true, 'order' => 23],
            ['name' => 'Premiere Pro', 'category' => 'montage', 'level' => 85, 'years_experience' => 3, 'featured' => true, 'order' => 24],
            ['name' => 'After Effects', 'category' => 'montage', 'level' => 80, 'years_experience' => 2, 'featured' => true, 'order' => 25],
            
            // Game Development
            ['name' => 'Unity', 'category' => 'gamedev', 'level' => 75, 'years_experience' => 2, 'featured' => true, 'order' => 27],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
