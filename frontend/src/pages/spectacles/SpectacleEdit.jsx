import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const SpectacleEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', price: ''
    });

    useEffect(() => {
        fetch(`${API_URL}/api/spectacles/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    date: data.date ? data.date.substring(0, 16) : '',
                    location: data.location || '',
                    price: data.price || ''
                });
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.title || !formData.date || !formData.price) {
            setError('Titre, date et prix sont obligatoires.');
            return;
        }
        setSaving(true);
        setError(null);

        fetch(`${API_URL}/api/spectacles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                price: parseFloat(formData.price),
                date: new Date(formData.date).toISOString()
            })
        })
        .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t); }); return res.json(); })
        .then(() => navigate('/'))
        .catch(err => { setError(err.message); setSaving(false); });
    };

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <>
            <PageHeader
                title="Modifier le spectacle"
                subtitle={`Modification de : ${formData.title}`}
                breadcrumb={[
                    { label: 'Spectacles', path: '/' },
                    { label: `Modifier — ${formData.title}` }
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
                                                value={formData.title} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Lieu</label>
                                            <input type="text" id="location" className="form-control"
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
                                                min="0" step="0.01"
                                                value={formData.price} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="file-alt" text="Description" />

                                    <textarea id="description" className="form-control"
                                        rows="5" maxLength="1000"
                                        value={formData.description} onChange={handleChange} />
                                    <div className="char-count">{formData.description.length} / 1000</div>

                                    <hr className="agency-divider" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/" className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Annuler
                                        </Link>
                                        <button onClick={handleSubmit} disabled={saving}
                                            className="btn btn-primary btn-xl text-uppercase"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                                            {saving
                                                ? <><span className="spinner-border spinner-border-sm me-2"></span>Sauvegarde...</>
                                                : <><i className="fas fa-save me-2"></i>Sauvegarder</>
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

export default SpectacleEdit;