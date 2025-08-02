<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany; // Assurez-vous d'importer HasMany
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    // === LA MÉTHODE MANQUANTE EST ICI ===
    /**
     * Définit la relation "un utilisateur a plusieurs projets".
     * Le second argument 'owner_id' est la clé étrangère dans la table 'projects'.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    /**
     * Définit la relation "un utilisateur a plusieurs tâches qui lui sont assignées".
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * Définit la relation "un utilisateur a plusieurs commentaires".
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'auteur_id');
    }
}