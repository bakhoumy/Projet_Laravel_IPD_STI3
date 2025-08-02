<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project; // Importation essentielle pour la méthode stats()
use App\Models\Task;    // Importation essentielle pour la méthode stats()
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /** 
     * Affiche la liste des utilisateurs avec le compte de leurs projets et tâches. 
     * Accessible uniquement aux administrateurs. 
     */
    public function index()
    {
        if (Gate::denies('view-all-data')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // On enrichit la requête pour compter les projets créés ET les tâches assignées
        $users = User::withCount(['tasks', 'projects'])->get();

        return response()->json($users);
    }

    /** 
     * Affiche un utilisateur spécifique. 
     * Accessible uniquement aux administrateurs. 
     */
    public function show(User $user)
    {
        if (Gate::denies('view-all-data')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        return response()->json($user);
    }

    /** 
     * Met à jour les informations d'un utilisateur. 
     * Accessible uniquement aux administrateurs. 
     */
    public function update(Request $request, User $user)
    {
        if (Gate::denies('view-all-data')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // L'email doit être unique, mais on doit ignorer l'ID de l'utilisateur actuel lors de la vérification
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(['utilisateur', 'administrateur'])],
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    /** 
     * Supprime un utilisateur de la base de données. 
     * Accessible uniquement aux administrateurs. 
     */
    public function destroy(User $user)
    {
        if (Gate::denies('view-all-data')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // Sécurité cruciale : un admin ne doit pas pouvoir supprimer son propre compte.
        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();
        return response()->noContent();
    }
    
    /**
     * Calcule et renvoie des statistiques globales pour l'administration.
     * Accessible uniquement aux administrateurs.
     */
    public function stats()
    {
        if (Gate::denies('view-all-data')) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        // Calculs des statistiques
        $totalProjects = Project::count();
        $totalTasks = Task::count();
        $completedTasks = Task::where('état', 'terminé')->count();
        $totalUsers = User::count();


        // On gère le cas où il n'y a aucune tâche pour éviter une division par zéro.
        $completionPercentage = ($totalTasks > 0) ? ($completedTasks / $totalTasks) * 100 : 0;

        // On retourne les données formatées en JSON
        return response()->json([
            'total_projects' => $totalProjects,
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedTasks,
            'completion_percentage' => round($completionPercentage, 2), // Arrondi à 2 décimales
            'total_users' => $totalUsers, // <-- ON AJOUTE LA CLÉ ICI

        ]);
    }
}