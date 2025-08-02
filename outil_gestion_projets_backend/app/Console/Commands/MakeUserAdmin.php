<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeUserAdmin extends Command
{
    /**
     * La signature de la commande. On attend l'email de l'utilisateur.
     * @var string
     */
    protected $signature = 'app:make-user-admin {email}';

    /**
     * La description de la commande.
     * @var string
     */
    protected $description = 'Promouvoir un utilisateur au rang d\'administrateur';

    /**
     * Exécute la commande.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("L'utilisateur avec l'email {$email} n'a pas été trouvé.");
            return 1; // Retourne un code d'erreur
        }

        $user->role = 'administrateur';
        $user->save();

        $this->info("L'utilisateur {$user->name} ({$email}) est maintenant un administrateur !");
        return 0; // Retourne un code de succès
    }
}