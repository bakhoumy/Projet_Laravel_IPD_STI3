import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

// Une petite fonction utilitaire pour obtenir les initiales
const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const AdminUsersPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Utilisation de setLoading
            setError(null);   // Utilisation de setError
            try {
                const response = await apiClient.get('/api/admin/users');
                setUsers(response.data);
            } catch (err) {
                console.error("Erreur de récupération des utilisateurs:", err);
                setError("Impossible de charger la liste des utilisateurs."); // Utilisation de setError
                toast.error("Impossible de charger la liste des utilisateurs.");
            } finally {
                setLoading(false); // Utilisation de setLoading
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const paginatedUsers = useMemo(() => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    }, [filteredUsers, currentPage, usersPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
            try {
                await apiClient.delete(`/api/admin/users/${userId}`);
                setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
                toast.success(`L'utilisateur "${userName}" a été supprimé.`);
            } catch (err) {
                console.error("Erreur de suppression:", err);
                toast.error(err.response?.data?.message || "Erreur lors de la suppression.");
            }
        }
    };

    if (error) { // Le JSX utilise maintenant la variable 'error'
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">Gestion des Utilisateurs</h1>
                    <p className="text-muted">Gérez les membres de votre espace de travail.</p>
                </div>
                {/* Note: Ce lien mène à une page que nous n'avons pas encore créée. */}
                {/* <Link to="/admin/users/create" className="btn btn-primary fw-bold">... </Link> */}
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center p-3">
                    <div className="input-group" style={{ maxWidth: '400px' }}>
                         <span className="input-group-text"><i className="bi bi-search"></i></span>
                         <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Utilisateur</th>
                                    <th>Rôle</th>
                                    <th className="text-center">Projets Créés</th>
                                    <th className="text-center">Tâches Assignées</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></td></tr>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map(user => (
                                        <tr key={user.id} className="align-middle">
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    {/* Je recommande de déplacer le style de l'avatar dans index.css */}
                                                    <div className="user-avatar me-3">{getInitials(user.name)}</div>
                                                    <div>
                                                        <div className="fw-bold">{user.name}</div>
                                                        <div className="text-muted small">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {user.role === 'administrateur' ? (
                                                    <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Admin</span>
                                                ) : (
                                                    <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">Utilisateur</span>
                                                )}
                                            </td>
                                            <td className="text-center">{user.projects_count}</td>
                                            <td className="text-center">{user.tasks_count}</td>
                                            <td className="text-center">
                                                <div className="dropdown">
                                                    <button className="btn btn-sm btn-link text-secondary" type="button" data-bs-toggle="dropdown" disabled={currentUser.id === user.id}>
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                        <li><Link className="dropdown-item" to={`/admin/users/${user.id}/edit`}>Modifier</Link></li>
                                                        <li><button className="dropdown-item text-danger" onClick={() => handleDeleteUser(user.id, user.name)}>Supprimer</button></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="text-center p-5"><p className="text-muted mb-0">Aucun utilisateur trouvé.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-light d-flex justify-content-end">
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                {[...Array(totalPages).keys()].map(number => (
                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                        <button onClick={() => setCurrentPage(number + 1)} className="page-link">
                                            {number + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;