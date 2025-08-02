<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

// Importation de tous nos contrôleurs
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProfileController; // <-- LA LIGNE MANQUANTE EST ICI

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques (Authentification)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Groupe de routes protégées qui nécessitent une authentification Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Route pour récupérer les informations de l'utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Routes CRUD pour les projets
    Route::apiResource('projects', ProjectController::class);

    // Routes CRUD pour les tâches
    Route::apiResource('tasks', TaskController::class);
    Route::get('/mytasks', [TaskController::class, 'myTasks']);

    // Route pour poster un commentaire sur une tâche
    Route::post('tasks/{task}/comments', [CommentController::class, 'store']);

    // Route pour lister les utilisateurs (pour l'assignation)
    Route::get('/users', function () {
        return User::all(['id', 'name']);
    });
    
    // --- Routes d'Administration ---
    Route::apiResource('admin/users', UserController::class)->except(['store']);
    Route::get('/admin/stats', [UserController::class, 'stats']);
    
    // --- Routes pour la gestion du profil ---
    // Ces routes utilisent maintenant le ProfileController importé
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
});