import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config";

// Memes regles que l'inscription
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]).{6,}$/;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [validation, setValidation] = useState({
    newPassword: { valid: null, message: "" },
    confirmPassword: { valid: null, message: "" },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  // Validation du nouveau mot de passe (memes regles que l'inscription)
  useEffect(() => {
    const pwd = formData.newPassword;
    if (pwd === "") {
      setValidation((v) => ({ ...v, newPassword: { valid: null, message: "" } }));
    } else if (pwd.length < 6) {
      setValidation((v) => ({ ...v, newPassword: { valid: false, message: t("valid.passwordMin") } }));
    } else if (!/[A-Z]/.test(pwd)) {
      setValidation((v) => ({ ...v, newPassword: { valid: false, message: t("valid.passwordUpper") } }));
    } else if (!/[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/\\|`~]/.test(pwd)) {
      setValidation((v) => ({ ...v, newPassword: { valid: false, message: t("valid.passwordSpecial") } }));
    } else if (!PASSWORD_PATTERN.test(pwd)) {
      setValidation((v) => ({ ...v, newPassword: { valid: false, message: t("valid.passwordSpecial") } }));
    } else {
      setValidation((v) => ({ ...v, newPassword: { valid: true, message: t("valid.passwordValid") } }));
    }
  }, [formData.newPassword, t]);

  // Validation de la confirmation
  useEffect(() => {
    if (formData.confirmPassword === "") {
      setValidation((v) => ({ ...v, confirmPassword: { valid: null, message: "" } }));
    } else if (formData.confirmPassword !== formData.newPassword) {
      setValidation((v) => ({ ...v, confirmPassword: { valid: false, message: t("valid.passwordsNoMatch") } }));
    } else {
      setValidation((v) => ({ ...v, confirmPassword: { valid: true, message: t("valid.passwordsMatch") } }));
    }
  }, [formData.confirmPassword, formData.newPassword, t]);

  const allValid =
    validation.newPassword.valid === true &&
    validation.confirmPassword.valid === true;

  const handleSubmit = () => {
    if (!token) {
      setError(t("reset.tokenMissing"));
      return;
    }
    if (!allValid) return;

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
          throw new Error(data.error || data.message || t("reset.success"));
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

  const FieldFeedback = ({ state }) => {
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
                      style={{ borderColor: inputBorderColor(validation.newPassword) }}
                    />
                    <FieldFeedback state={validation.newPassword} />
                    <small className="d-block text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                      {t("register.passwordHint")}
                    </small>
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
                      style={{ borderColor: inputBorderColor(validation.confirmPassword) }}
                    />
                    <FieldFeedback state={validation.confirmPassword} />
                  </div>

                  <hr className="agency-divider" />

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !token || success || !allValid}
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
                        {t("reset.loading")}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        {t("reset.submit")}
                      </>
                    )}
                  </button>

                  {!allValid && token && !success && (
                    <p className="text-center mt-2" style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      <i className="fas fa-info-circle me-1"></i>
                      {t("valid.allFieldsRequired")}
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
