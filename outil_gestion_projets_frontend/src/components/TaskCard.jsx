// src/components/TaskCard.jsx

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Dropdown from 'react-bootstrap/Dropdown';

// Import des composants enfants
import EditTaskForm from './EditTaskForm';
import AddCommentForm from './AddCommentForm';

// Import des icônes
import { 
    ThreeDotsVertical,
    Pencil, 
    Trash, 
    ChatLeftText, 
    ArrowUpCircleFill, 
    ArrowDownCircleFill, 
    ArrowRightCircleFill,
    PersonCircle,
    PencilFill,
    TrashFill,
    CheckLg,
    XLg
} from 'react-bootstrap-icons';

// Import du CSS personnalisé
import './TaskCard.css';

// --- Fonctions utilitaires ---
const getInitials = (name = '') => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const stringToColor = (str = 'default') => {
    if (str.length === 0) return '#6c757d';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

// --- Composant Principal ---
const TaskCard = ({ 
    task, 
    users, 
    currentUser,
    editingTaskId, 
    onEditClick,
    onCancelEdit,
    onTaskUpdated,
    onTaskDelete,
    onAssigneeChange,
    onCommentAdded,
    onCommentUpdate,
    onCommentDelete
}) => {
    // --- États locaux du composant ---
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    // --- Logique du Drag and Drop ---
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
        opacity: isDragging ? 0.9 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
    };

    // --- Fonctions de gestion locales ---
    const toggleCommentsVisibility = (e) => {
        e.stopPropagation(); // Empêche le drag de démarrer au clic
        setIsCommentsVisible(prev => !prev);
    };

    const handleStartEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.texte);
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleSaveComment = () => {
        if (!editingCommentText.trim()) return;
        onCommentUpdate(task.id, editingCommentId, editingCommentText);
        handleCancelEditComment(); // Réinitialise l'état d'édition
    };

    // --- Éléments d'UI réutilisables ---
    const PriorityIcon = () => {
        const priorities = ['High', 'Medium', 'Low'];
        const taskPriority = priorities[task.id % 3]; // Simulation
        switch(taskPriority) {
            case 'High': return <ArrowUpCircleFill className="priority-icon priority-high" title="Priorité : Haute" />;
            case 'Medium': return <ArrowRightCircleFill className="priority-icon priority-medium" title="Priorité : Moyenne" />;
            case 'Low': return <ArrowDownCircleFill className="priority-icon priority-low" title="Priorité : Basse" />;
            default: return null;
        }
    };
    
    const assignedUser = task.assigned_user;
    
    // Composant personnalisé pour le bouton du dropdown d'assignation
    const AssigneeToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a href="" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }} className="assignee-wrapper">
            {children}
        </a>
    ));

    // Rendu du formulaire si la TÂCHE elle-même est en mode édition
    if (editingTaskId === task.id) {
        return (
            <div className="card shadow-sm mb-3">
                <div className="card-body"><EditTaskForm task={task} onTaskUpdated={onTaskUpdated} onCancel={onCancelEdit} /></div>
            </div>
        );
    }

    // Rendu de la carte normale
    return (
        <div ref={setNodeRef} style={style} className="card shadow-sm mb-3 task-card">
            <div className="card-body p-3" {...attributes} {...listeners}>
                
                {/* --- Header: Titre et Menu d'actions de la tâche --- */}
                <div className="d-flex justify-content-between align-items-start">
                    <p className="fw-bold mb-1 pe-2">{task.titre}</p>
                    <Dropdown onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                        <Dropdown.Toggle as="a" className="btn btn-sm btn-light p-0 border-0 task-actions-btn"><ThreeDotsVertical /></Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => onEditClick(task.id)}><Pencil size={14} className="me-2" /> Modifier</Dropdown.Item>
                            <Dropdown.Item onClick={() => onTaskDelete(task.id)} className="text-danger"><Trash size={14} className="me-2" /> Supprimer</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* --- Description --- */}
                {task.description && <p className="card-text small text-secondary mb-2">{task.description}</p>}

                {/* --- Footer: Infos et actions rapides --- */}
                <div className="task-card-footer d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center gap-2">
                        <PriorityIcon />
                        <span className="fw-bold">TASK-{task.id}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <a onClick={toggleCommentsVisibility} className="d-flex align-items-center gap-1 text-secondary text-decoration-none comments-toggle-btn" title={isCommentsVisible ? "Cacher les commentaires" : "Afficher les commentaires"}>
                            <ChatLeftText size={14} />{task.comments?.length || 0}
                        </a>
                        <Dropdown onMouseDown={e => e.stopPropagation()}>
                            <Dropdown.Toggle as={AssigneeToggle}>
                                {assignedUser ? (<div className="assignee-avatar" style={{ backgroundColor: stringToColor(assignedUser.name) }} title={`Assigné à: ${assignedUser.name}`}>{getInitials(assignedUser.name)}</div>) : (<PersonCircle size={28} className="text-secondary" title="Cliquez pour assigner" />)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Header>Assigner à</Dropdown.Header>
                                <Dropdown.Item onClick={() => onAssigneeChange(task.id, '')}><PersonCircle className="me-2" /> Non assigné</Dropdown.Item>
                                <Dropdown.Divider />
                                {users.map(user => (<Dropdown.Item key={user.id} onClick={() => onAssigneeChange(task.id, user.id)}><div className="assignee-avatar-small me-2" style={{ backgroundColor: stringToColor(user.name) }}>{getInitials(user.name)}</div>{user.name}</Dropdown.Item>))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* --- Section accordéon pour les commentaires --- */}
                <div className={`comments-section ${isCommentsVisible ? 'visible' : ''}`}>
                    <h6 className="small text-muted mb-2">Commentaires</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                        {task.comments?.length > 0 ? (
                            task.comments.map(comment => (
                                <div key={comment.id} className="small comment-item">
                                    {editingCommentId === comment.id ? (
                                        <div className="comment-edit-form">
                                            <textarea className="form-control form-control-sm" value={editingCommentText} onChange={(e) => setEditingCommentText(e.target.value)} rows="2" autoFocus />
                                            <div className="d-flex justify-content-end gap-2">
                                                <button className="btn btn-sm btn-secondary" onClick={handleCancelEditComment}><XLg /></button>
                                                <button className="btn btn-sm btn-success" onClick={handleSaveComment}><CheckLg /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-0"><strong>{comment.auteur?.name || 'Utilisateur inconnu'}:</strong> {comment.texte}</p>
                                            {currentUser?.id === comment.auteur?.id && (
                                                <div className="comment-actions">
                                                    <a onClick={() => handleStartEditComment(comment)} title="Modifier"><PencilFill size={12} /></a>
                                                    <a onClick={() => onCommentDelete(task.id, comment.id)} title="Supprimer"><TrashFill size={12} /></a>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (<p className="small text-secondary fst-italic">Aucun commentaire.</p>)}
                    </div>
                    <AddCommentForm taskId={task.id} onCommentAdded={onCommentAdded} />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;