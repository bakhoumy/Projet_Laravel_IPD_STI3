import { createBrowserRouter } from "react-router-dom";

// --- Layouts ---
import App from "../App";
import ProtectedLayout from "../layouts/ProtectedLayout";

// --- Gardes de Route ---
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// --- Pages ---
// On importe toutes nos pages, y compris la nouvelle page d'édition
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import MyProjectsPage from "../pages/MyProjectsPage";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminStatsPage from "../pages/AdminStatsPage";
import AdminEditUserPage from "../pages/AdminEditUserPage"; // <-- Nouvelle page d'édition
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import MyTasksPage from '../pages/MyTasksPage';

const router = createBrowserRouter([
  // === GROUPE 1: ROUTES PUBLIQUES (NON PROTÉGÉES) ===
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ]
  },
  
  // === GROUPE 2: ROUTES PROTÉGÉES ===
  // Utilise le layout avec le Sidebar pour une expérience connectée
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ProtectedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Page d'accueil par défaut pour les utilisateurs connectés
        element: <DashboardPage />,
      },

     {
        path: "mytasks",
        element: <MyTasksPage />,
      },
      // --- Section Projets ---
      {
        path: "projects",
        element: <MyProjectsPage />,
      },
      {
        path: "projects/create",
        element: <CreateProjectPage />
      },
      {
        path: "projects/:projectId",
        element: <ProjectDetailPage />,
      },
      // --- Section Administration (chaque route est protégée par AdminRoute) ---
      {
        path: "admin/users",
        element: (
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        ),
      },
      {
        // === LA NOUVELLE ROUTE POUR L'ÉDITION D'UTILISATEUR ===
        // Elle est dynamique et prend l'ID de l'utilisateur en paramètre
        path: "admin/users/:userId/edit",
        element: (
          <AdminRoute>
            <AdminEditUserPage />
          </AdminRoute>
        ),
      },
      {
        path: "admin/stats",
        element: (
          <AdminRoute>
            <AdminStatsPage />
          </AdminRoute>
        ),
      },
      // --- Section Utilisateur ---
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ]
  }
]);

export default router;