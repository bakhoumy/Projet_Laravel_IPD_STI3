import { useState } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

/**
 * Un formulaire pour modifier le nom et la description d'un projet existant.
 * Ce composant est conçu pour être affiché en mode "édition" sur la page de détail d'un projet.
 * 
 * @param {object} props - Les propriétés du composant.
 * @param {object} props.project - L'objet projet contenant les données actuelles à modifier.
 * @param {function(object): void} props.onProjectUpdated - Fonction de rappel à exécuter après une mise à jour réussie. Elle reçoit le nouvel objet projet.
 * @param {function(): void} props.onCancel - Fonction de rappel à exécuter lorsque l'utilisateur clique sur "Annuler".
 */
const EditProjectForm = ({ project, onProjectUpdated, onCancel }) => {
    // On initialise les états du formulaire avec les données actuelles du projet.
    const [nom, setNom] = useState(project.nom);
    const [description, setDescription] = useState(project.description || ''); // Utiliser '' comme fallback si la description est null
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Requête PUT à l'API pour mettre à jour les données du projet
            const response = await apiClient.put(`/api/projects/${project.id}`, { nom, description });
            
            // On notifie la page parente avec les nouvelles données du projet
            onProjectUpdated(response.data);
            
            // On affiche une notification de succès
            toast.success("Projet mis à jour avec succès !");
        } catch (error) {
            console.error("Erreur de mise à jour du projet:", error);
            toast.error("Impossible de mettre à jour le projet.");
        } finally {
            // On réactive les boutons du formulaire
            setIsSubmitting(false);
        }
    };

    return (
        // Utilisation des classes Bootstrap pour le style :
        // p-3: padding | bg-light: fond gris clair | border: bordure | rounded: coins arrondis
        <form onSubmit={handleSubmit} className="p-3 bg-light border rounded">
            <h4 className="mb-3">Modifier le projet</h4>
            
            {/* mb-3: margin-bottom */}
            <div className="mb-3">
                {/* form-label: style pour les étiquettes */}
                <label htmlFor="edit-nom" className="form-label fw-bold">Nom du projet</label>
                {/* form-control: style pour les champs de formulaire */}
                <input 
                    id="edit-nom" 
                    type="text" 
                    className="form-control" 
                    value={nom} 
                    onChange={(e) => setNom(e.target.value)} 
                    required 
                />
            </div>

            <div className="mb-3">
                <label htmlFor="edit-desc" className="form-label fw-bold">Description</label>
                <textarea 
                    id="edit-desc" 
                    className="form-control" 
                    rows="3" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>

            {/* d-flex, justify-content-end, gap-2: classes flexbox pour aligner les boutons à droite avec un espace */}
            <div className="d-flex justify-content-end gap-2">
                {/* btn, btn-secondary: classes pour les boutons */}
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </div>
        </form>
    );
};

export default EditProjectForm;