// src/pages/ProfilePage.jsx
import UpdateProfileForm from '../components/UpdateProfileForm';
import UpdatePasswordForm from '../components/UpdatePasswordForm';

const ProfilePage = () => {
    return (
        <div className="container mt-4">
            {/* --- En-tête de la page --- */}
            <div className="mb-4">
                <h1 className="h3">Mon Profil</h1>
                <p className="text-muted">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
            </div>

            {/* --- Bloc principal avec onglets --- */}
            <div className="card shadow-sm border-0 rounded-3">
                
                {/* --- Les boutons des onglets --- */}
                <div className="card-header bg-light p-0 border-bottom-0">
                    <ul className="nav nav-tabs nav-tabs-line" id="profile-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link active" 
                                id="info-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#info-tab-pane" 
                                type="button" 
                                role="tab" 
                                aria-controls="info-tab-pane" 
                                aria-selected="true"
                            >
                                <i className="bi bi-person-vcard-fill me-2"></i>Informations du profil
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="password-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#password-tab-pane" 
                                type="button" 
                                role="tab" 
                                aria-controls="password-tab-pane" 
                                aria-selected="false"
                            >
                               <i className="bi bi-shield-lock-fill me-2"></i>Changer le mot de passe
                            </button>
                        </li>
                    </ul>
                </div>

                {/* --- Le contenu des onglets --- */}
                <div className="card-body p-4">
                    <div className="tab-content" id="profile-tabContent">
                        
                        {/* Contenu de l'onglet "Informations" */}
                        <div 
                            className="tab-pane fade show active" 
                            id="info-tab-pane" 
                            role="tabpanel" 
                            aria-labelledby="info-tab" 
                            tabIndex="0"
                        >
                            <h5 className="card-title mb-4">Mettre à jour vos informations</h5>
                            <UpdateProfileForm />
                        </div>
                        
                        {/* Contenu de l'onglet "Mot de passe" */}
                        <div 
                            className="tab-pane fade" 
                            id="password-tab-pane" 
                            role="tabpanel" 
                            aria-labelledby="password-tab" 
                            tabIndex="0"
                        >
                             <h5 className="card-title mb-4">Définir un nouveau mot de passe</h5>
                            <UpdatePasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;