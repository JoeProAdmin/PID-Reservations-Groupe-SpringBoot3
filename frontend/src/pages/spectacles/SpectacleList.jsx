import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';


const SpectacleList = () => {
    const [spectacles, setSpectacles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { role } = useAuth();

    useEffect(() => {
        fetch(`${API_URL}/api/spectacles`)
            .then(res => res.json())
            .then(data => { setSpectacles(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 pt-5 text-center text-danger">{error}</div>;

    return (
        <>
            <PageHeader
                title="Nos Spectacles"
                subtitle="Découvrez et réservez vos spectacles"
                breadcrumb={[{ label: 'Spectacles', path: '/' }]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="count-badge">
                            {spectacles.length} spectacle{spectacles.length !== 1 ? 's' : ''}
                        </span>
                        {role === 'ROLE_ADMIN' && (
                        <Link to="/spectacles/create" className="btn btn-primary text-uppercase btn-admin">
                            <i className="fas fa-plus me-2"></i>Nouveau spectacle
                        </Link>
                        )}
                    </div>

                    {spectacles.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-theater-masks fa-3x text-muted mb-3"></i>
                            <p className="info-label">
                                Aucun spectacle disponible.
                            </p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {spectacles.map(spectacle => (
                                <div className="col-lg-4 col-md-6" key={spectacle.id}>
                                    <div className="artist-card">
                                        <div className="card-accent"></div>
                                        <div className="p-4">
                                            <h5 className="artist-card-title">
                                                {spectacle.title}
                                            </h5>
                                            <p className="info-value">
                                                <i className="fas fa-calendar me-1 text-warning"></i>
                                                {new Date(spectacle.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            {spectacle.location && (
                                                <p className="info-value">
                                                    <i className="fas fa-map-marker-alt me-1 text-warning"></i>
                                                    {spectacle.location}
                                                </p>
                                            )}
                                            <span className="count-badge">
                                                {spectacle.price} €
                                            </span>
                                            {spectacle.artist && (
                                                <p className="info-value">
                                                    <i className="fas fa-user me-1 text-warning"></i>
                                                    {spectacle.artist.name}
                                                </p>
                                            )}
                                            {spectacle.description && (
                                                <p className="text-description mt-2">
                                                    {spectacle.description.substring(0, 80)}
                                                    {spectacle.description.length > 80 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2 px-4 pb-4 card-footer-actions">
                                            <Link to={`/spectacles/${spectacle.id}`}
                                                className="btn btn-sm btn-dark text-warning btn-admin">
                                                <i className="fas fa-eye me-1"></i>Voir
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SpectacleList;