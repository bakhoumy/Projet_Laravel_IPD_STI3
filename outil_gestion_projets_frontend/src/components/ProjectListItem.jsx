// src/components/ProjectListItem.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import EditProjectForm from './EditProjectForm'; // Le même formulaire est réutilisé !

const ProjectListItem = ({ project, onDelete, onUpdate = () => {} }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleProjectUpdated = (updatedProject) => {
        onUpdate(updatedProject);
        setIsEditing(false);
    };

    // Si on est en mode édition, on affiche le formulaire directement dans le <li>
    if (isEditing) {
        return (
            <li className="list-group-item p-0">
                <EditProjectForm 
                    project={project} 
                    onProjectUpdated={handleProjectUpdated} 
                    onCancel={() => setIsEditing(false)} 
                />
            </li>
        );
    }

    // Sinon, on affiche la vue normale de la ligne
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center p-3 project-list-item">
            <div className="d-flex align-items-center flex-grow-1 me-3" style={{minWidth: 0}}>
                <i className="bi bi-folder2-open fs-4 text-primary me-3"></i>
                <div className="flex-grow-1" style={{minWidth: 0}}>
                    <Link to={`/projects/${project.id}`} className="fw-bold text-dark text-decoration-none stretched-link">{project.nom}</Link>
                    <p className="mb-0 text-muted small project-description">{project.description || "Pas de description"}</p>
                </div>
            </div>
            <div className="d-none d-lg-block me-4" style={{width: '200px'}}>
                <ProgressBar value={project.completed_tasks_count} max={project.tasks_count} size="sm" />
            </div>
            <div className="text-muted small d-none d-md-block me-4">Crée le {new Date(project.created_at).toLocaleDateString()}</div>
            <div className="dropdown" style={{ zIndex: 2 }}>
                <button className="btn btn-sm btn-link text-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.preventDefault()}>
                    <i className="bi bi-three-dots-vertical"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item d-flex align-items-center" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}><i className="bi bi-pencil-fill me-2"></i> Modifier</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger d-flex align-items-center" onClick={(e) => { e.preventDefault(); onDelete(project.id); }}><i className="bi bi-trash-fill me-2"></i> Supprimer</button></li>
                </ul>
            </div>
        </li>
    );
};

export default ProjectListItem;