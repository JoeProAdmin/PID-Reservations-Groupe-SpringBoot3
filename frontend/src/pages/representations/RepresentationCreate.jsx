import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const RepresentationCreate = () => {
    const { spectacleId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        dateHeure: '',
        placesDisponibles: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.dateHeure || !formData.placesDisponibles) {
            setError('Tous les champs sont obligatoires.');
            return;
        }
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/representations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dateHeure: new Date(formData.dateHeure).toISOString(),
                placesDisponibles: parseInt(formData.placesDisponibles),
                spectacle: { id: parseInt(spectacleId) }
            })
        })
        .then(res => { if (!res.ok) throw new Error('Erreur serveur'); return res.json(); })
        .then(() => navigate(`/spectacles/${spectacleId}`))
        .catch(err => { setError(err.message); setLoading(false); });
    };

    return (
        <>
            <PageHeader
                title="Ajouter une représentation"
                subtitle="Définissez la date et le nombre de places."
                breadcrumb={[
                    { label: 'Spectacles', path: '/' },
                    { label: 'Représentation' }
                ]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">

                            {error && (
                                <div className="alert-error">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="calendar" text="Détails" />

                                    <div className="mb-3">
                                        <label className="agency-label">Date et heure *</label>
                                        <input type="datetime-local" id="dateHeure" className="form-control"
                                            value={formData.dateHeure} onChange={handleChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Places disponibles *</label>
                                        <input type="number" id="placesDisponibles" className="form-control"
                                            placeholder="Ex: 100" min="1"
                                            value={formData.placesDisponibles} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <button onClick={() => navigate(`/spectacles/${spectacleId}`)} className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Annuler
                                        </button>
                                        <button onClick={handleSubmit} disabled={loading}
                                            className="btn btn-primary btn-xl text-uppercase"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                                                : <><i className="fas fa-plus me-2"></i>Ajouter</>
                                            }
                                        </button>
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

export default RepresentationCreate;