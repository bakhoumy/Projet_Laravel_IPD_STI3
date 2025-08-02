// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null); // 1. NOUVEL ÉTAT POUR LES STATS
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 2. On lance les deux appels en parallèle
                const [usersResponse, statsResponse] = await Promise.all([
                    apiClient.get('/api/admin/users'),
                    apiClient.get('/api/admin/stats')
                ]);
                
                setUsers(usersResponse.data);
                setStats(statsResponse.data);
            } catch (error) {
                console.error("Erreur de récupération des données admin:", error);
                toast.error("Impossible de charger les données d'administration.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Chargement des données d'administration...</p>;

    return (
        <div>
            <h2>Panneau d'Administration</h2>
            
            {/* 3. SECTION STATISTIQUES */}
            {stats && (
                <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0' }}>
                    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px', flex: 1, textAlign: 'center', background: '#fff' }}>
                        <h3 style={{ margin: 0, fontSize: '2rem', color: '#0052cc' }}>{stats.total_projects}</h3>
                        <p style={{ margin: 0, color: '#555' }}>Projets</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px', flex: 1, textAlign: 'center', background: '#fff' }}>
                        <h3 style={{ margin: 0, fontSize: '2rem', color: '#0052cc' }}>{stats.total_tasks}</h3>
                        <p style={{ margin: 0, color: '#555' }}>Tâches Totales</p>
                    </div>
                    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px', flex: 1, textAlign: 'center', background: '#fff' }}>
                        <h3 style={{ margin: 0, fontSize: '2rem', color: '#0052cc' }}>{stats.completion_percentage}%</h3>
                        <p style={{ margin: 0, color: '#555' }}>Avancement Global</p>
                    </div>
                </div>
            )}
            
            <hr />

            {/* SECTION UTILISATEURS */}
            <h3 style={{ marginTop: '2rem' }}>Utilisateurs et charge de travail</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid black' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Nom</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Rôle</th>
                        <th style={{ textAlign: 'center', padding: '8px' }}>Tâches Assignées</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{user.name}</td>
                            <td style={{ padding: '8px' }}>{user.email}</td>
                            <td style={{ padding: '8px', textTransform: 'capitalize' }}>{user.role}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{user.tasks_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;