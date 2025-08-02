<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['titre', 'description', 'état', 'deadline', 'project_id', 'assigned_to'];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    // Cette ligne est déjà correcte, elle charge les commentaires ET l'utilisateur assigné.
    protected $with = ['comments', 'assignedUser'];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'état' => 'à faire',
    ];

    /**
     * Get the project that the task belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the user assigned to the task.
     * C'est la relation qui correspond à 'assignedUser' dans le tableau $with.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the comments for the task.
     */
    public function comments(): HasMany
    {
        // On charge aussi l'auteur de chaque commentaire et on les trie par date la plus récente
        return $this->hasMany(Comment::class)->with('auteur')->latest();
    }
}