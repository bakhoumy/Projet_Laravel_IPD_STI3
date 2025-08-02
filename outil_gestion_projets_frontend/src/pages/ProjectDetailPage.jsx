// src/pages/ProjectDetailPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

// Imports pour le Drag and Drop
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

// Imports des composants enfants
import AddTaskForm from '../components/AddTaskForm';
import EditProjectForm from '../components/EditProjectForm';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';

// Configuration des colonnes du tableau Kanban
const columnOrder = ['à faire', 'en cours', 'terminé'];
const columnTitles = {
    'à faire': 'À Faire',
    'en cours': 'En Cours',
    'terminé': 'Terminé'
};

// Simulation de l'utilisateur actuellement connecté.
// Dans une application réelle, cette information proviendrait d'un Contexte d'Authentification (AuthContext).
const CURRENT_USER = { id: 1, name: "Le Boss" }; // Assurez-vous que cet ID correspond à un utilisateur valide dans votre base de données

const ProjectDetailPage = () => {
    // --- États du composant ---
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Configuration des capteurs pour le Drag and Drop
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // L'utilisateur doit bouger la souris de 8px pour démarrer le drag
        },
    }));

    // --- Effet pour charger les données initiales ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [projectRes, tasksRes, usersRes] = await Promise.all([
                    apiClient.get(`/api/projects/${projectId}`),
                    apiClient.get(`/api/tasks?project_id=${projectId}`),
                    apiClient.get('/api/users')
                ]);
                setProject(projectRes.data);
                setTasks(tasksRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                console.error("Erreur de chargement:", err);
                toast.error("Impossible de charger les données du projet.");
            } finally { 
                setLoading(false); 
            }
        };
        fetchData();
    }, [projectId]);

    // --- Données mémorisées pour l'affichage des colonnes ---
    const columns = useMemo(() => {
        const cols = {};
        columnOrder.forEach(status => {
            cols[status] = tasks.filter(t => t.état === status);
        });
        return cols;
    }, [tasks]);

    // --- Fonctions de gestion (Handlers) ---

    const handleProjectUpdated = (updatedProject) => {
        setProject(updatedProject);
        setIsEditingProject(false);
    };

    const handleProjectDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?\nCette action est irréversible et supprimera toutes les tâches associées.")) {
            try {
                await apiClient.delete(`/api/projects/${projectId}`);
                toast.success("Projet supprimé avec succès.");
                navigate('/');
            } catch (error) {
                console.error("Erreur de suppression du projet:", error);
                toast.error("Impossible de supprimer le projet.");
            }
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks(currentTasks => [...currentTasks, newTask]);
        setShowAddTaskForm(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(currentTasks => currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTaskId(null);
    };

    const handleTaskDelete = async (taskId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;
        const originalTasks = [...tasks];
        setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId));
        try {
            await apiClient.delete(`/api/tasks/${taskId}`);
            toast.success("Tâche supprimée.");
        } catch (error) {
            console.error("Erreur de suppression de tâche:", error);
            toast.error("Impossible de supprimer la tâche.");
            setTasks(originalTasks);
        }
    };
    
    const handleCommentAdded = (taskId, newComment) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === taskId ? { ...task, comments: [newComment, ...(task.comments || [])] } : task
            )
        );
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id;
        const newStatus = over.id;
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.état === newStatus) return;

        const originalTasks = [...tasks];
        setTasks(currentTasks => 
            currentTasks.map(t => t.id === taskId ? { ...t, état: newStatus } : t)
        );

        try {
            await apiClient.put(`/api/tasks/${taskId}`, { état: newStatus });
        } catch (error) {
            console.error("Erreur de mise à jour de l'état:", error);
            toast.error("La mise à jour de l'état a échoué.");
            setTasks(originalTasks);
        }
    };

    const handleAssigneeChange = async (taskId, newAssigneeId) => {
        const originalTasks = [...tasks];
        const newAssignee = newAssigneeId ? users.find(u => u.id === parseInt(newAssigneeId, 10)) : null;
        const updatedTaskForUI = {
            ...tasks.find(t => t.id === taskId),
            assigned_user: newAssignee
        };
        setTasks(currentTasks => currentTasks.map(t => (t.id === taskId ? updatedTaskForUI : t)));
        try {
            await apiClient.put(`/api/tasks/${taskId}`, { assigned_to: newAssignee ? newAssignee.id : null });
            toast.success("Assignation mise à jour.");
        } catch (error) {
            console.error("Erreur d'assignation:", error);
            toast.error("L'assignation a échoué.");
            setTasks(originalTasks);
        }
    };

    const handleCommentUpdate = async (taskId, commentId, newText) => {
        const originalTasks = [...tasks];
        setTasks(currentTasks => currentTasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    comments: task.comments.map(c => c.id === commentId ? { ...c, texte: newText } : c)
                };
            }
            return task;
        }));
        try {
            await apiClient.put(`/api/comments/${commentId}`, { texte: newText });
            toast.success("Commentaire mis à jour.");
        } catch (error) {
            console.error("Erreur de mise à jour du commentaire:", error);
            toast.error("Impossible de mettre à jour le commentaire.");
            setTasks(originalTasks);
        }
    };

    const handleCommentDelete = async (taskId, commentId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
        const originalTasks = [...tasks];
        setTasks(currentTasks => currentTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, comments: task.comments.filter(c => c.id !== commentId) };
            }
            return task;
        }));
        try {
            await apiClient.delete(`/api/comments/${commentId}`);
            toast.success("Commentaire supprimé.");
        } catch (error) {
            console.error("Erreur de suppression du commentaire:", error);
            toast.error("Impossible de supprimer le commentaire.");
            setTasks(originalTasks);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Chargement...</span></div></div>;
    if (!project) return <p className="text-center mt-5">Projet non trouvé ou une erreur est survenue.</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link to="/" className="btn btn-light"><i className="bi bi-arrow-left"></i> Retour aux projets</Link>
                <div className="d-flex gap-2">
                    <button onClick={() => setIsEditingProject(true)} className="btn btn-outline-secondary btn-sm"><i className="bi bi-pencil-fill me-1"></i> Modifier le projet</button>
                    <button onClick={handleProjectDelete} className="btn btn-outline-danger btn-sm"><i className="bi bi-trash-fill me-1"></i> Supprimer le projet</button>
                </div>
            </div>

            {isEditingProject ? (
                <EditProjectForm project={project} onProjectUpdated={handleProjectUpdated} onCancel={() => setIsEditingProject(false)} />
            ) : (
                <div className="mb-4"><h1>{project.nom}</h1><p className="text-secondary">{project.description}</p></div>
            )}
            
            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Tâches</h2>
                <button onClick={() => setShowAddTaskForm(!showAddTaskForm)} className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i> {showAddTaskForm ? 'Annuler' : 'Nouvelle Tâche'}</button>
            </div>

            {showAddTaskForm && (
                <div className="card card-body mb-4"><AddTaskForm projectId={projectId} onTaskAdded={handleTaskAdded} /></div>
            )}

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="row g-3">
                    {columnOrder.map(status => (
                        <div key={status} className="col-lg-4">
                            <KanbanColumn id={status} title={`${columnTitles[status]} (${columns[status]?.length || 0})`}>
                                {(columns[status] || []).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        users={users}
                                        currentUser={CURRENT_USER}
                                        editingTaskId={editingTaskId}
                                        onEditClick={setEditingTaskId}
                                        onCancelEdit={() => setEditingTaskId(null)}
                                        onTaskUpdated={handleTaskUpdated}
                                        onTaskDelete={handleTaskDelete}
                                        onAssigneeChange={handleAssigneeChange}
                                        onCommentAdded={handleCommentAdded}
                                        onCommentUpdate={handleCommentUpdate}
                                        onCommentDelete={handleCommentDelete}
                                    />
                                ))}
                                {columns[status]?.length === 0 && (<div style={{ minHeight: '100px' }} />)}
                            </KanbanColumn>
                        </div>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default ProjectDetailPage;