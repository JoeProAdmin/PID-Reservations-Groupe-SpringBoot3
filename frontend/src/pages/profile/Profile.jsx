import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';


const Profile = () => {
    const { id } = useParams();
    const { token, userId } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = String(userId) === String(id);

    const roleLabel = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'Administrateur';
            case 'ROLE_PRODUCTEUR': return 'Producteur';
            case 'ROLE_PRODUCTEUR_PENDING': return 'Producteur (en attente)';
            default: return 'Utilisateur';
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/api/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Utilisateur introuvable');
            return res.json();
        })
        .then(data => { setUser(data); setLoading(false); })
        .catch(err => { setError(err.message); setLoading(false); });
    }, [id, token]);

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 pt-5 text-center text-danger">{error}</div>;

    return (
        <>
            <PageHeader
                title={`${user.firstName} ${user.lastName}`}
                subtitle={roleLabel(user.role)}
                breadcrumb={[
                    { label: 'Accueil', path: '/' },
                    { label: `${user.firstName} ${user.lastName}` }
                ]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="user" text="Informations" />

                                    <div className="row g-4 mb-4">
                                        <div className="col-md-6">
                                            <p className="info-label">Prénom</p>
                                            <p className="info-value">{user.firstName}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="info-label">Nom</p>
                                            <p className="info-value">{user.lastName}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="info-label">Email</p>
                                            <p className="info-value">{user.email}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p className="info-label">Rôle</p>
                                            <p className="info-value">
                                                {roleLabel(user.role)}
                                            </p>
                                        </div>
                                    </div>

                                    {isOwnProfile && (
                                        <>
                                            <hr className="agency-divider" />
                                            <div className="d-flex justify-content-end">
                                                <Link to={`/profile/${id}/edit`}
                                                    className="btn btn-warning text-uppercase"
                                                    style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                                                    <i className="fas fa-pen me-2"></i>Modifier mon profil
                                                </Link>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;