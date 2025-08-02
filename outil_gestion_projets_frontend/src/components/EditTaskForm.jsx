import { useState } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

/**
 * Un formulaire pour modifier le titre et la description d'une tâche existante.
 * 
 * @param {object} props - Les propriétés du composant.
 * @param {object} props.task - L'objet tâche contenant les données actuelles à modifier.
 * @param {function(object): void} props.onTaskUpdated - Fonction de rappel à exécuter après une mise à jour réussie.
 * @param {function(): void} props.onCancel - Fonction de rappel à exécuter lorsque l'utilisateur clique sur "Annuler".
 */
const EditTaskForm = ({ task, onTaskUpdated, onCancel }) => {
    // On initialise les états du formulaire avec les données actuelles de la tâche.
    const [titre, setTitre] = useState(task.titre);
    const [description, setDescription] = useState(task.description || ''); // Prévoir le cas où la description est null
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // On envoie une requête PUT à l'API avec seulement les champs modifiables.
            const response = await apiClient.put(`/api/tasks/${task.id}`, { titre, description });
            
            // On notifie la page parente avec la tâche mise à jour.
            onTaskUpdated(response.data);
            
            // On affiche une notification de succès.
            toast.success("Tâche mise à jour avec succès.");
        } catch (error) {
            console.error("Erreur de mise à jour de tâche:", error);
            toast.error("Impossible de mettre à jour la tâche.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Le formulaire n'a pas besoin de classes de conteneur supplémentaires car il est déjà dans une "card".
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor={`edit-task-titre-${task.id}`} className="form-label fw-bold">Titre</label>
                <input 
                    type="text" 
                    id={`edit-task-titre-${task.id}`} // Utiliser un ID unique
                    className="form-control" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <label htmlFor={`edit-task-desc-${task.id}`} className="form-label fw-bold">Description</label>
                <textarea 
                    id={`edit-task-desc-${task.id}`} // Utiliser un ID unique
                    className="form-control" 
                    rows="3" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
                    Annuler
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default EditTaskForm;