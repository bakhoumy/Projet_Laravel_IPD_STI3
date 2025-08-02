// src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';
// Optionnel: ajoutez un logo pour votre application
// import logo from '../assets/logo.svg'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/api/login', {
                email: email,
                password: password,
            });

            login(response.data.user, response.data.access_token);
            navigate('/'); // Redirection vers le tableau de bord ou la page d'accueil

        } catch (err) {
            console.error(err);
            // On peut garder un message d'erreur générique pour la sécurité
            setError('L\'adresse e-mail ou le mot de passe est incorrect.');
        } finally {
            // Assurez-vous que le chargement s'arrête même en cas d'erreur
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg border-0 rounded-4" style={{ width: '25rem' }}>
                <div className="card-body p-4 p-sm-5">
                    {/* Emplacement pour le logo */}
                    <div className="text-center mb-4">
                        {/* <img src={logo} alt="Logo de l'application" width="72" className="mb-3" /> */}
                        <i className="bi bi-kanban-fill text-primary" style={{fontSize: '3rem'}}></i>
                        <h1 className="h3 mb-3 fw-normal">GestionProjets</h1>
                        <p className="text-muted">Connectez-vous pour gérer vos projets</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="input-group mb-3">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-envelope-fill text-muted"></i>
                            </span>
                            <input
                                type="email"
                                id="email"
                                className="form-control border-start-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Adresse e-mail"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-lock-fill text-muted"></i>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="form-control border-start-0 border-end-0"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                required
                                disabled={loading}
                            />
                            <button 
                                className="btn btn-outline-secondary border-start-0" 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                        
                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span className="ms-2">Connexion...</span>
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-4 small">
                        Pas encore de compte ? <Link to="/register">Créez-en un</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;