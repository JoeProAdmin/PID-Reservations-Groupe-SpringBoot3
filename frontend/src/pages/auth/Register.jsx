import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SectionLabel from '../../components/SectionLabel';
import { useLanguage } from '../../context/LanguageContext';
import API_URL from '../../config';

// Pattern mot de passe : min 6 caracteres, au moins une majuscule, au moins un caractere special
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]).{6,}$/;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'nl', label: 'Nederlands' },
];

const Register = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [formData, setFormData] = useState({
        login: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        language: 'fr',
    });

    // Etat de chaque champ : { valid: boolean|null, message: string }
    // null = pas encore valide, en cours de saisie ou empty
    const [validation, setValidation] = useState({
        login: { valid: null, message: '', checking: false },
        password: { valid: null, message: '' },
        confirmPassword: { valid: null, message: '' },
        firstName: { valid: null, message: '' },
        lastName: { valid: null, message: '' },
        email: { valid: null, message: '', checking: false },
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.id]: e.target.value });

    // ============ Validations synchrones ============
    useEffect(() => {
        // Login : pas vide + au moins 3 chars (la dispo se verifie en async ci-dessous)
        const login = formData.login.trim();
        if (login === '') {
            setValidation((v) => ({ ...v, login: { valid: null, message: '', checking: false } }));
        } else if (login.length < 3) {
            setValidation((v) => ({ ...v, login: { valid: false, message: t("valid.minChars"), checking: false } }));
        }
    }, [formData.login, t]);

    useEffect(() => {
        const pwd = formData.password;
        if (pwd === '') {
            setValidation((v) => ({ ...v, password: { valid: null, message: '' } }));
        } else if (pwd.length < 6) {
            setValidation((v) => ({ ...v, password: { valid: false, message: t("valid.passwordMin") } }));
        } else if (!/[A-Z]/.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: t("valid.passwordUpper") } }));
        } else if (!/[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]/.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: t("valid.passwordSpecial") } }));
        } else if (!PASSWORD_PATTERN.test(pwd)) {
            setValidation((v) => ({ ...v, password: { valid: false, message: t("valid.passwordSpecial") } }));
        } else {
            setValidation((v) => ({ ...v, password: { valid: true, message: t("valid.passwordValid") } }));
        }
    }, [formData.password, t]);

    useEffect(() => {
        if (formData.confirmPassword === '') {
            setValidation((v) => ({ ...v, confirmPassword: { valid: null, message: '' } }));
        } else if (formData.confirmPassword !== formData.password) {
            setValidation((v) => ({ ...v, confirmPassword: { valid: false, message: t("valid.passwordsNoMatch") } }));
        } else {
            setValidation((v) => ({ ...v, confirmPassword: { valid: true, message: t("valid.passwordsMatch") } }));
        }
    }, [formData.confirmPassword, formData.password, t]);

    useEffect(() => {
        setValidation((v) => ({
            ...v,
            firstName: formData.firstName.trim() === ''
                ? { valid: null, message: '' }
                : { valid: true, message: '' },
        }));
    }, [formData.firstName]);

    useEffect(() => {
        setValidation((v) => ({
            ...v,
            lastName: formData.lastName.trim() === ''
                ? { valid: null, message: '' }
                : { valid: true, message: '' },
        }));
    }, [formData.lastName]);

    // ============ Validations asynchrones (debounce 500ms) ============

    // Login : disponibilite via /api/auth/check-login
    useEffect(() => {
        const login = formData.login.trim();
        if (login.length < 3) return; // deja gere par la validation synchrone

        setValidation((v) => ({ ...v, login: { ...v.login, checking: true } }));

        const t = setTimeout(() => {
            fetch(`${API_URL}/api/auth/check-login?login=${encodeURIComponent(login)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.available) {
                        setValidation((v) => ({ ...v, login: { valid: true, message: t("valid.loginAvailable"), checking: false } }));
                    } else {
                        setValidation((v) => ({ ...v, login: { valid: false, message: t("valid.loginTaken"), checking: false } }));
                    }
                })
                .catch(() => {
                    setValidation((v) => ({ ...v, login: { valid: null, message: t("valid.checkImpossible"), checking: false } }));
                });
        }, 500);

        return () => clearTimeout(t);
    }, [formData.login]);

    // Email : format synchrone + dispo async
    useEffect(() => {
        const email = formData.email.trim().toLowerCase();
        if (email === '') {
            setValidation((v) => ({ ...v, email: { valid: null, message: '', checking: false } }));
            return;
        }
        if (!EMAIL_PATTERN.test(email)) {
            setValidation((v) => ({ ...v, email: { valid: false, message: t("valid.emailFormat"), checking: false } }));
            return;
        }

        setValidation((v) => ({ ...v, email: { ...v.email, checking: true } }));

        const t = setTimeout(() => {
            fetch(`${API_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.available) {
                        setValidation((v) => ({ ...v, email: { valid: true, message: t("valid.emailAvailable"), checking: false } }));
                    } else {
                        setValidation((v) => ({ ...v, email: { valid: false, message: t("valid.emailTaken"), checking: false } }));
                    }
                })
                .catch(() => {
                    setValidation((v) => ({ ...v, email: { valid: null, message: t("valid.checkImpossible"), checking: false } }));
                });
        }, 500);

        return () => clearTimeout(t);
    }, [formData.email]);

    // ============ Bouton activable seulement si tout est valide ============
    const allValid =
        validation.login.valid === true &&
        validation.password.valid === true &&
        validation.confirmPassword.valid === true &&
        validation.firstName.valid === true &&
        validation.lastName.valid === true &&
        validation.email.valid === true;

    const handleSubmit = () => {
        if (!allValid) return;
        setLoading(true);
        setSubmitError(null);

        fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                login: formData.login.trim(),
                language: formData.language,
            }),
        })
            .then((res) =>
                res.text().then((text) => {
                    let body;
                    try { body = text ? JSON.parse(text) : {}; } catch { body = { error: text }; }
                    return { ok: res.ok, body };
                })
            )
            .then(({ ok, body }) => {
                if (!ok) {
                    throw new Error(body.error || body.message || 'Erreur lors de l\'inscription');
                }
                navigate('/login');
            })
            .catch((err) => {
                setSubmitError(err.message);
                setLoading(false);
            });
    };

    // Composant : affiche le message de validation sous un input
    const FieldFeedback = ({ state }) => {
        if (state.checking) {
            return (
                <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                    <span className="spinner-border spinner-border-sm me-1" style={{ width: '0.8rem', height: '0.8rem' }}></span>
                    {t("valid.checking")}
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
        if (state.valid === true) return '#198754';
        if (state.valid === false) return '#dc3545';
        return '#ced4da';
    };

    return (
        <>
            <PageHeader
                title={t("register.title")}
                subtitle={t("register.subtitle")}
                breadcrumb={[
                    { label: t("paySuccess.home"), path: '/' },
                    { label: t("register.title") }
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

                                    <SectionLabel icon="user-plus" text={t("register.credentials")} />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">{t("register.login")} *</label>
                                            <input
                                                type="text"
                                                id="login"
                                                className="form-control"
                                                placeholder={t("register.loginPlaceholder")}
                                                value={formData.login}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.login) }}
                                            />
                                            <FieldFeedback state={validation.login} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">{t("register.email")} *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                placeholder={t("register.emailPlaceholder")}
                                                value={formData.email}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.email) }}
                                            />
                                            <FieldFeedback state={validation.email} />
                                        </div>
                                    </div>

                                    <hr className="agency-divider" />
                                    <SectionLabel icon="user" text={t("register.personal")} />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="agency-label">{t("register.firstName")} *</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                className="form-control"
                                                placeholder="Jean"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.firstName) }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="agency-label">{t("register.lastName")} *</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                className="form-control"
                                                placeholder="Dupont"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                style={{ borderColor: inputBorderColor(validation.lastName) }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">{t("register.language")} *</label>
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
                                    <SectionLabel icon="lock" text={t("register.security")} />

                                    <div className="mb-3">
                                        <label className="agency-label">{t("register.password")} *</label>
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
                                        <small className="d-block text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                            {t("register.passwordHint")}
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="agency-label">{t("register.passwordConfirm")} *</label>
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

                                    <hr className="agency-divider" />

                                    <button onClick={handleSubmit}
                                        disabled={!allValid || loading}
                                        className="btn btn-primary btn-xl text-uppercase w-100"
                                        style={{
                                            fontFamily: 'Montserrat, sans-serif',
                                            fontWeight: 700,
                                            opacity: allValid ? 1 : 0.5,
                                            cursor: allValid ? 'pointer' : 'not-allowed',
                                        }}>
                                        {loading
                                            ? <><span className="spinner-border spinner-border-sm me-2"></span>{t("register.loading")}</>
                                            : <><i className="fas fa-user-plus me-2"></i>{t("register.submit")}</>
                                        }
                                    </button>

                                    {!allValid && (
                                        <p className="text-center mt-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                                            <i className="fas fa-info-circle me-1"></i>
                                            {t("valid.allFieldsRequired")}
                                        </p>
                                    )}

                                    <p className="text-center mt-3" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.9rem', color: '#6c757d' }}>
                                        {t("register.hasAccount")}{' '}
                                        <Link to="/login" style={{ color: '#fec810', fontWeight: 700 }}>
                                            {t("register.signIn")}
                                        </Link>
                                    </p>
                                    <p className="text-center" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '0.85rem', color: '#6c757d' }}>
                                        <i className="fas fa-briefcase me-1"></i>
                                        {t("register.organization")}{' '}
                                        <Link to="/register-producteur" style={{ color: '#6f42c1', fontWeight: 700 }}>
                                            {t("register.producerSignup")}
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
