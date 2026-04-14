import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.email || !formData.password) {
            setError('Email et mot de passe obligatoires.');
            return;
        }
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            })
        })
        .then(res => {
            if (!res.ok) return res.text().then(text => { throw new Error(text || 'Email ou mot de passe incorrect'); });
            return res.json();
        })
        .then(data => {
            login(data.token, data.role, data.prenom, data.nom);
            navigate('/');
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    return (
        <>
            <PageHeader
                title="Connexion"
                subtitle="Connectez-vous à votre compte."
                breadcrumb={[
                    { label: 'Accueil', path: '/' },
                    { label: 'Connexion' }
                ]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">

                            {error && (
                                <div className="alert-error">
                                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                                </div>
                            )}

                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="lock" text="Identifiants" />

                                    <div className="mb-3">
                                        <label className="agency-label">Email</label>
                                        <input type="email" id="email" className="form-control"
                                            placeholder="votre@email.com"
                                            value={formData.email} onChange={handleChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Mot de passe</label>
                                        <input type="password" id="password" className="form-control"
                                            placeholder="••••••••"
                                            value={formData.password} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />

                                    <button onClick={handleSubmit} disabled={loading}
                                        className="btn btn-primary btn-xl text-uppercase w-100"
                                        style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
                                        {loading
                                            ? <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
                                            : <><i className="fas fa-sign-in-alt me-2"></i>Se connecter</>
                                        }
                                    </button>

                                    <p className="text-center mt-3" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.9rem', color: '#6c757d' }}>
                                        Pas encore de compte ?{' '}
                                        <Link to="/register" style={{ color: '#fec810', fontWeight: 700 }}>
                                            S'inscrire
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

export default Login;