// src/pages/MyProjectsPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import ProjectCard from '../components/ProjectCard'; 
import ProjectListItem from '../components/ProjectListItem'; // Assurez-vous que ce composant existe

const MyProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [viewMode, setViewMode] = useState('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/api/projects');
                setProjects(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des projets:", err);
                setError("Impossible de charger les projets. Veuillez réessayer plus tard.");
                toast.error("Impossible de charger les projets.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredAndSortedProjects = useMemo(() => {
        return projects
            .filter(project => 
                project.nom.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'name':
                        return a.nom.localeCompare(b.nom);
                    case 'oldest':
                        return new Date(a.created_at) - new Date(b.created_at);
                    case 'newest':
                    default:
                        return new Date(b.created_at) - new Date(a.created_at);
                }
            });
    }, [projects, searchTerm, sortOrder]);


    const handleProjectDelete = async (projectId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
            try {
                await apiClient.delete(`/api/projects/${projectId}`);
                setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
                toast.success("Projet supprimé avec succès.");
            } catch (err) {
                console.error("Erreur lors de la suppression du projet:", err);
                toast.error("Erreur lors de la suppression du projet.");
            }
        }
    };

    // === LA FONCTION MANQUANTE EST ICI ===
    /**
     * Met à jour un projet dans la liste d'état après une modification réussie.
     * @param {object} updatedProject - Le projet avec les nouvelles données.
     */
    const handleProjectUpdate = (updatedProject) => {
        setProjects(prevProjects =>
            prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
        );
    };
    // =====================================
    
    if (loading) {
        return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}><span className="visually-hidden">Chargement...</span></div></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const renderProjects = () => {
        if (filteredAndSortedProjects.length === 0) {
            return (
                 <div className="text-center p-5 bg-light rounded-3 mt-4">
                    <i className="bi bi-search display-4 text-muted mb-3"></i>
                    <h4>{searchTerm ? "Aucun projet ne correspond à votre recherche." : "Vous n'avez aucun projet pour le moment."}</h4>
                    <p className="text-muted">{searchTerm ? "Essayez de modifier vos filtres." : "Commencez par créer votre premier projet !"}</p>
                    {!searchTerm && <Link to="/projects/create" className="btn btn-primary mt-3">Créer un projet</Link>}
                </div>
            )
        }

        if (viewMode === 'card') {
            return (
                <div className="row g-4">
                    {filteredAndSortedProjects.map(project => (
                        <div key={project.id} className="col-md-6 col-lg-4">
                            <ProjectCard 
                                project={project} 
                                onDelete={handleProjectDelete} 
                                onUpdate={handleProjectUpdate}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        if (viewMode === 'list') {
            return (
                <ul className="list-group">
                    {filteredAndSortedProjects.map(project => (
                        <ProjectListItem 
                            key={project.id} 
                            project={project} 
                            onDelete={handleProjectDelete} 
                            onUpdate={handleProjectUpdate} 
                        />
                    ))}
                </ul>
            );
        }
    };


    return (
        <div className="container-fluid p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <h1 className="h2 mb-3 mb-md-0">Projets ({projects.length})</h1>
                <Link to="/projects/create" className="btn btn-primary fw-bold">
                    <i className="bi bi-plus-lg me-2"></i> Nouveau Projet
                </Link>
            </div>

            <div className="card mb-4">
                <div className="card-body d-flex flex-wrap gap-3 align-items-center">
                    <div className="flex-grow-1">
                        <input type="text" className="form-control" placeholder="Rechercher par nom..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="d-flex gap-3">
                         <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{minWidth: '150px'}}>
                            <option value="newest">Plus récent</option>
                            <option value="oldest">Plus ancien</option>
                            <option value="name">Nom (A-Z)</option>
                        </select>
                        <div className="btn-group view-switcher">
                            <button className={`btn btn-outline-secondary ${viewMode === 'card' ? 'active' : ''}`} onClick={() => setViewMode('card')}><i className="bi bi-grid-3x3-gap-fill"></i></button>
                            <button className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><i className="bi bi-list-ul"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            {renderProjects()}
        </div>
    );
};

export default MyProjectsPage;