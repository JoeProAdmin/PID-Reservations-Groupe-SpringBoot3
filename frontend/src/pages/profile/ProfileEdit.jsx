import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

const ProfileEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, userId, role } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: ''
    });

    useEffect(() => {
        // Redirige si ce n'est pas son propre profil
        if (String(userId) !== String(id)) {
            navigate('/');
            return;
        }

        fetch(`${API_URL}/api/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                password: ''
            });
            setLoading(false);
        })
        .catch(err => { setError(err.message); setLoading(false); });
    }, [id, token, userId, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Prénom, nom et email sont obligatoires.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Email invalide.');
            return;
        }
        if (formData.password && formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setSaving(true);
        setError(null);

        const body = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: role  // garde le même rôle
        };

        if (formData.password) {
            body.password = formData.password;
        }

        fetch(`${API_URL}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(res => {
            if (!res.ok) return res.text().then(t => { throw new Error(t); });
            return res.json();
        })
        .then(() => navigate(`/profile/${id}`))
        .catch(err => { setError(err.message); setSaving(false); });
    };

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <>
            <PageHeader
                title="Modifier mon profil"
                subtitle="Mettez à jour vos informations personnelles."
                breadcrumb={[
                    { label: 'Accueil', path: '/' },
                    { label: 'Mon profil', path: `/profile/${id}` },
                    { label: 'Modifier' }
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

                                    <SectionLabel icon="user" text="Informations personnelles" />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Prénom *</label>
                                            <input type="text" id="firstName" className="form-control"
                                                value={formData.firstName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Nom *</label>
                                            <input type="text" id="lastName" className="form-control"
                                                value={formData.lastName} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Email *</label>
                                        <input type="email" id="email" className="form-control"
                                            value={formData.email} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="lock" text="Changer le mot de passe" />

                                    <div className="mb-3">
                                        <label className="agency-label">
                                            Nouveau mot de passe
                                            <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.75rem', color: '#adb5bd' }}>
                                                {' '}(laisser vide pour ne pas changer)
                                            </span>
                                        </label>
                                        <input type="password" id="password" className="form-control"
                                            placeholder="••••••••"
                                            value={formData.password} onChange={handleChange} />
                                    </div>

                                    <hr className="agency-divider" />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <button onClick={() => navigate(`/profile/${id}`)} className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Annuler
                                        </button>
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

export default ProfileEdit;