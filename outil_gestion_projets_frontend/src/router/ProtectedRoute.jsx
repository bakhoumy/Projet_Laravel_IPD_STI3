// src/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  // On récupère le token ET l'état de chargement
  const { token, loading } = useAuth(); 

  // 1. Si on est en train de vérifier l'état d'authentification, on attend
  if (loading) {
    return <div>Chargement de la session...</div>; // Ou un composant de spinner
  }

  // 2. Une fois le chargement terminé, on peut vérifier le token
  if (!token) {
    // Si pas de token, on redirige vers la page de connexion
    return <Navigate to="/login" />;
  }

  // Si tout est bon, on affiche la page protégée
  return children;
};

export default ProtectedRoute;