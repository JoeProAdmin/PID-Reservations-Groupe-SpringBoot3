import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const SpectacleDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [representations, setRepresentations] = useState([]);
    const [cartMessage, setCartMessage] = useState(null);
    const [spectacle, setSpectacle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/spectacles/${id}`).then(res => res.json()),
            fetch(`${API_URL}/api/representations/spectacle/${id}`).then(res => res.json())
        ])
            .then(([spectacleData, representationsData]) => {
                setSpectacle(spectacleData);
                setRepresentations(Array.isArray(representationsData) ? representationsData : []);
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 pt-5 text-center text-danger">{error}</div>;

    const addToCart = (representation) => {
        if (!token) {
            setCartMessage({ type: 'error', text: 'Connectez-vous pour réserver !' });
            return;
        }
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const exists = cart.find(item => item.representationId === representation.id);
        if (exists) {
            setCartMessage({ type: 'error', text: 'Déjà dans votre panier !' });
            return;
        }
        cart.push({
            representationId: representation.id,
            spectacleTitle: spectacle.title,
            dateHeure: representation.dateHeure,
            placesDisponibles: representation.placesDisponibles,
            price: spectacle.price,
            numberOfSeats: 1
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartMessage({ type: 'success', text: 'Ajouté au panier !' });
        setTimeout(() => setCartMessage(null), 3000);
    };
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
                                    {cartMessage && (
                                        <div className={cartMessage.type === 'success' ? 'alert-success-custom mb-4' : 'alert-error mb-4'}>
                                            <i className={`fas fa-${cartMessage.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                                            {cartMessage.text}
                                        </div>
                                    )}
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
                                    <SectionLabel icon="calendar" text="Représentations disponibles" />

                                    {representations.length === 0 ? (
                                        <p style={{ fontFamily: 'Roboto Slab, serif', color: '#adb5bd', fontSize: '0.9rem' }}>
                                            Aucune représentation disponible.
                                        </p>
                                    ) : (
                                        <div className="row g-3">
                                            {representations.map(rep => (
                                                <div className="col-md-6" key={rep.id}>
                                                    <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', padding: '1rem', background: '#fafafa' }}>
                                                        <p className="info-label">Date et heure</p>
                                                        <p className="info-value" style={{ fontSize: '0.9rem' }}>
                                                            {new Date(rep.dateHeure).toLocaleDateString('fr-FR', {
                                                                day: 'numeric', month: 'long', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                        <p className="info-label mt-2">Places disponibles</p>
                                                        <p className="info-value" style={{ fontSize: '0.9rem' }}>
                                                            <span style={{ color: rep.placesDisponibles > 10 ? '#28a745' : rep.placesDisponibles > 0 ? '#ffc107' : '#dc3545' }}>
                                                                {rep.placesDisponibles > 0 ? `${rep.placesDisponibles} places` : 'Complet'}
                                                            </span>
                                                        </p>
                                                        <button onClick={() => addToCart(rep)}
                                                            disabled={rep.placesDisponibles === 0}
                                                            className="btn btn-primary btn-sm text-uppercase w-100 mt-2"
                                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                                            <i className="fas fa-shopping-cart me-2"></i>
                                                            {rep.placesDisponibles === 0 ? 'Complet' : 'Ajouter au panier'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
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