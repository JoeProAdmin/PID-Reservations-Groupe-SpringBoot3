import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import API_URL from "../../config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = () => {
    if (!token) {
      setError("Lien invalide : token manquant.");
      return;
    }
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Les deux champs sont obligatoires.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: formData.newPassword,
      }),
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.error || "Erreur lors de la réinitialisation");
        }
        setSuccess(data.message || "Mot de passe réinitialisé avec succès.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <PageHeader
        title="Nouveau mot de passe"
        subtitle="Choisissez un nouveau mot de passe sécurisé."
        breadcrumb={[
          { label: "Accueil", path: "/" },
          { label: "Réinitialisation" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              {!token && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Lien invalide : aucun token fourni.
                </div>
              )}
              {error && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  {success} Redirection vers la connexion...
                </div>
              )}

              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="key" text="Nouveau mot de passe" />

                  <div className="mb-3">
                    <label className="agency-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={!token || success}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="agency-label">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={!token || success}
                    />
                  </div>

                  <hr className="agency-divider" />

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !token || success}
                    className="btn btn-primary btn-xl text-uppercase w-100"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Valider le nouveau mot de passe
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

export default ResetPassword;
