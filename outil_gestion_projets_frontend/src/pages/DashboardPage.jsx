// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// Import des nouveaux composants
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';

// Import du CSS (si vous avez créé un fichier dédié)
import './Dashboard.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Utilisation de Promise.all pour des requêtes en parallèle plus propres
                const requests = [apiClient.get('/api/projects')];
                if (user?.role === 'administrateur') {
                    requests.push(apiClient.get('/api/admin/stats'));
                }
                
                const [projectsRes, statsRes] = await Promise.all(requests);
                
                setProjects(projectsRes.data);
                if (statsRes) {
                    setStats(statsRes.data);
                }

            } catch (err) {
                console.error("Erreur de récupération des données:", err);
                setError("Impossible de charger les données du tableau de bord.");
                toast.error("Impossible de charger les données du tableau de bord.");
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleProjectDelete = async (projectId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
            try {
                await apiClient.delete(`/api/projects/${projectId}`);
                setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
                toast.success("Projet supprimé avec succès.");
            } catch (err) {
                console.error("Erreur lors de la suppression du projet:", err);
                toast.error("Une erreur est survenue lors de la suppression du projet.");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container-fluid p-4">
            <h1 className="h2 mb-4">Bonjour, {user?.name} !</h1>

            {/* Section des statistiques pour les administrateurs */}
            {stats && (
                <div className="mb-5">
                    <h2 className="h4 mb-3 text-muted">Vue d'ensemble</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <StatsCard icon={<i className="bi bi-folder2-open fs-2 text-primary"></i>} value={stats.total_projects} label="Projets au total" className="bg-primary-subtle" />
                        </div>
                        <div className="col-md-4">
                            <StatsCard icon={<i className="bi bi-card-checklist fs-2 text-warning"></i>} value={stats.total_tasks} label="Tâches créées" className="bg-warning-subtle" />
                        </div>
                        <div className="col-md-4">
                            <StatsCard icon={<i className="bi bi-check2-circle fs-2 text-success"></i>} value={`${stats.completion_percentage}%`} label="Tâches complétées" className="bg-success-subtle" />
                        </div>
                    </div>
                </div>
            )}

            {/* Section des projets */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0 text-muted">Mes Projets</h2>
                <Link to="/projects/create" className="btn btn-primary fw-bold">
                    <i className="bi bi-plus-lg me-2"></i> Nouveau Projet
                </Link>
            </div>

            {projects.length > 0 ? (
                <div className="row g-4">
                    {projects.map(project => (
                        <div key={project.id} className="col-md-6 col-lg-4">
                            <ProjectCard project={project} onDelete={handleProjectDelete} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-5 bg-light rounded-3">
                    <i className="bi bi-journal-check display-1 text-muted mb-3"></i>
                    <h3 className="fw-bold">Prêt à démarrer ?</h3>
                    <p className="text-muted">Créez votre premier projet et organisez vos tâches en un clin d'œil.</p>
                    <Link to="/projects/create" className="btn btn-primary btn-lg mt-3">Créer un projet</Link>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;