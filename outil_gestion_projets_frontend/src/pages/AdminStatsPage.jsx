// src/pages/AdminStatsPage.jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { toast } from 'react-toastify';
import StatsCard from '../components/StatsCard'; // On réutilise notre super composant

// Importations nécessaires pour Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AdminStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', 'all'

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // On suppose que l'API peut prendre un paramètre de période
                const response = await apiClient.get(`/api/admin/stats?range=${timeRange}`);
                setStats(response.data);
            } catch (error) {
                console.error("Erreur de récupération des statistiques:", error);
                setError("Impossible de charger les statistiques.");
                toast.error("Impossible de charger les statistiques.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange]); // Se relance si timeRange change

    // Options et données pour les graphiques (à adapter selon les données de votre API)
    const taskStatusData = {
        labels: ['À faire', 'En cours', 'Terminé'],
        datasets: [{
            data: [
                stats?.tasks_by_status?.todo ?? 0, 
                stats?.tasks_by_status?.in_progress ?? 0, 
                stats?.tasks_by_status?.done ?? 0
            ],
            backgroundColor: ['#6c757d', '#ffc107', '#198754'],
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const activityData = {
        labels: stats?.activity_over_time?.map(d => d.date) ?? [],
        datasets: [{
            label: 'Tâches créées',
            data: stats?.activity_over_time?.map(d => d.count) ?? [],
            fill: true,
            backgroundColor: 'rgba(13, 110, 253, 0.2)',
            borderColor: 'rgba(13, 110, 253, 1)',
            tension: 0.3
        }],
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }
    
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">Statistiques Globales</h1>
                    <p className="text-muted">Vue d'ensemble de l'activité sur la plateforme.</p>
                </div>
                <div className="btn-group">
                    <button className={`btn btn-outline-primary ${timeRange === '7d' ? 'active' : ''}`} onClick={() => setTimeRange('7d')}>7J</button>
                    <button className={`btn btn-outline-primary ${timeRange === '30d' ? 'active' : ''}`} onClick={() => setTimeRange('30d')}>30J</button>
                    <button className={`btn btn-outline-primary ${timeRange === 'all' ? 'active' : ''}`} onClick={() => setTimeRange('all')}>Tout</button>
                </div>
            </div>

            {/* Indicateurs clés */}
            <div className="row g-4 mb-4">
                <div className="col-md-4"><StatsCard icon={<i className="bi bi-journal-check fs-2 text-primary"></i>} value={stats.total_projects} label="Projets actifs" /></div>
                <div className="col-md-4"><StatsCard icon={<i className="bi bi-list-task fs-2 text-info"></i>} value={stats.total_tasks} label="Tâches créées" /></div>
                <div className="col-md-4"><StatsCard icon={<i className="bi bi-people-fill fs-2 text-success"></i>} value={stats.total_users} label="Utilisateurs" /></div>
            </div>

            {/* Graphiques */}
            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card h-100 shadow-sm">
                        <div className="card-header">Répartition des tâches</div>
                        <div className="card-body d-flex justify-content-center align-items-center">
                            <Doughnut data={taskStatusData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                     <div className="card h-100 shadow-sm">
                        <div className="card-header">Activité Récente</div>
                        <div className="card-body">
                            <Line data={activityData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Top contributeurs */}
             <div className="mt-4">
                <div className="card shadow-sm">
                    <div className="card-header">Top Contributeurs</div>
                    <ul className="list-group list-group-flush">
                        {stats.top_users?.map((user, index) => (
                             <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold me-2">#{index + 1}</span>
                                    {user.name}
                                </div>
                                <span className="badge bg-primary rounded-pill">{user.tasks_completed} tâches complétées</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPage;