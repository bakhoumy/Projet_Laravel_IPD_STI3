// src/components/StatsCard.jsx
import PropTypes from 'prop-types';

/**
 * Une carte réutilisable pour afficher une statistique clé avec une icône.
 * @param {{
 *   icon: React.ReactNode,
 *   value: string | number,
 *   label: string
 * }} props
 */
const StatsCard = ({ icon, value, label }) => {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex align-items-center p-3">
                <div className="flex-shrink-0 me-3">
                    {icon}
                </div>
                <div className="flex-grow-1">
                    {/* On affiche la valeur ici. On ajoute un fallback pour les cas où la valeur serait null/undefined */}
                    <h4 className="mb-0 fw-bold">{value ?? 'N/A'}</h4>
                    <p className="card-text text-muted mb-0">{label}</p>
                </div>
            </div>
        </div>
    );
};

// C'est une bonne pratique d'ajouter des prop-types pour la robustesse du composant.
StatsCard.propTypes = {
    icon: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string.isRequired,
};

export default StatsCard;