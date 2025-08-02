<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate; // <-- 1. IMPORTER GATE
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Affiche la liste des tâches pour un projet donné.
     * Un admin peut lister les tâches de n'importe quel projet.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $project = Project::find($request->project_id);

        // 2. MODIFIER LA VÉRIFICATION DES DROITS
        if (Gate::denies('view-all-data') && Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé à ce projet.'], 403);
        }

        return response()->json($project->tasks);
    }

    /**
     * Crée une nouvelle tâche.
     * Un admin peut créer une tâche dans n'importe quel projet.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $project = Project::find($request->project_id);

        // 2. MODIFIER LA VÉRIFICATION DES DROITS
        if (Gate::denies('view-all-data') && Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'Vous ne pouvez pas ajouter de tâche à ce projet.'], 403);
        }
        
        $task = Task::create($request->all());

        return response()->json($task, 201);
    }

    /**
     * Affiche les détails d'une tâche spécifique.
     * Un admin peut voir n'importe quelle tâche.
     */
    public function show(Task $task)
    {
        // 2. MODIFIER LA VÉRIFICATION DES DROITS (en passant par le projet parent)
        if (Gate::denies('view-all-data') && Auth::id() !== $task->project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        return response()->json($task->load('assignedUser'));
    }

    /**
     * Met à jour une tâche.
     * Un admin peut mettre à jour n'importe quelle tâche.
     */
    public function update(Request $request, Task $task)
    {
        // 2. MODIFIER LA VÉRIFICATION DES DROITS
        if (Gate::denies('view-all-data') && Auth::id() !== $task->project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'état' => 'sometimes|string|in:à faire,en cours,terminé',
            'deadline' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $task->update($request->all());

        return response()->json($task);
    }

    /**
     * Supprime une tâche.
     * Un admin peut supprimer n'importe quelle tâche.
     */
    public function destroy(Task $task)
    {
        // 2. MODIFIER LA VÉRIFICATION DES DROITS
        if (Gate::denies('view-all-data') && Auth::id() !== $task->project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $task->delete();

        return response()->noContent();
    }

    public function myTasks()
    {
        $userId = Auth::id();

        // On récupère les tâches où 'assigned_to' correspond à l'ID de l'utilisateur
        // On charge aussi les relations nécessaires pour l'affichage :
        // - le projet auquel la tâche appartient
        // - les commentaires, avec leurs auteurs
        $tasks = Task::where('assigned_to', $userId)
                     ->with(['project', 'comments.auteur'])
                     ->latest() // Trie par les plus récentes
                     ->get();

        return response()->json($tasks);
    }
}