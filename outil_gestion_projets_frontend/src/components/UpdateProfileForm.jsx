// src/components/UpdateProfileForm.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const UpdateProfileForm = () => {
    const { user, login } = useAuth(); // Contexte pour les données utilisateur et la mise à jour
    
    // State pour les données du formulaire, initialisées avec les données de l'utilisateur
    const [formData, setFormData] = useState({ 
        name: user.name || '', 
        email: user.email || '' 
    });
    
    // State pour l'indicateur de chargement
    const [loading, setLoading] = useState(false);

    // Gère les changements dans les champs de saisie
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gère la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Optimisation : Vérifier si des modifications ont réellement été faites
        if (formData.name === user.name && formData.email === user.email) {
            toast.info("Aucune modification détectée.");
            return; // Arrêter l'exécution si rien n'a changé
        }
        
        setLoading(true); // Activer l'état de chargement

        try {
            const response = await apiClient.put('/api/profile', formData);
            
            // Mettre à jour le contexte global (et le localStorage via la fonction login)
            login(response.data, localStorage.getItem('token')); 
            
            toast.success("Votre profil a été mis à jour avec succès !");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Une erreur est survenue lors de la mise à jour.";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Désactiver l'état de chargement, que la requête réussisse ou échoue
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* --- Champ Nom --- */}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nom complet</label>
                <input 
                    type="text" 
                    id="name"
                    name="name" 
                    className="form-control" 
                    placeholder="Entrez votre nom complet"
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                />
            </div>
            
            {/* --- Champ Email --- */}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Adresse e-mail</label>
                <input 
                    type="email" 
                    id="email"
                    name="email" 
                    className="form-control" 
                    placeholder="Entrez votre adresse e-mail"
                    value={formData.email} 
                    onChange={handleChange}
                    required 
                />
            </div>

            {/* --- Bouton de soumission --- */}
            <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enregistrement...
                        </>
                    ) : (
                        'Enregistrer les informations'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UpdateProfileForm;