<?php

namespace App\Providers;

// Importation de la façade Gate pour définir nos règles d'autorisation
use Illuminate\Support\Facades\Gate;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * Cette méthode est l'endroit idéal pour définir toutes les "portes" (Gates)
     * d'autorisation de votre application.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // === NOTRE RÈGLE D'ADMINISTRATEUR ===
        // On définit une "porte" nommée 'view-all-data'.
        // Elle reçoit l'utilisateur actuellement authentifié ($user) en argument.
        // La porte s'ouvre (retourne true) si la condition est remplie.
        Gate::define('view-all-data', function ($user) {
            // La condition est simple : le rôle de l'utilisateur est-il 'administrateur' ?
            return $user->role === 'administrateur';
        });

        // Vous pourriez ajouter d'autres Gates ici pour des permissions plus fines, par exemple :
        // Gate::define('delete-project', function ($user, $project) {
        //     return $user->role === 'administrateur' || $user->id === $project->owner_id;
        // });
    }
}