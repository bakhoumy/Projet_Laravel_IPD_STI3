<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User; // Assurez-vous que le modèle User est bien importé
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Affiche la liste des projets avec des données enrichies.
     * Cette méthode est sécurisée et optimisée pour retourner les données
     * nécessaires au tableau de bord.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // On vérifie si l'utilisateur est un administrateur via la Gate 'view-all-data'.
        if (Gate::allows('view-all-data')) {
            // Pour l'admin, on construit une requête sur tous les projets.
            $query = Project::query();
        } else {
            // Pour un utilisateur standard, on utilise une méthode plus robuste pour éviter les ambiguïtés.
            // 1. On récupère l'ID de l'utilisateur authentifié.
            $userId = Auth::id();
            // 2. On trouve l'instance complète du modèle User correspondant à cet ID.
            $user = User::find($userId);
            
            // 3. On appelle la méthode de relation 'projects()' sur l'instance Eloquent.
            // C'est la garantie que la méthode existe et qu'on obtient un Query Builder.
            $query = $user->projects();
        }

        // On enrichit la requête (que ce soit celle de l'admin ou de l'utilisateur)
        // avec les comptes de tâches.
        $projects = $query->withCount([
            'tasks', // Crée un champ 'tasks_count'
            'tasks as completed_tasks_count' => function ($query) {
                // Crée un champ personnalisé 'completed_tasks_count'
                $query->where('état', 'terminé');
            }
        ])->get();

        return response()->json($projects);
    }

    /**
     * Crée et enregistre un nouveau projet pour l'utilisateur authentifié.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::create([
            'nom' => $request->nom,
            'description' => $request->description,
            'owner_id' => Auth::id(),
        ]);

        return response()->json($project, 201);
    }

    /**
     * Affiche les détails d'un projet spécifique.
     * L'accès est contrôlé par la Gate 'view-all-data' ou la propriété du projet.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project)
    {
        if (Gate::denies('view-all-data') && Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        return response()->json($project);
    }

    /**
     * Met à jour un projet spécifique.
     * L'accès est contrôlé par la Gate 'view-all-data' ou la propriété du projet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Project $project)
    {
        if (Gate::denies('view-all-data') && Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $project->update($request->all());
        
        return response()->json($project);
    }

    /**
     * Supprime un projet de la base de données.
     * L'accès est contrôlé par la Gate 'view-all-data' ou la propriété du projet.
     *
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project)
    {
        if (Gate::denies('view-all-data') && Auth::id() !== $project->owner_id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $project->delete();
        
        return response()->noContent();
    }
}