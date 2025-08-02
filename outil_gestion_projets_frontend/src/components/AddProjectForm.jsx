// src/components/AddProjectForm.jsx
import { useState } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const AddProjectForm = ({ onSuccess }) => {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await apiClient.post('/api/projects', { nom, description });
            toast.success("Projet créé avec succès !");
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            console.error("Erreur lors de la création du projet:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                toast.error("Veuillez corriger les erreurs dans le formulaire.");
            } else {
                toast.error("Une erreur inattendue est survenue lors de la création du projet.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
                <label htmlFor="project-nom" className="form-label fw-bold">
                    Nom du projet
                </label>
                <input
                    id="project-nom"
                    type="text"
                    className="form-control"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Refonte du site web"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="project-description" className="form-label fw-bold">
                    Description (optionnel)
                </label>
                <textarea
                    id="project-description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Décrivez l'objectif principal de ce projet..."
                />
            </div>
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Création en cours...' : 'Créer le projet'}
                </button>
            </div>
        </form>
    );
};

export default AddProjectForm;