import { useState, useEffect } from 'react';
import apiClient from '../services/api';

// Note: on a retiré toast car il est maintenant géré par le parent (ProjectDetailPage)
const AddTaskForm = ({ projectId, onTaskAdded }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [users, setUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        apiClient.get('/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("Erreur de récupération des utilisateurs:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                titre,
                description,
                project_id: projectId,
                ...(assignedTo && { assigned_to: assignedTo }) // Ajout conditionnel
            };
            const response = await apiClient.post('/api/tasks', payload);
            onTaskAdded(response.data); // Le parent gère la notif et la mise à jour
            setTitre('');
            setDescription('');
            setAssignedTo('');
        } catch (error) {
            console.error("Erreur d'ajout de tâche:", error);
            // On pourrait ajouter une notification d'erreur ici si le parent n'en gère pas
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Ajouter une nouvelle tâche</h5>
            <div className="mb-3">
                <label htmlFor="titre" className="form-label">Titre de la tâche</label>
                <input 
                    id="titre" 
                    type="text" 
                    className="form-control" 
                    value={titre} 
                    onChange={(e) => setTitre(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <label htmlFor="description-tache" className="form-label">Description (optionnel)</label>
                <textarea 
                    id="description-tache" 
                    className="form-control" 
                    rows="2" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>
            <div className="mb-3">
                <label htmlFor="assigned_to" className="form-label">Assigner à (optionnel)</label>
                <select 
                    id="assigned_to" 
                    className="form-select" 
                    value={assignedTo} 
                    onChange={(e) => setAssignedTo(e.target.value)}
                >
                    <option value="">Non assigné</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div className="text-end">
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                    {isSubmitting ? 'Ajout...' : 'Ajouter la tâche'}
                </button>
            </div>
        </form>
    );
};

export default AddTaskForm;