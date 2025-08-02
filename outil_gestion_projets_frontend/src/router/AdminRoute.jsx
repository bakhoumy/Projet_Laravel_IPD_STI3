// src/router/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  // On récupère les informations de l'utilisateur depuis notre contexte
  const { user } = useAuth();

  // On vérifie deux choses :
  // 1. L'utilisateur est-il bien connecté (user existe) ?
  // 2. Son rôle est-il 'administrateur' ?
  if (user && user.role === 'administrateur') {
    // Si oui, on affiche la page demandée
    return children;
  }

  // Sinon, on le redirige vers la page d'accueil (le tableau de bord)
  // On pourrait aussi afficher une page "Accès Interdit" (403).
  return <Navigate to="/" />;
};

export default AdminRoute;