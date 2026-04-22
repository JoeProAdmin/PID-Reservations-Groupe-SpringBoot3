import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const SpectacleDetail = () => {
    const { id } = useParams();
    const [spectacle, setSpectacle] = useState(null);
    const [representations, setRepresentations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [representationError, setRepresentationError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/spectacles/${id}`)
            .then(res => { if (!res.ok) throw new Error('Spectacle introuvable'); return res.json(); })
            .then(data => { setSpectacle(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });

        fetch(`${API_URL}/api/representations/spectacle/${id}`)
            .then(res => { if (!res.ok) throw new Error('Representations indisponibles'); return res.json(); })
            .then(data => setRepresentations(Array.isArray(data) ? data : []))
            .catch(err => setRepresentationError(err.message));
    }, [id]);

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 pt-5 text-center text-danger">{error}</div>;

    return (
        <>
            <PageHeader
                title={spectacle.title}
                subtitle={spectacle.location}
                breadcrumb={[
                    { label: 'Spectacles', path: '/' },
                    { label: spectacle.title }
                ]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="theater-masks" text="Informations" />
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-3">
                                            <p className="info-label">Titre</p>
                                            <p className="info-value">{spectacle.title}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="info-label">Date</p>
                                            <p className="info-value">
                                                {new Date(spectacle.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="info-label">Lieu</p>
                                            <p className="info-value">{spectacle.location || 'Non renseigné'}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="info-label">Prix</p>
                                            <p className="info-value">{spectacle.price} €</p>
                                        </div>
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="file-alt" text="Description" />
                                    <p style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.95rem', color: '#495057', lineHeight: 1.8 }}>
                                        {spectacle.description || 'Aucune description disponible.'}
                                    </p>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="calendar-alt" text="Representations" />
                                    {representationError && (
                                        <p className="text-danger">{representationError}</p>
                                    )}
                                    {!representationError && representations.length === 0 && (
                                        <p className="text-muted">Aucune representation disponible pour ce spectacle.</p>
                                    )}
                                    {!representationError && representations.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="table align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Places disponibles</th>
                                                        <th>Statut</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {representations.map(representation => (
                                                        <tr key={representation.id}>
                                                            <td>
                                                                {new Date(representation.dateHeure).toLocaleString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </td>
                                                            <td>{representation.placesDisponibles}</td>
                                                            <td>{representation.placesDisponibles > 0 ? 'Disponible' : 'Complet'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <hr className="agency-divider" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/" className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Retour
                                        </Link>
                                        <Link to={`/spectacles/${spectacle.id}/edit`}
                                            className="btn btn-warning text-uppercase"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                                            <i className="fas fa-pen me-2"></i>Modifier
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SpectacleDetail;
