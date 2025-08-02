<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Gère l'inscription d'un nouvel utilisateur.
     */
    public function register(Request $request)
    {
        // 1. Validation des données reçues
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Création de l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // Le rôle est 'utilisateur' par défaut grâce à notre migration
        ]);

        // 3. Retourner une réponse de succès
        return response()->json([
            'message' => 'Inscription réussie !',
            'user' => $user
        ], 201);
    }

    /**
     * Gère la connexion d'un utilisateur.
     */
    public function login(Request $request)
    {
        // 1. Validation des données
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Tentative de connexion
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Les identifiants fournis sont incorrects.'
            ], 401); // 401 Unauthorized
        }

        // 3. Récupération de l'utilisateur et création du token
        $user = User::where('email', $request->email)->firstOrFail();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Retourner la réponse avec le token
        return response()->json([
            'message' => 'Connexion réussie !',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Gère la déconnexion d'un utilisateur.
     */
    public function logout(Request $request)
    {
        // Révoque le token d'API actuel de l'utilisateur
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}