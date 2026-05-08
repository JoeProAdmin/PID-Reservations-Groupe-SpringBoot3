import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import { useAuth } from '../../context/AuthContext';

const ArtistEdit = () => {
    const { token } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', genre: '', country: '', description: '' });

    useEffect(() => {
        fetch(`http://localhost:8080/api/artists/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData({ name: data.name || '', genre: data.genre || '', country: data.country || '', description: data.description || '' });
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.name || !formData.genre) { setError('Le nom et le genre sont obligatoires.'); return; }
        setSaving(true);
        fetch(`http://localhost:8080/api/artists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`},
            body: JSON.stringify(formData)
        })
        .then(res => { if (!res.ok) throw new Error('Erreur serveur'); return res.json(); })
        .then(() => navigate('/artists'))
        .catch(err => { setError(err.message); setSaving(false); });
    };

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <>
            <PageHeader
                title="Modifier l'artiste"
                subtitle={`Modification de : ${formData.name}`}
                breadcrumb={[
                    { label: 'Artistes', path: '/' },
                    { label: `Modifier — ${formData.name}` }
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

                                    <SectionLabel icon="user" text="Informations principales" />
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Nom *</label>
                                            <input type="text" id="name" className="form-control"
                                                value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Genre *</label>
                                            <input type="text" id="genre" className="form-control"
                                                value={formData.genre} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="agency-label">Pays</label>
                                        <input type="text" id="country" className="form-control"
                                            value={formData.country} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="file-alt" text="Biographie" />

                                    <label className="agency-label">Description</label>
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

export default ArtistEdit;