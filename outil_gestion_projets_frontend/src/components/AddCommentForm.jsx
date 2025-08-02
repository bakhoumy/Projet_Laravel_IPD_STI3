import { useState } from 'react';
import apiClient from '../services/api';

// Note: on a retiré toast car le parent (ProjectDetailPage) le gère.
const AddCommentForm = ({ taskId, onCommentAdded }) => {
    const [texte, setTexte] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texte.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await apiClient.post(`/api/tasks/${taskId}/comments`, { texte });
            onCommentAdded(taskId, response.data);
            setTexte('');
        } catch (error) {
            console.error("Erreur d'ajout de commentaire:", error);
            // On pourrait ajouter une notification d'erreur ici si besoin.
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3">
            <input
                type="text"
                className="form-control form-control-sm"
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Ajouter un commentaire..."
                disabled={isSubmitting}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                {isSubmitting ? '...' : <i className="bi bi-send-fill"></i>}
            </button>
        </form>
    );
};

export default AddCommentForm;