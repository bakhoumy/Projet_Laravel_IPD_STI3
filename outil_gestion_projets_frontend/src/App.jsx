import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Ce composant sert maintenant de layout pour les routes publiques
  // (connexion, inscription) qui ne doivent pas avoir de barre de navigation latérale.
  // L' <Outlet /> affichera soit LoginPage, soit RegisterPage, etc.
  
  // On garde le ToastContainer ici pour que les notifications
  // puissent s'afficher sur toutes les pages, y compris la page de connexion.
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Outlet />
    </>
  );
}

export default App;