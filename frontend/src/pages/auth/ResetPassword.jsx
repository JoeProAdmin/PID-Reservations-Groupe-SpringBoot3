import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      setError(t("reset.tokenMissing"));
      return;
    }
    if (!formData.newPassword || !formData.confirmPassword) {
      setError(t("reset.bothRequired"));
      return;
    }
    if (formData.newPassword.length < 6) {
      setError(t("reset.minChars"));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("reset.noMatch"));
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
          throw new Error(data.error || t("reset.success"));
        }
        setSuccess(data.message || t("reset.success"));
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
        title={t("reset.title")}
        subtitle={t("reset.subtitle")}
        breadcrumb={[
          { label: t("paySuccess.home"), path: "/" },
          { label: t("reset.section") },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              {!token && (
                <div className="alert-error">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {t("reset.tokenMissing")}
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
                  {success} {t("reset.redirecting")}
                </div>
              )}

              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="key" text={t("reset.section")} />

                  <div className="mb-3">
                    <label className="agency-label">{t("reset.newPassword")}</label>
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
                    <label className="agency-label">{t("reset.confirmPassword")}</label>
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
                        {t("reset.loading")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        {t("reset.submit")}
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
                      {t("reset.back")}
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
