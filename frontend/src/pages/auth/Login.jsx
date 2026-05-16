import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import API_URL from "../../config";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, setLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      setError(t("login.emailPwdRequired"));
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }),
    })
      .then((res) =>
        res
          .text()
          .then((text) => {
            let body;
            try {
              body = text ? JSON.parse(text) : {};
            } catch {
              body = { error: text };
            }
            return { ok: res.ok, body };
          })
      )
      .then(({ ok, body }) => {
        if (!ok) {
          throw new Error(
            body.error || body.message || t("login.invalid")
          );
        }
        login(body.token, body.role, body.prenom, body.nom, body.id);
        // Synchronise la langue de l'app avec la langue du compte
        if (body.language) {
          setLang(body.language);
        }
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <PageHeader
        title={t("login.title")}
        subtitle={t("login.subtitle")}
        breadcrumb={[{ label: t("paySuccess.home"), path: "/" }, { label: t("login.title") }]}
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

              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="lock" text={t("login.credentials")} />

                  <div className="mb-3">
                    <label className="agency-label">{t("common.email")}</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder={t("login.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="agency-label">{t("common.password")}</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="text-end mb-2">
                    <Link
                      to="/forgot-password"
                      style={{
                        fontFamily: "Roboto Slab, serif",
                        fontSize: "0.85rem",
                        color: "#fec810",
                        fontWeight: 600,
                      }}
                    >
                      {t("login.forgot")}
                    </Link>
                  </div>

                  <hr className="agency-divider" />

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-primary btn-xl text-uppercase w-100"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {t("login.loading")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>{t("login.submit")}
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
                    {t("login.noAccount")}{" "}
                    <Link
                      to="/register"
                      style={{ color: "#fec810", fontWeight: 700 }}
                    >
                      {t("login.signUp")}
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
