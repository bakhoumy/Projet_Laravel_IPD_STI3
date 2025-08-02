import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Les informations sur l'utilisateur et son token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Le nouvel état qui va résoudre notre problème de redirection.
  // Il est 'true' par défaut, le temps que l'on vérifie l'état initial.
  const [loading, setLoading] = useState(true);

  // Ce 'useEffect' ne s'exécute qu'une seule fois au tout premier chargement de l'application.
  // Son rôle est de vérifier si une session existe déjà dans le localStorage.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
        // Si on trouve une session, on met à jour notre état React.
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
    }
    
    // Qu'on ait trouvé une session ou non, la vérification est terminée.
    // On passe donc 'loading' à 'false'.
    setLoading(false); 
  }, []); // Le tableau de dépendances vide [] garantit que cet effet ne s'exécute qu'une fois.

  // Fonction appelée par la page de connexion après un succès
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Fonction appelée par le bouton de déconnexion
  const logout = async () => {
    if (token) {
        try {
            await apiClient.post('/api/logout');
        } catch (error) {
            console.error("Erreur lors de la déconnexion sur le serveur:", error);
        }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // On rend disponible toutes nos variables d'état et nos fonctions à nos composants enfants.
  // Il est crucial d'inclure 'loading' ici.
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Le custom hook pour accéder facilement au contexte depuis n'importe quel composant.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};