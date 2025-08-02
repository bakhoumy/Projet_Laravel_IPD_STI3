// src/components/ProgressBar.jsx
import PropTypes from 'prop-types'; // Bonne pratique pour documenter les props

/**
 * Un composant de barre de progression moderne et flexible.
 * Change de couleur en fonction de l'avancement et supporte plusieurs styles.
 */
const ProgressBar = ({ 
    value = 0, 
    max = 100, 
    showLabel = false, // Par défaut, on cache le label pour un look plus épuré sur les cartes
    size = 'md', 
    animated = true, 
    striped = true 
}) => {
    // S'assure que la valeur ne dépasse jamais le max pour le calcul
    const cappedValue = Math.min(value, max);
    const percentage = max > 0 ? (cappedValue / max) * 100 : 0;

    // Logique pour choisir la couleur de la barre en fonction du pourcentage
    let barColorClass = 'bg-primary';
    if (percentage < 30) {
        barColorClass = 'bg-danger';
    } else if (percentage < 70) {
        barColorClass = 'bg-warning';
    } else if (percentage < 100) {
        barColorClass = 'bg-info';
    } else {
        barColorClass = 'bg-success';
    }

    // Construit les classes dynamiquement
    const progressHeightClass = size === 'sm' ? 'progress-sm' : '';
    const progressBarClasses = `
        progress-bar
        ${barColorClass}
        ${striped ? 'progress-bar-striped' : ''}
        ${animated && percentage < 100 ? 'progress-bar-animated' : ''}
    `;

    return (
        <div>
            {/* Le label est maintenant conditionnel */}
            {showLabel && (
                <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progression</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            
            <div 
                className={`progress ${progressHeightClass}`} 
                style={{ height: size === 'md' ? '8px' : undefined }}
                title={`${value} / ${max}`} // Tooltip au survol
            >
                <div 
                    className={progressBarClasses}
                    role="progressbar" 
                    style={{ width: `${percentage}%` }} 
                    aria-valuenow={percentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                ></div>
            </div>
        </div>
    );
};

// Définir les types des props est une excellente pratique en React
ProgressBar.propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    showLabel: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md']),
    animated: PropTypes.bool,
    striped: PropTypes.bool,
};

export default ProgressBar;