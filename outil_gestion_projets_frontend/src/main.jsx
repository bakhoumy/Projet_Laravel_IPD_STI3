import React from 'react';
import ReactDOM from 'react-dom/client';

// === IMPORTATIONS CSS GLOBALES ===
// 1. On importe le CSS de Bootstrap en premier.
//    Ceci fournit toutes les classes utilitaires (d-flex, p-3, btn, card, etc.) à toute l'application.
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. On importe le CSS de Bootstrap Icons.
//    Ceci rend disponibles les icônes (comme bi-speedometer2) via des classes.
import 'bootstrap-icons/font/bootstrap-icons.css';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// 3. On importe notre propre CSS global en dernier.
//    Cela nous permet de surcharger les styles de Bootstrap si nous en avons besoin.
import './index.css'; 

// === IMPORTATIONS DE L'APPLICATION ===
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Notre configuration de routes
import { AuthProvider } from './contexts/AuthContext'; // Notre gestionnaire de session

// Le rendu de l'application dans le DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode est un outil de développement qui aide à détecter les problèmes potentiels.
  <React.StrictMode>
    {/* AuthProvider enveloppe tout pour que les informations de connexion
        soient disponibles partout. */}
    <AuthProvider>
      {/* RouterProvider prend notre configuration de routes et gère
          l'affichage de la bonne page en fonction de l'URL. */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);