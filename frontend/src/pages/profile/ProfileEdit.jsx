import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import API_URL from '../../config';

// Pattern mot de passe : min 6 caracteres, au moins une majuscule, au moins un caractere special
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]).{6,}$/;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'nl', label: 'Nederlands' },
];

const ProfileEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, userId } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Valeurs initiales (pour comparer si le champ a change)
    const [initial, setInitial] = useState({ login: '', email: '' });

    const [formData, setFormData] = useState({
        login: '',
        firstName: '',
        lastName: '',
        email: '',
        language: 'fr',
        password: '',
        confirmPassword: '',
    });

    const [validation, setValidation] = useState({
        login: { valid: true, message: '', checking: false },
        firstName: { valid: true, message: '' },
        lastName: { valid: true, message: '' },
        email: { valid: true, message: '', checking: false },
        password: { valid: true, message: '' },
        confirmPassword: { valid: true, message: '' },
    });

    // ============ Charger les donnees initiales ============
    useEffect(() => {
        if (String(userId) !== String(id)) {
            navigate('/');
            return;
        }

        fetch(`${API_URL}/api/users/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const loadedLogin = data.login || '';
                const loadedEmail = data.email || '';
                setFormData({
                    login: loadedLogin,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: loadedEmail,
                    language: data.language || 'fr',
                    password: '',
                    confirmPassword: '',
                });
                setInitial({ login: loadedLogin, email: loadedEmail });
                setLoading(false);
            })
            .catch(err => { setSubmitError(err.message); setLoading(false); });
    }, [id, token, userId, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    // ============ Validations synchrones ============
    useEffect(() => {
        const login = formData.login.trim();
        if (login === '') {
            setValidation((v) => ({ ...v, login: { valid: false, message: 'Login obligatoire', checking: false } }));
        } else if (login.length < 3) {
            setValidation((v) => ({ ...v, login: { valid: false, message: 'Au moins 3 caractères', checking: false } }));
        } else if (login === initial.login) {
            // login inchange => considere comme valide sans appel backend
            setValidation((v) => ({ ...v, login: { valid: true, message: '', checking: false } }));
        }
    }, [formData.login, initial.login]);

    useEffect(() => {
        const pwd = formData.password;
        if (pwd === '') {
            // Mot de passe vide = on garde l'actuel = OK
            setValidation((v) => ({ ...v, password: { valid: true, message: '' } }));
        } else if (pwd.length < 6) {
            setValidation((v) => ({ ...v, password: { valid: false, message: 'Au moins 6 caractères' } }));
        } else if (!/[A-Z]/.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: 'Au moins une majuscule' } }));
        } else if (!/[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]/.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: 'Au moins un caractère spécial' } }));
        } else if (!PASSWORD_PATTERN.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: 'Format invalide' } }));
        } else {
            setValidation((v) => ({ ...v, password: { valid: true, message: 'Nouveau mot de passe valide' } }));
        }
    }, [formData.password]);

    useEffect(() => {
        // Si pas de nouveau mdp, pas besoin de confirmer
        if (formData.password === '') {
            setValidation((v) => ({ ...v, confirmPassword: { valid: true, message: '' } }));
        } else if (formData.confirmPassword === '') {
            setValidation((v) => ({ ...v, confirmPassword: { valid: false, message: 'Confirmation requise' } }));
        } else if (formData.confirmPassword !== formData.password) {
            setValidation((v) => ({ ...v, confirmPassword: { valid: false, message: 'Les mots de passe ne correspondent pas' } }));
        } else {
            setValidation((v) => ({ ...v, confirmPassword: { valid: true, message: 'Les mots de passe correspondent' } }));
        }
    }, [formData.confirmPassword, formData.password]);

    useEffect(() => {
        setValidation((v) => ({
            ...v,
            firstName: formData.firstName.trim() === ''
                ? { valid: false, message: 'Prénom obligatoire' }
                : { valid: true, message: '' },
        }));
    }, [formData.firstName]);

    useEffect(() => {
        setValidation((v) => ({
            ...v,
            lastName: formData.lastName.trim() === ''
                ? { valid: false, message: 'Nom obligatoire' }
                : { valid: true, message: '' },
        }));
    }, [formData.lastName]);

    // ============ Validations asynchrones (debounce 500ms) ============
    // Login : verifier la dispo SI le login a change ET fait au moins 3 chars
    useEffect(() => {
        const login = formData.login.trim();
        if (login.length < 3 || login === initial.login) return;

        setValidation((v) => ({ ...v, login: { ...v.login, checking: true } }));

        const t = setTimeout(() => {
            fetch(`${API_URL}/api/auth/check-login?login=${encodeURIComponent(login)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.available) {
                        setValidation((v) => ({ ...v, login: { valid: true, message: 'Login disponible', checking: false } }));
                    } else {
                        setValidation((v) => ({ ...v, login: { valid: false, message: 'Login déjà pris', checking: false } }));
                    }
                })
                .catch(() => {
                    setValidation((v) => ({ ...v, login: { valid: null, message: 'Vérification impossible', checking: false } }));
                });
        }, 500);

        return () => clearTimeout(t);
    }, [formData.login, initial.login]);

    // Email : format + dispo SI change
    useEffect(() => {
        const email = formData.email.trim().toLowerCase();
        if (email === '') {
            setValidation((v) => ({ ...v, email: { valid: false, message: 'Email obligatoire', checking: false } }));
            return;
        }
        if (!EMAIL_PATTERN.test(email)) {
            setValidation((v) => ({ ...v, email: { valid: false, message: 'Format email invalide', checking: false } }));
            return;
        }
        if (email === initial.email) {
            setValidation((v) => ({ ...v, email: { valid: true, message: '', checking: false } }));
            return;
        }

        setValidation((v) => ({ ...v, email: { ...v.email, checking: true } }));

        const t = setTimeout(() => {
            fetch(`${API_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.available) {
                        setValidation((v) => ({ ...v, email: { valid: true, message: 'Email disponible', checking: false } }));
                    } else {
                        setValidation((v) => ({ ...v, email: { valid: false, message: 'Email déjà utilisé', checking: false } }));
                    }
                })
                .catch(() => {
                    setValidation((v) => ({ ...v, email: { valid: null, message: 'Vérification impossible', checking: false } }));
                });
        }, 500);

        return () => clearTimeout(t);
    }, [formData.email, initial.email]);

    const allValid =
        validation.login.valid === true &&
        validation.firstName.valid === true &&
        validation.lastName.valid === true &&
        validation.email.valid === true &&
        validation.password.valid === true &&
        validation.confirmPassword.valid === true;

    const handleSubmit = () => {
        if (!allValid) return;
        setSaving(true);
        setSubmitError(null);

        const body = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            login: formData.login.trim(),
            language: formData.language,
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
            body: JSON.stringify(body),
        })
            .then(res => res.text().then(text => {
                let parsed;
                try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = { error: text }; }
                return { ok: res.ok, body: parsed };
            }))
            .then(({ ok, body }) => {
                if (!ok) throw new Error(body.error || body.message || 'Erreur lors de la mise à jour');
                navigate(`/profile/${id}`);
            })
            .catch(err => { setSubmitError(err.message); setSaving(false); });
    };

    // ============ Helpers UI ============
    const FieldFeedback = ({ state }) => {
        if (state.checking) {
            return (
                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                    <span className="spinner-border spinner-border-sm me-1" style={{ width: '0.8rem', height: '0.8rem' }}></span>
                    Vérification...
                </small>
            );
        }
        if (state.valid === true && state.message) {
            return (
                <small style={{ color: '#198754', fontSize: '0.8rem', fontWeight: 600 }}>
                    <i className="fas fa-check-circle me-1"></i>{state.message}
                </small>
            );
        }
        if (state.valid === false && state.message) {
            return (
                <small style={{ color: '#dc3545', fontSize: '0.8rem', fontWeight: 600 }}>
                    <i className="fas fa-exclamation-circle me-1"></i>{state.message}
                </small>
            );
        }
        return null;
    };

    const inputBorderColor = (state) => {
        if (state.valid === false) return '#dc3545';
        if (state.valid === true && state.message) return '#198754';
        return '#ced4da';
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
                        <div className="col-lg-7">

                            {submitError && (
                                <div className="alert-error">
                                    <i className="fas fa-exclamation-circle me-2"></i>{submitError}
                                </div>
                            )}

                            <div className="agency-card">
                                <div className="card-accent"></div>
                                <div className="card-content">

                                    <SectionLabel icon="user-plus" text="Identifiants" />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Login *</label>
                                            <input
                                                type="text"
                                                id="login"
                                                className="form-control"
                                                value={formData.login}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.login) }}
                                            />
                                            <FieldFeedback state={validation.login} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.email) }}
                                            />
                                            <FieldFeedback state={validation.email} />
                                        </div>
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="user" text="Informations personnelles" />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">Prénom *</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                className="form-control"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.firstName) }}
                                            />
                                            <FieldFeedback state={validation.firstName} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">Nom *</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                className="form-control"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.lastName) }}
                                            />
                                            <FieldFeedback state={validation.lastName} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">Langue *</label>
                                        <select
                                            id="language"
                                            className="form-select"
                                            value={formData.language}
                                            onChange={handleChange}
                                        >
                                            {LANGUAGES.map((l) => (
                                                <option key={l.code} value={l.code}>{l.label}</option>
                                            ))}
                                        </select>
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
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ borderColor: inputBorderColor(validation.password) }}
                                        />
                                        <FieldFeedback state={validation.password} />
                                        {formData.password && (
                                            <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                                Min 6 caractères, au moins une majuscule et un caractère spécial
                                            </small>
                                        )}
                                    </div>

                                    {formData.password && (
                                        <div className="mb-3">
                                            <label className="agency-label">Confirmer le nouveau mot de passe *</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="form-control"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.confirmPassword) }}
                                            />
                                            <FieldFeedback state={validation.confirmPassword} />
                                        </div>
                                    )}

                                    <hr className="agency-divider" />

                                    <div className="d-flex justify-content-between align-items-center">
                                        <button onClick={() => navigate(`/profile/${id}`)} className="btn-cancel">
                                            <i className="fas fa-arrow-left me-2"></i>Annuler
                                        </button>
                                        <button onClick={handleSubmit} disabled={!allValid || saving}
                                            className="btn btn-primary btn-xl text-uppercase"
                                            style={{
                                                fontFamily: 'Montserrat, sans-serif',
                                                fontWeight: 700,
                                                opacity: allValid ? 1 : 0.5,
                                                cursor: allValid ? 'pointer' : 'not-allowed',
                                            }}>
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
