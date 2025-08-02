// src/pages/MyTasksPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import AddCommentForm from '../components/AddCommentForm';

// Fonction utilitaire pour obtenir la classe de badge Bootstrap selon l'état
const getStatusBadge = (status) => {
    switch (status) {
        case 'à faire':
            return 'bg-warning text-dark'; // Jaune/Orange pour "à faire"
        case 'en cours':
            return 'bg-primary'; // Bleu pour "en cours"
        case 'terminé':
            return 'bg-success'; // Vert pour "terminé"
        default:
            return 'bg-secondary';
    }
};

const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    // State pour savoir quelle tâche est actuellement dépliée
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    useEffect(() => {
        apiClient.get('/api/mytasks')
            .then(response => {
                // On trie pour avoir "en cours" et "à faire" en premier
                const sorted = response.data.sort((a, b) => {
                    const order = { 'en cours': 0, 'à faire': 1, 'terminé': 2 };
                    return (order[a.état] || 3) - (order[b.état] || 3);
                });
                setTasks(sorted);
            })
            .catch(() => toast.error("Impossible de charger vos tâches."))
            .finally(() => setLoading(false));
    }, []);

    const handleToggleDetails = (taskId) => {
        // Si on clique sur la même tâche, on la replie. Sinon, on déplie la nouvelle.
        setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const originalTasks = [...tasks];
        setTasks(current => current.map(t => t.id === taskId ? { ...t, état: newStatus } : t));
        try {
            await apiClient.put(`/api/tasks/${taskId}`, { état: newStatus });
            toast.success("Statut mis à jour !");
        } catch {
            toast.error("Erreur de mise à jour.");
            setTasks(originalTasks);
        }
    };

    const handleCommentAdded = (taskId, newComment) => {
        setTasks(current =>
            current.map(task =>
                task.id === taskId ? { ...task, comments: [newComment, ...(task.comments || [])] } : task
            )
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h1 className="h3">Mes Tâches</h1>
                <span className="badge bg-light text-dark fs-6">{tasks.length} tâches</span>
            </div>

            {tasks.length > 0 ? (
                <div className="list-group">
                    {tasks.map(task => (
                        <div key={task.id} className="list-group-item list-group-item-action p-0 mb-3 border rounded shadow-sm">
                           
                            {/* EN-TÊTE VISIBLE DE LA TÂCHE */}
                            <div className="d-flex justify-content-between align-items-center p-3" onClick={() => handleToggleDetails(task.id)} style={{ cursor: 'pointer' }}>
                                <div className="d-flex align-items-center gap-3">
                                    <i className={`bi bi-check-circle-fill fs-4 ${task.état === 'terminé' ? 'text-success' : 'text-muted'}`}></i>
                                    <div>
                                        <p className="fw-bold mb-0">{task.titre}</p>
                                        <Link 
                                            to={`/projects/${task.project.id}`} 
                                            className="small text-decoration-none text-primary"
                                            onClick={(e) => e.stopPropagation()} // Empêche le dépliage au clic sur le lien
                                        >
                                            <i className="bi bi-folder-fill me-1"></i>
                                            {task.project.nom}
                                        </Link>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className={`badge ${getStatusBadge(task.état)}`}>{task.état}</span>
                                    <i className={`bi bi-chevron-down transition-transform ${expandedTaskId === task.id ? 'rotate-180' : ''}`}></i>
                                </div>
                            </div>
                           
                            {/* DÉTAILS CACHÉS (COLLAPSE) */}
                            <div className={`collapse ${expandedTaskId === task.id ? 'show' : ''}`} id={`task-details-${task.id}`}>
                                <div className="card-body bg-light border-top p-3">
                                    <p className="text-muted">{task.description}</p>
                                    
                                    <div className="row mt-3">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor={`status-${task.id}`} className="form-label small fw-bold">Changer l'état</label>
                                            <select id={`status-${task.id}`} className="form-select form-select-sm" value={task.état} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                                                <option value="à faire">À faire</option>
                                                <option value="en cours">En cours</option>
                                                <option value="terminé">Terminé</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 pt-3 border-top">
                                        <h6 className="small fw-bold text-dark"><i className="bi bi-chat-dots-fill me-2"></i>Commentaires</h6>
                                        {task.comments && task.comments.length > 0 ? (
                                            <div className="list-unstyled mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {task.comments.map(comment => (
                                                    <div key={comment.id} className="d-flex gap-2 mb-2 p-2 bg-white rounded border">
                                                        <i className="bi bi-person-circle text-muted"></i>
                                                        <div>
                                                            <strong className="d-block small">{comment.auteur.name}</strong>
                                                            <span className="text-break small">{comment.texte}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="small text-muted fst-italic">Aucun commentaire pour le moment.</p>}
                                        <AddCommentForm taskId={task.id} onCommentAdded={handleCommentAdded} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <i className="bi bi-check2-circle display-4 text-success mb-3"></i>
                    <h4 className="fw-light">Félicitations !</h4>
                    <p className="text-muted">Vous n'avez aucune tâche qui vous est assignée.</p>
                </div>
            )}
        </div>
    );
};

export default MyTasksPage;