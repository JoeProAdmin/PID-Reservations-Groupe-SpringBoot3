import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const SpectacleCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', price: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.title || !formData.date || !formData.price) {
            setError('Titre, date et prix sont obligatoires.');
            return;
        }
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/spectacles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                price: parseFloat(formData.price),
                date: new Date(formData.date).toISOString()
            })
        })
        .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t); }); return res.json(); })
        .then(() => navigate('/'))
        .catch(err => { setError(err.message); setLoading(false); });
    };

    return (
        <>
            <PageHeader
                title="Nouveau spectacle"
                subtitle="Remplissez le formulaire ci-dessous."
                breadcrumb={[
                    { label: 'Spectacles', path: '/' },
                    { label: 'Nouveau spectacle' }
                ]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">

                            {error && (
                                <div className="alert-error">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="theater-masks" text="Informations principales" />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Titre *</label>
                                            <input type="text" id="title" className="form-control"
                                                placeholder="Ex: Le Lac des Cygnes"
                                                value={formData.title} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Lieu</label>
                                            <input type="text" id="location" className="form-control"
                                                placeholder="Ex: Opéra de Paris"
                                                value={formData.location} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Date *</label>
                                            <input type="datetime-local" id="date" className="form-control"
                                                value={formData.date} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Prix (€) *</label>
                                            <input type="number" id="price" className="form-control"
                                                placeholder="Ex: 25.00" min="0" step="0.01"
                                                value={formData.price} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="file-alt" text="Description" />

                                    <textarea id="description" className="form-control"
                                        rows="5" maxLength="1000"
                                        placeholder="Décrivez le spectacle..."
                                        value={formData.description} onChange={handleChange} />
                                    <div className="char-count">{formData.description.length} / 1000</div>

                                    <hr className="agency-divider" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/" className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Annuler
                                        </Link>
                                        <button onClick={handleSubmit} disabled={loading}
                                            className="btn btn-primary btn-xl text-uppercase"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                                                : <><i className="fas fa-plus me-2"></i>Créer le spectacle</>
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

export default SpectacleCreate;