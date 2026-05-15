import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import API_URL from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!email) {
      setError("Veuillez saisir votre email.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || "Erreur lors de la demande");
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessage(
          data.message ||
            "Si cette adresse est connue, un email de réinitialisation a été envoyé."
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <PageHeader
        title="Mot de passe oublié"
        subtitle="Recevez un lien de réinitialisation par email."
        breadcrumb={[
          { label: "Accueil", path: "/" },
          { label: "Mot de passe oublié" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              {error && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              {message && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  {message}
                </div>
              )}

              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="envelope" text="Réinitialisation" />

                  <p className="text-description mb-3">
                    Entrez l'adresse email de votre compte. Nous vous enverrons
                    un lien pour choisir un nouveau mot de passe.
                  </p>

                  <div className="mb-3">
                    <label className="agency-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <hr className="agency-divider" />

                  <button
                    onClick={handleSubmit}
                    disabled={loading || message}
                    className="btn btn-primary btn-xl text-uppercase w-100"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Envoyer le lien
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
                    <Link
                      to="/login"
                      style={{ color: "#fec810", fontWeight: 700 }}
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Retour à la connexion
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

export default ForgotPassword;
