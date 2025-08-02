// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../services/api';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    // Pour l'affichage des mots de passe
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await apiClient.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            navigate('/login');

        } catch (err) {
            if (err.response && err.response.status === 422) {
                // On stocke les erreurs retournées par l'API (ex: { email: ["L'email est déjà pris."] })
                // FIX: Provide a fallback empty object to prevent setting state to undefined
                setErrors(err.response.data.errors || {});
                toast.error("Veuillez Saisir un mots de pasee supérieur ou égal à 8 caratères.");
            } else {
                toast.error("Une erreur inattendue est survenue. Veuillez réessayer.");
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg border-0 rounded-4" style={{ width: '25rem' }}>
                <div className="card-body p-4 p-sm-5">
                    {/* En-tête cohérent avec la page de connexion */}
                    <div className="text-center mb-4">
                        <i className="bi bi-kanban-fill text-primary" style={{fontSize: '3rem'}}></i>
                        <h1 className="h3 mb-3 fw-normal">GestionProjets</h1>
                        <p className="text-muted">Créez votre compte pour commencer</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Champ Nom complet */}
                        <div className="mb-3">
                            <div className="input-group has-validation">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-person-fill text-muted"></i></span>
                                <input
                                    id="name"
                                    type="text"
                                    className={`form-control border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nom complet"
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                            </div>
                        </div>

                        {/* Champ Email */}
                        <div className="mb-3">
                            <div className="input-group has-validation">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope-fill text-muted"></i></span>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Adresse e-mail"
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                            </div>
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="mb-3">
                            <div className="input-group has-validation">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill text-muted"></i></span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mot de passe"
                                    required
                                    disabled={isSubmitting}
                                />
                                <button className="btn btn-outline-secondary border-start-0" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                                {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                            </div>
                        </div>

                        {/* Champ Confirmation Mot de passe */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill text-muted"></i></span>
                                <input
                                    id="password_confirmation"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    className="form-control border-start-0 border-end-0"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="Confirmez le mot de passe"
                                    required
                                    disabled={isSubmitting}
                                />
                                 <button className="btn btn-outline-secondary border-start-0" type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                    <i className={`bi ${showPasswordConfirm ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Création du compte...</span>
                                    </>
                                ) : "S'inscrire"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-4 small">
                        Déjà un compte ? <Link to="/login">Connectez-vous</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;