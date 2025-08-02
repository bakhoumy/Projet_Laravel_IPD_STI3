// src/components/EditTaskModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap'; // On importe la classe Modal de Bootstrap JS
import apiClient from '../services/api';
import { toast } from 'react-toastify';

const EditTaskModal = ({ task, onTaskUpdated, onHide }) => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const modalRef = useRef(null);

    // Chaque fois que la prop 'task' change, on met à jour l'état du formulaire
    useEffect(() => {
        if (task) {
            setTitre(task.titre);
            setDescription(task.description);
            // On affiche la modale via l'API JavaScript de Bootstrap
            const modalInstance = new Modal(modalRef.current);
            modalInstance.show();
        } else {
             // Si la tâche est null (on a fermé la modale), on s'assure qu'elle est cachée
            const modalElement = modalRef.current;
            if (modalElement) {
                const modalInstance = Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        }
    }, [task]);

    // Écouteur pour l'événement de fermeture de la modale
    useEffect(() => {
        const modalElement = modalRef.current;
        const handleModalHide = () => {
            onHide(); // Appelle la fonction onHide passée en prop
        };
        modalElement.addEventListener('hidden.bs.modal', handleModalHide);
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalHide);
        };
    }, [onHide]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.put(`/api/tasks/${task.id}`, {
                titre,
                description,
            });
            toast.success("Tâche mise à jour !");
            onTaskUpdated(response.data); // Met à jour l'état dans la page parente
            onHide(); // Ferme la modale
        } catch (error) {
            console.error("Erreur de mise à jour:", error);
            toast.error("Impossible de mettre à jour la tâche.");
        }
    };

    return (
        <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editTaskModalLabel">Modifier la tâche</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="edit-titre" className="form-label">Titre</label>
                                <input id="edit-titre" type="text" className="form-control" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edit-description" className="form-label">Description</label>
                                <textarea id="edit-description" className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onHide}>Annuler</button>
                            <button type="submit" className="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;