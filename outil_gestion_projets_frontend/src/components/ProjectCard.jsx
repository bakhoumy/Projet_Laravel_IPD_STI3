// src/components/ProjectCard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import EditProjectForm from './EditProjectForm'; // Assurez-vous que ce composant existe

/**
 * Une carte affichant les détails d'un projet, avec des options pour
 * le voir, le modifier en ligne, ou le supprimer.
 * 
 * @param {object} props
 * @param {object} props.project - L'objet projet à afficher.
 * @param {function(number): void} props.onDelete - Fonction pour gérer la suppression.
 * @param {function(object): void} [props.onUpdate=() => {}] - Fonction pour gérer la mise à jour. Optionnelle.
 */
const ProjectCard = ({ project, onDelete, onUpdate = () => {} }) => {
    // État pour savoir si on est en mode édition
    const [isEditing, setIsEditing] = useState(false);

    // Fonction appelée par le formulaire lorsque la mise à jour est réussie
    const handleProjectUpdated = (updatedProject) => {
        onUpdate(updatedProject); // Notifie le parent avec les nouvelles données
        setIsEditing(false);     // Quitte le mode édition
    };

    return (
        <div className="card h-100 shadow-sm project-card">
            {isEditing ? (
                // --- VUE ÉDITION ---
                // Si on est en mode édition, on affiche le formulaire
                <div className="card-body">
                    <EditProjectForm 
                        project={project} 
                        onProjectUpdated={handleProjectUpdated}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                // --- VUE NORMALE ---
                // Sinon, on affiche les détails du projet
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">
                            <Link to={`/projects/${project.id}`} className="text-decoration-none text-dark stretched-link">
                                {project.nom}
                            </Link>
                        </h5>
                        <div className="dropdown" style={{ zIndex: 2 }}>
                            <button className="btn btn-sm btn-link text-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                                        <i className="bi bi-pencil-fill me-2"></i> Modifier
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger d-flex align-items-center" onClick={(e) => { e.preventDefault(); onDelete(project.id); }}>
                                        <i className="bi bi-trash-fill me-2"></i> Supprimer
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <p className="card-text text-muted small flex-grow-1">{project.description || "Aucune description."}</p>
                    
                    <div className="mt-auto pt-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="avatar-stack">
                                {/* À remplacer par les vrais avatars des membres */}
                                <span className="avatar">+3</span>
                            </div>
                            <span className="badge bg-light text-dark">{project.due_date || 'Pas de date'}</span>
                        </div>
                        <div className="small text-muted mb-1">
                            Avancement ({project.completed_tasks_count || 0} / {project.tasks_count || 0})
                        </div>
                        <ProgressBar value={project.completed_tasks_count} max={project.tasks_count} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;