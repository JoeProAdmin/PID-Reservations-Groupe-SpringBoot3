import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';

const ArtistCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '', genre: '', country: '', description: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.name || !formData.genre) {
            setError('Le nom et le genre sont obligatoires.');
            return;
        }
        setLoading(true);
        fetch('http://localhost:8080/api/artists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => { if (!res.ok) throw new Error('Erreur serveur'); return res.json(); })
        .then(() => navigate('/'))
        .catch(err => { setError(err.message); setLoading(false); });
    };

    return (
        <>
            <PageHeader
                title="Ajouter un artiste"
                subtitle="Remplissez le formulaire ci-dessous."
                breadcrumb={[
                    { label: 'Artistes', path: '/' },
                    { label: 'Nouvel artiste' }
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
                                                placeholder="Ex: Miles Davis"
                                                value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Genre *</label>
                                            <input type="text" id="genre" className="form-control"
                                                placeholder="Ex: Jazz, Rock..."
                                                value={formData.genre} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="agency-label">Pays</label>
                                        <input type="text" id="country" className="form-control"
                                            placeholder="Ex: France"
                                            value={formData.country} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="file-alt" text="Biographie" />

                                    <label className="agency-label">Description</label>
                                    <textarea id="description" className="form-control"
                                        rows="5" maxLength="1000"
                                        placeholder="Décrivez l'artiste..."
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
                                                : <><i className="fas fa-plus me-2"></i>Créer l'artiste</>
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

export default ArtistCreate;