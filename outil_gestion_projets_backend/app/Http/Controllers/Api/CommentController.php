<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        // === LA NOUVELLE RÈGLE DE SÉCURITÉ, PLUS COMPLÈTE ===
        // On vérifie si l'une des conditions suivantes est VRAIE. Si aucune ne l'est, on refuse l'accès.
        $is_admin = Gate::allows('view-all-data');
        $is_project_owner = Auth::id() === $task->project->owner_id;
        $is_task_assignee = Auth::id() === $task->assigned_to;

        if (!$is_admin && !$is_project_owner && !$is_task_assignee) {
            return response()->json(['message' => 'Accès non autorisé pour commenter cette tâche.'], 403);
        }
        // ======================================================

        $validator = Validator::make($request->all(), [
            'texte' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $comment = Comment::create([
            'texte' => $request->texte,
            'task_id' => $task->id,
            'auteur_id' => Auth::id(),
        ]);

        $comment->load('auteur');

        return response()->json($comment, 201);
    }
}