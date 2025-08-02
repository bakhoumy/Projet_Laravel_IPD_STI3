import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css'; // S'assurer que le fichier Sidebar.css est importé

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // État pour la rotation de la flèche du menu admin
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    // Fonction pour gérer la déconnexion et la redirection
    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige l'utilisateur vers la page de connexion
    };

    // Classes pour les liens principaux
    const linkClasses = ({ isActive }) => 
        `nav-link text-white p-3 d-flex align-items-center ${isActive ? 'active' : ''}`;
    
    // Classes pour les sous-liens du menu admin
    const subLinkClasses = ({ isActive }) =>
        `nav-link text-white-50 p-2 ps-4 d-flex align-items-center sub-link ${isActive ? 'fw-bold text-white' : ''}`;

    return (
        <aside className="sidebar d-flex flex-column vh-100 flex-shrink-0 bg-dark text-white" style={{ width: '280px', position: 'fixed' }}>
            <Link to="/" className="d-flex align-items-center justify-content-center p-3 text-white text-decoration-none border-bottom border-secondary border-opacity-25">
                <i className="bi bi-kanban-fill fs-4 me-2 text-primary"></i>
                <span className="fs-5 fw-semibold">GestionProjets</span>
            </Link>
            
            <nav className="flex-grow-1 p-3">
                <ul className="nav nav-pills flex-column mb-auto">
                    {/* Liens du menu principal */}
                    <li className="nav-item mb-1">
                        <NavLink to="/" end className={linkClasses}>
                            <i className="bi bi-speedometer2 me-3 fs-5"></i> Tableau de Bord
                        </NavLink>
                    </li>
                    <li className="nav-item mb-1">
                        <NavLink to="/projects" className={linkClasses}>
                            <i className="bi bi-folder2-open me-3 fs-5"></i> Projets
                        </NavLink>
                    </li>
                    {/* === NOUVEAU LIEN AJOUTÉ ICI === */}
                    <li className="nav-item mb-1">
                        <NavLink to="/mytasks" className={linkClasses}>
                            <i className="bi bi-list-task me-3 fs-5"></i> Mes Tâches
                        </NavLink>
                    </li>
                    
                    {/* Menu d'administration conditionnel */}
                    {user && user.role === 'administrateur' && (
                        <li className="nav-item mt-3 border-top border-secondary border-opacity-25 pt-3">
                            <a 
                                href="#adminSubmenu" 
                                data-bs-toggle="collapse" 
                                className="nav-link text-white p-3 d-flex justify-content-between align-items-center"
                                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                aria-expanded={isAdminMenuOpen}
                                aria-controls="adminSubmenu"
                            >
                                <span><i className="bi bi-shield-lock-fill me-3 fs-5"></i> Administration</span>
                                <i className={`bi bi-chevron-down transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`}></i>
                            </a>
                            <div className="collapse" id="adminSubmenu">
                                <ul className="nav flex-column ps-3">
                                    <li><NavLink to="/admin/users" className={subLinkClasses}><i className="bi bi-people-fill me-3"></i> Utilisateurs</NavLink></li>
                                    <li><NavLink to="/admin/stats" className={subLinkClasses}><i className="bi bi-bar-chart-line-fill me-3"></i> Statistiques</NavLink></li>
                                </ul>
                            </div>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Profil utilisateur et menu déroulant en bas */}
            <div className="p-3 border-top border-secondary border-opacity-25">
                <div className="dropdown user-dropdown">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-person-circle fs-2 me-2"></i>
                        <div className="d-flex flex-column">
                            <strong className="d-block">{user?.name}</strong>
                            <small className="text-white-50 text-capitalize">{user?.role}</small>
                        </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                        <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person-fill me-2"></i> Mon Profil</Link></li>
                        <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear-fill me-2"></i> Paramètres</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button onClick={handleLogout} className="dropdown-item text-danger">
                                <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;