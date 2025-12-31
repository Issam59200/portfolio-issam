<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\YouTubeVideoController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\FormationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Healthcheck
Route::get('/ping', fn () => response()->json(['message' => 'Backend Ready 🚀']));

// Authentication Routes (Public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});

// Projects Routes (Public read, Protected write)
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/featured', [ProjectController::class, 'featured']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);

// Protected project routes (admin only)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
});

// Contact Routes
Route::post('/contact', [ContactController::class, 'store']); // Public

// Protected contact routes (admin only)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::put('/contacts/{contact}/read', [ContactController::class, 'markAsRead']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
});

// Skills Routes (Public read, Protected write)
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/skills/categories', [SkillController::class, 'categories']);
Route::get('/skills/category/{category}', [SkillController::class, 'byCategory']);
Route::get('/skills/{skill}', [SkillController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{skill}', [SkillController::class, 'update']);
    Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);
});

// Games Routes (Public read, Protected write)
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{game}', [GameController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/games', [GameController::class, 'store']);
    Route::put('/games/{game}', [GameController::class, 'update']);
    Route::delete('/games/{game}', [GameController::class, 'destroy']);
});

// YouTube Videos Routes (Public read, Protected write)
Route::get('/youtube-videos', [YouTubeVideoController::class, 'index']);
Route::get('/youtube-videos/{video}', [YouTubeVideoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/youtube-videos', [YouTubeVideoController::class, 'store']);
    Route::put('/youtube-videos/{video}', [YouTubeVideoController::class, 'update']);
    Route::delete('/youtube-videos/{video}', [YouTubeVideoController::class, 'destroy']);
});

// Experiences Routes (Public read, Protected write)
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/experiences/{experience}', [ExperienceController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/experiences', [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}', [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy']);
});

// Formations Routes (Public read, Protected write)
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{formation}', [FormationController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put('/formations/{formation}', [FormationController::class, 'update']);
    Route::delete('/formations/{formation}', [FormationController::class, 'destroy']);
});


