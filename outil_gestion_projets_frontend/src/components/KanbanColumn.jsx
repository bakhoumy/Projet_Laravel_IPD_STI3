// src/components/KanbanColumn.jsx
import { useDroppable } from '@dnd-kit/core';

// Style pour les couleurs des colonnes
const columnStyles = {
    'à faire': { backgroundColor: 'rgba(220, 220, 220, 0.3)' },
    'en cours': { backgroundColor: 'rgba(255, 217, 128, 0.3)' },
    'terminé': { backgroundColor: 'rgba(197, 255, 209, 0.4)' },
};

const KanbanColumn = ({ id, title, children }) => {
    // Rend la colonne "droppable"
    const { setNodeRef, isOver } = useDroppable({ id });

    const style = {
        ...columnStyles[id],
        border: isOver ? '2px dashed #0d6efd' : '2px dashed transparent',
        transition: 'border-color 0.2s ease-in-out',
    };

    return (
        <div ref={setNodeRef} style={style} className="p-3 rounded h-100">
            <h3 className="h5 text-capitalize mb-3">{title}</h3>
            <div className="d-flex flex-column">
                {children}
            </div>
        </div>
    );
};

export default KanbanColumn;