import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nom: '', prenom: '', email: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.nom || !formData.prenom || !formData.email || !formData.password) {
            setError('Tous les champs sont obligatoires.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Email invalide.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: formData.prenom,
                lastName: formData.nom,
                email: formData.email,
                password: formData.password,
                role: 'ROLE_USER'
            })
        })
        .then(res => {
            if (!res.ok) return res.text().then(text => { throw new Error(text); });
            return res.text();
        })
        .then(() => navigate('/login'))
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    return (
        <>
            <PageHeader
                title="Inscription"
                subtitle="Créez votre compte."
                breadcrumb={[
                    { label: 'Accueil', path: '/' },
                    { label: 'Inscription' }
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

                                    <SectionLabel icon="user-plus" text="Informations personnelles" />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Nom *</label>
                                            <input type="text" id="nom" className="form-control"
                                                placeholder="Dupont"
                                                value={formData.nom} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Prénom *</label>
                                            <input type="text" id="prenom" className="form-control"
                                                placeholder="Jean"
                                                value={formData.prenom} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Email *</label>
                                        <input type="email" id="email" className="form-control"
                                            placeholder="votre@email.com"
                                            value={formData.email} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="lock" text="Sécurité" />

                                    <div className="mb-3">
                                        <label className="agency-label">Mot de passe *</label>
                                        <input type="password" id="password" className="form-control"
                                            placeholder="••••••••"
                                            value={formData.password} onChange={handleChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Confirmer le mot de passe *</label>
                                        <input type="password" id="confirmPassword" className="form-control"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />

                                    <button onClick={handleSubmit} disabled={loading}
                                        className="btn btn-primary btn-xl text-uppercase w-100"
                                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                                        {loading
                                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Inscription...</>
                                            : <><i className="fas fa-user-plus me-2"></i>Créer mon compte</>
                                        }
                                    </button>

                                    <p className="text-center mt-3" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.9rem', color: '#6c757d' }}>
                                        Déjà un compte ?{' '}
                                        <Link to="/login" style={{ color: '#fec810', fontWeight: 700 }}>
                                            Se connecter
                                        </Link>
                                    </p>
                                    <p className="text-center" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.85rem', color: '#6c757d' }}>
                                        <i className="fas fa-briefcase me-1"></i>
                                        Vous êtes une organisation ?{' '}
                                        <Link to="/register-producteur" style={{ color: '#6f42c1', fontWeight: 700 }}>
                                            Inscription producteur
                                        </Link>
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;