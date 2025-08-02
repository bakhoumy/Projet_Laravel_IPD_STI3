// src/components/UpdatePasswordForm.jsx
import { useState } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const UpdatePasswordForm = () => {
    // State pour les valeurs des champs
    const [passwords, setPasswords] = useState({ 
        current_password: '', 
        password: '', 
        password_confirmation: '' 
    });
    
    // State pour la visibilité des mots de passe
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    // State pour l'indicateur de chargement
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    // Fonction pour basculer la visibilité d'un champ
    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.password !== passwords.password_confirmation) {
            toast.error("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
            return;
        }

        setLoading(true); // Activer le chargement

        try {
            await apiClient.put('/api/profile/password', passwords);
            toast.success("Mot de passe mis à jour avec succès !");
            // Vider tous les champs après succès
            setPasswords({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Une erreur est survenue lors de la mise à jour.";
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Désactiver le chargement dans tous les cas
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* --- Champ Mot de passe actuel --- */}
            <div className="mb-3">
                <label htmlFor="current_password" className="form-label">Mot de passe actuel</label>
                <div className="input-group">
                    <input 
                        type={showPassword.current ? "text" : "password"} 
                        id="current_password"
                        name="current_password" 
                        className="form-control" 
                        value={passwords.current_password} 
                        onChange={handleChange}
                        required 
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => toggleShowPassword('current')}>
                        <i className={`bi ${showPassword.current ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
            </div>

            {/* --- Champ Nouveau mot de passe --- */}
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
                <div className="input-group">
                    <input 
                        type={showPassword.new ? "text" : "password"}
                        id="password" 
                        name="password" 
                        className="form-control" 
                        value={passwords.password} 
                        onChange={handleChange}
                        required
                        aria-describedby="passwordHelpBlock"
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => toggleShowPassword('new')}>
                        <i className={`bi ${showPassword.new ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
                <div id="passwordHelpBlock" className="form-text">
                    Doit contenir au moins 8 caractères.
                </div>
            </div>

            {/* --- Champ Confirmer le nouveau mot de passe --- */}
            <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">Confirmer le nouveau mot de passe</label>
                <div className="input-group">
                    <input 
                        type={showPassword.confirm ? "text" : "password"} 
                        id="password_confirmation"
                        name="password_confirmation" 
                        className="form-control" 
                        value={passwords.password_confirmation} 
                        onChange={handleChange}
                        required
                    />
                     <button className="btn btn-outline-secondary" type="button" onClick={() => toggleShowPassword('confirm')}>
                        <i className={`bi ${showPassword.confirm ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                </div>
            </div>

            {/* --- Bouton de soumission --- */}
            <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Mise à jour...
                        </>
                    ) : (
                        'Changer le mot de passe'
                    )}
                </button>
            </div>
        </form>
    );
};

export default UpdatePasswordForm;