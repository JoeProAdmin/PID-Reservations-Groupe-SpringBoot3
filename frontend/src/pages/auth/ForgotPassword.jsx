import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!email) {
      setError(t("forgot.emailRequired"));
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
            throw new Error(text || t("forgot.success"));
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message || t("forgot.success"));
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
        title={t("forgot.title")}
        subtitle={t("forgot.subtitle")}
        breadcrumb={[
          { label: t("paySuccess.home"), path: "/" },
          { label: t("forgot.title") },
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
                  <SectionLabel icon="envelope" text={t("forgot.section")} />

                  <p className="text-description mb-3">{t("forgot.intro")}</p>

                  <div className="mb-3">
                    <label className="agency-label">{t("common.email")}</label>
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
                        {t("forgot.loading")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        {t("forgot.submit")}
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
                      {t("forgot.back")}
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
