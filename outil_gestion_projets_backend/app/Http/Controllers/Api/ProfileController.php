<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- 1. S'ASSURER QUE LE MODÈLE EST IMPORTÉ
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Met à jour les informations du profil de l'utilisateur authentifié.
     */
    public function updateProfile(Request $request)
    {
        // 2. CORRECTION : On récupère l'instance complète du modèle User
        $user = User::findOrFail(Auth::id());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated); // Maintenant, l'update est appelé sur un vrai modèle Eloquent

        return response()->json($user);
    }

    /**
     * Met à jour le mot de passe de l'utilisateur authentifié.
     */
    public function updatePassword(Request $request)
    {
        // 3. CORRECTION : On fait de même ici
        $user = User::findOrFail(Auth::id());

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}