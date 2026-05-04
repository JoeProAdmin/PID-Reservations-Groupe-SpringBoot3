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
                        <Link to="/spectacles/create" className="btn btn-primary text-uppercase"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                            <i className="fas fa-plus me-2"></i>Nouveau spectacle
                        </Link>
                        )}
                    </div>

                    {spectacles.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-theater-masks fa-3x text-muted mb-3"></i>
                            <p style={{ fontFamily: 'Roboto Slab, serif', color: '#adb5bd' }}>
                                Aucun spectacle disponible.
                            </p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {spectacles.map(spectacle => (
                                <div className="col-lg-4 col-md-6" key={spectacle.id}>
                                    <div className="artist-card">
                                        <div style={{ height: '5px', background: '#fec810' }}></div>
                                        <div className="p-4">
                                            <h5 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>
                                                {spectacle.title}
                                            </h5>
                                            <p style={{ fontFamily: 'Roboto Slab, serif', color: '#6c757d', fontSize: '0.85rem' }}>
                                                <i className="fas fa-calendar me-1 text-warning"></i>
                                                {new Date(spectacle.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            {spectacle.location && (
                                                <p style={{ fontFamily: 'Roboto Slab, serif', color: '#6c757d', fontSize: '0.85rem' }}>
                                                    <i className="fas fa-map-marker-alt me-1 text-warning"></i>
                                                    {spectacle.location}
                                                </p>
                                            )}
                                            <span className="count-badge">
                                                {spectacle.price} €
                                            </span>
                                            {spectacle.description && (
                                                <p className="mt-2" style={{ fontFamily: 'Roboto Slab, serif', color: '#495057', fontSize: '0.85rem' }}>
                                                    {spectacle.description.substring(0, 80)}
                                                    {spectacle.description.length > 80 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2 px-4 pb-4" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                                            <Link to={`/spectacles/${spectacle.id}`}
                                                className="btn btn-sm btn-dark text-warning"
                                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                                <i className="fas fa-eye me-1"></i>Voir
                                            </Link>

                                            {role === 'ROLE_ADMIN' && (
                                            <Link to={`/spectacles/${spectacle.id}/edit`}
                                                className="btn btn-sm btn-warning"
                                                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                                <i className="fas fa-pen me-1"></i>Modifier
                                            </Link>
                                            )}
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