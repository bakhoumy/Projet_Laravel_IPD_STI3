// src/pages/AdminEditUserPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const AdminEditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '', role: 'utilisateur' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/api/admin/users/${userId}`)
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error("Impossible de charger l'utilisateur.");
                navigate('/admin/users');
            });
    }, [userId, navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        apiClient.put(`/api/admin/users/${userId}`, user)
            .then(() => {
                toast.success("Utilisateur mis à jour avec succès !");
                navigate('/admin/users');
            })
            .catch(err => {
                console.error(err);
                toast.error("Erreur lors de la mise à jour.");
            });
    };

    if (loading) return <p>Chargement de l'utilisateur...</p>;

    return (
        <div>
            <Link to="/admin/users">← Retour à la liste</Link>
            <h2 className="h4 my-4">Modifier l'Utilisateur : {user.name}</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nom</label>
                            <input type="text" name="name" id="name" className="form-control" value={user.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" name="email" id="email" className="form-control" value={user.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Rôle</label>
                            <select name="role" id="role" className="form-select" value={user.role} onChange={handleChange} required>
                                <option value="utilisateur">Utilisateur</option>
                                <option value="administrateur">Administrateur</option>
                            </select>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminEditUserPage;