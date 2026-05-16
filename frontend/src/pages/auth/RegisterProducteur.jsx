import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import API_URL from "../../config";

// Pattern mot de passe : min 6 caracteres, au moins une majuscule, au moins un caractere special
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]).{6,}$/;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
];

const RegisterProducteur = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    language: "fr",
  });

  const [validation, setValidation] = useState({
    login: { valid: null, message: "", checking: false },
    password: { valid: null, message: "" },
    confirmPassword: { valid: null, message: "" },
    firstName: { valid: null, message: "" },
    lastName: { valid: null, message: "" },
    email: { valid: null, message: "", checking: false },
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  // ============ Validations synchrones ============
  useEffect(() => {
    const login = formData.login.trim();
    if (login === "") {
      setValidation((v) => ({ ...v, login: { valid: null, message: "", checking: false } }));
    } else if (login.length < 3) {
      setValidation((v) => ({ ...v, login: { valid: false, message: "Au moins 3 caractères", checking: false } }));
    }
  }, [formData.login]);

  useEffect(() => {
    const pwd = formData.password;
    if (pwd === "") {
      setValidation((v) => ({ ...v, password: { valid: null, message: "" } }));
    } else if (pwd.length < 6) {
      setValidation((v) => ({ ...v, password: { valid: false, message: "Au moins 6 caractères" } }));
    } else if (!/[A-Z]/.test(pwd)) {
      setValidation((v) => ({ ...v, password: { valid: false, message: "Au moins une majuscule" } }));
    } else if (!/[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]/.test(pwd)) {
      setValidation((v) => ({ ...v, password: { valid: false, message: "Au moins un caractère spécial" } }));
    } else if (!PASSWORD_PATTERN.test(pwd)) {
      setValidation((v) => ({ ...v, password: { valid: false, message: "Format invalide" } }));
    } else {
      setValidation((v) => ({ ...v, password: { valid: true, message: "Mot de passe valide" } }));
    }
  }, [formData.password]);

  useEffect(() => {
    if (formData.confirmPassword === "") {
      setValidation((v) => ({ ...v, confirmPassword: { valid: null, message: "" } }));
    } else if (formData.confirmPassword !== formData.password) {
      setValidation((v) => ({ ...v, confirmPassword: { valid: false, message: "Les mots de passe ne correspondent pas" } }));
    } else {
      setValidation((v) => ({ ...v, confirmPassword: { valid: true, message: "Les mots de passe correspondent" } }));
    }
  }, [formData.confirmPassword, formData.password]);

  useEffect(() => {
    setValidation((v) => ({
      ...v,
      firstName: formData.firstName.trim() === ""
        ? { valid: null, message: "" }
        : { valid: true, message: "" },
    }));
  }, [formData.firstName]);

  useEffect(() => {
    setValidation((v) => ({
      ...v,
      lastName: formData.lastName.trim() === ""
        ? { valid: null, message: "" }
        : { valid: true, message: "" },
    }));
  }, [formData.lastName]);

  // ============ Validations asynchrones (debounce 500ms) ============
  useEffect(() => {
    const login = formData.login.trim();
    if (login.length < 3) return;

    setValidation((v) => ({ ...v, login: { ...v.login, checking: true } }));

    const t = setTimeout(() => {
      fetch(`${API_URL}/api/auth/check-login?login=${encodeURIComponent(login)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.available) {
            setValidation((v) => ({ ...v, login: { valid: true, message: "Login disponible", checking: false } }));
          } else {
            setValidation((v) => ({ ...v, login: { valid: false, message: "Login déjà pris", checking: false } }));
          }
        })
        .catch(() => {
          setValidation((v) => ({ ...v, login: { valid: null, message: "Vérification impossible", checking: false } }));
        });
    }, 500);

    return () => clearTimeout(t);
  }, [formData.login]);

  useEffect(() => {
    const email = formData.email.trim().toLowerCase();
    if (email === "") {
      setValidation((v) => ({ ...v, email: { valid: null, message: "", checking: false } }));
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setValidation((v) => ({ ...v, email: { valid: false, message: "Format email invalide", checking: false } }));
      return;
    }

    setValidation((v) => ({ ...v, email: { ...v.email, checking: true } }));

    const t = setTimeout(() => {
      fetch(`${API_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.available) {
            setValidation((v) => ({ ...v, email: { valid: true, message: "Email disponible", checking: false } }));
          } else {
            setValidation((v) => ({ ...v, email: { valid: false, message: "Email déjà utilisé", checking: false } }));
          }
        })
        .catch(() => {
          setValidation((v) => ({ ...v, email: { valid: null, message: "Vérification impossible", checking: false } }));
        });
    }, 500);

    return () => clearTimeout(t);
  }, [formData.email]);

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

    fetch(`${API_URL}/api/auth/register-producteur`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        if (!ok) throw new Error(body.error || body.message || "Erreur");
        setSuccess(body.message || "Demande envoyée. Un administrateur va valider votre compte.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 3500);
      })
      .catch((err) => {
        setSubmitError(err.message);
        setLoading(false);
      });
  };

  // Composant : message de validation sous l'input
  const FieldFeedback = ({ state }) => {
    if (state.checking) {
      return (
        <small style={{ color: "#6c757d", fontSize: "0.8rem" }}>
          <span className="spinner-border spinner-border-sm me-1" style={{ width: "0.8rem", height: "0.8rem" }}></span>
          Vérification...
        </small>
      );
    }
    if (state.valid === true && state.message) {
      return (
        <small style={{ color: "#198754", fontSize: "0.8rem", fontWeight: 600 }}>
          <i className="fas fa-check-circle me-1"></i>{state.message}
        </small>
      );
    }
    if (state.valid === false && state.message) {
      return (
        <small style={{ color: "#dc3545", fontSize: "0.8rem", fontWeight: 600 }}>
          <i className="fas fa-exclamation-circle me-1"></i>{state.message}
        </small>
      );
    }
    return null;
  };

  const inputBorderColor = (state) => {
    if (state.valid === true) return "#198754";
    if (state.valid === false) return "#dc3545";
    return "#ced4da";
  };

  return (
    <>
      <PageHeader
        title="Inscription Producteur"
        subtitle="Demandez l'accès à votre espace producteur."
        breadcrumb={[
          { label: "Accueil", path: "/" },
          { label: "Inscription producteur" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">

              {submitError && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {submitError}
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <div className="agency-card">
                <div className="card-accent" style={{ background: "#6f42c1" }}></div>
                <div className="card-content">
                  <SectionLabel icon="briefcase" text="Espace producteur" />

                  <div
                    className="mb-3 p-3"
                    style={{
                      background: "#f8f9fa",
                      borderLeft: "4px solid #6f42c1",
                    }}
                  >
                    <p className="info-label mb-1">
                      <i className="fas fa-info-circle me-2 text-warning"></i>
                      Compte producteur
                    </p>
                    <p className="text-description mb-0">
                      Le compte producteur vous permet de créer vos propres
                      spectacles, suivre les statistiques (réservations, revenus,
                      taux de remplissage) et modérer les commentaires de votre
                      catalogue. Votre demande sera validée par un
                      administrateur.
                    </p>
                  </div>

                  <SectionLabel icon="user-plus" text="Identifiants" />

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="agency-label">Login *</label>
                      <input
                        type="text"
                        id="login"
                        className="form-control"
                        placeholder="ex: ma.boite"
                        value={formData.login}
                        onChange={handleChange}
                        style={{ borderColor: inputBorderColor(validation.login) }}
                      />
                      <FieldFeedback state={validation.login} />
                    </div>
                    <div className="col-md-6">
                      <label className="agency-label">Email professionnel *</label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="contact@maboite.com"
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
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={{ borderColor: inputBorderColor(validation.firstName) }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="agency-label">Nom *</label>
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
                  <SectionLabel icon="lock" text="Sécurité" />

                  <div className="mb-3">
                    <label className="agency-label">Mot de passe *</label>
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
                    <small className="d-block text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                      Min 6 caractères, au moins une majuscule et un caractère spécial
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="agency-label">Confirmer le mot de passe *</label>
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

                  <button
                    onClick={handleSubmit}
                    disabled={!allValid || loading || success}
                    className="btn btn-primary btn-xl text-uppercase w-100"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      opacity: allValid ? 1 : 0.5,
                      cursor: allValid ? "pointer" : "not-allowed",
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Envoi de la demande...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-briefcase me-2"></i>
                        Demander un compte producteur
                      </>
                    )}
                  </button>

                  {!allValid && (
                    <p className="text-center mt-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      <i className="fas fa-info-circle me-1"></i>
                      Tous les champs doivent être valides pour activer le bouton
                    </p>
                  )}

                  <p
                    className="text-center mt-3"
                    style={{
                      fontFamily: "Roboto Slab, serif",
                      fontSize: "0.9rem",
                      color: "#6c757d",
                    }}
                  >
                    Compte standard ?{" "}
                    <Link
                      to="/register"
                      style={{ color: "#fec810", fontWeight: 700 }}
                    >
                      Inscription utilisateur
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

export default RegisterProducteur;
