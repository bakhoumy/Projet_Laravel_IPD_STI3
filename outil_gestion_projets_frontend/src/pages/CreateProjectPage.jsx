import { useNavigate } from 'react-router-dom';
import AddProjectForm from '../components/AddProjectForm';

/**
 * Une page dédiée à la création d'un nouveau projet.
 * Elle contient le formulaire et gère la redirection après le succès.
 */
const CreateProjectPage = () => {
    // Le hook 'useNavigate' de react-router-dom nous donne une fonction pour changer de page par programmation.
    const navigate = useNavigate();

    /**
     * Cette fonction est passée en tant que prop "onSuccess" à notre composant AddProjectForm.
     * Le formulaire appellera cette fonction lorsqu'il aura réussi à créer le projet,
     * en lui passant les données du nouveau projet (y compris son ID).
     * @param {object} newProject - L'objet du projet retourné par l'API après sa création.
     */
    const handleProjectCreated = (newProject) => {
        // Une fois le projet créé, on redirige l'utilisateur vers la page de détail de ce nouveau projet.
        // On utilise l'ID du projet reçu pour construire l'URL de destination.
        if (newProject && newProject.id) {
            navigate(`/projects/${newProject.id}`);
        } else {
            // Sécurité : si quelque chose ne va pas, on redirige vers le tableau de bord.
            navigate('/');
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h2>Créer un Nouveau Projet</h2>
                <p style={{ color: '#555' }}>
                    Remplissez les informations ci-dessous pour démarrer un nouveau projet. Vous pourrez ensuite y ajouter des tâches et des commentaires.
                </p>
            </div>
            
            {/* 
              On affiche le composant de formulaire.
              On lui passe notre fonction handleProjectCreated en tant que prop "onSuccess".
            */}
            <AddProjectForm onSuccess={handleProjectCreated} />
        </div>
    );
};

export default CreateProjectPage;