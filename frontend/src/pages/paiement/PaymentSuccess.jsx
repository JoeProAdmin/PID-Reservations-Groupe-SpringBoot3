import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config";
import PageHeader from "../../components/PageHeader";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useLanguage();
  const sessionId = searchParams.get("session_id");
  const reservationId = searchParams.get("reservationId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [methode, setMethode] = useState(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    if (!sessionId) {
      setError(t("paySuccess.sessionMissing"));
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/paiements/confirmer-checkout?sessionId=${sessionId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error || data.status !== "success") {
          setError(data.error || t("paySuccess.confirmFailed"));
        } else {
          setMethode(data.methode);
          if (reservationId) {
            sessionStorage.removeItem(`stripe_checkout_url_${reservationId}`);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(t("paySuccess.confirmFailed") + " " + err.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, reservationId, token]);

  return (
    <>
      <PageHeader
        title={loading ? t("paySuccess.titleLoading") : error ? t("paySuccess.titleError") : t("paySuccess.titleSuccess")}
        subtitle={t("paySuccess.subtitle")}
      />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="agency-card text-center">
                <div
                  className="card-accent"
                  style={{ background: error ? "#dc3545" : "#28a745" }}
                ></div>
                <div className="card-content">
                  {loading ? (
                    <>
                      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
                      <h4 className="mt-3">{t("paySuccess.verifying")}</h4>
                      <p className="text-muted">
                        {t("paySuccess.verifyingDesc")}
                      </p>
                    </>
                  ) : error ? (
                    <>
                      <i
                        className="fas fa-times-circle"
                        style={{ fontSize: "4rem", color: "#dc3545" }}
                      ></i>
                      <h3 className="mt-3 mb-2">{t("paySuccess.errorTitle")}</h3>
                      <p className="text-muted mb-4">{error}</p>
                      <button
                        onClick={() => navigate("/mes-reservations")}
                        className="btn btn-outline-secondary me-2"
                      >
                        <i className="fas fa-ticket-alt me-2"></i>{t("paySuccess.myReservations")}
                      </button>
                      <Link to="/" className="btn btn-primary btn-admin">
                        <i className="fas fa-home me-2"></i>{t("paySuccess.home")}
                      </Link>
                    </>
                  ) : (
                    <>
                      <i
                        className="fas fa-check-circle"
                        style={{ fontSize: "4rem", color: "#28a745" }}
                      ></i>
                      <h3 className="mt-3 mb-2">{t("paySuccess.successTitle")}</h3>
                      <p className="text-muted mb-2">
                        {t("paySuccess.successDesc")}
                      </p>
                      {methode && (
                        <p className="mb-3">
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              backgroundColor: "#d4edda",
                              color: "#155724",
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            <i className="fas fa-check me-1"></i>
                            {t("paySuccess.paidWith")} {methode}
                          </span>
                        </p>
                      )}
                      <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                        <i className="fas fa-envelope me-1 text-warning"></i>
                        {t("paySuccess.receiptSent")}
                      </p>
                      <button
                        onClick={() => navigate("/mes-reservations")}
                        className="btn btn-outline-secondary me-2"
                      >
                        <i className="fas fa-ticket-alt me-2"></i>{t("paySuccess.myReservations")}
                      </button>
                      <Link to="/" className="btn btn-primary btn-admin">
                        <i className="fas fa-home me-2"></i>{t("paySuccess.home")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentSuccess;
