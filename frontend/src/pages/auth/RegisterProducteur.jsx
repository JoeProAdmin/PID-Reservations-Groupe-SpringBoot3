import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import API_URL from "../../config";

const RegisterProducteur = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = () => {
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.password
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email invalide.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/auth/register-producteur`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) =>
        res.text().then((text) => {
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            data = { message: text };
          }
          return { ok: res.ok, data };
        })
      )
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || data.error || "Erreur");
        setSuccess(
          data.message ||
            "Demande envoyée. Un administrateur va valider votre compte."
        );
        setLoading(false);
        setTimeout(() => navigate("/login"), 3500);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
            <div className="col-lg-6">
              {error && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
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

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="agency-label">Nom *</label>
                      <input
                        type="text"
                        id="nom"
                        className="form-control"
                        placeholder="Dupont"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="agency-label">Prénom *</label>
                      <input
                        type="text"
                        id="prenom"
                        className="form-control"
                        placeholder="Jean"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="agency-label">Email professionnel *</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="contact@maboite.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
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
                    />
                  </div>

                  <div className="mb-3">
                    <label className="agency-label">
                      Confirmer le mot de passe *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <hr className="agency-divider" />

                  <button
                    onClick={handleSubmit}
                    disabled={loading || success}
                    className="btn btn-primary btn-xl text-uppercase w-100"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
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
