import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import API_URL from "../../config";
import PageHeader from "../../components/PageHeader";

// ================================================
// Page de pre-paiement : recapitulatif + bouton qui
// redirige vers la page hostee par Stripe (Checkout)
// ================================================
const PaymentPage = () => {
  const { reservationId } = useParams();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const { t } = useLanguage();
  const spectacleTitle = searchParams.get("spectacle") || "Spectacle";

  const [montant, setMontant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const fetchedRef = useRef(false);

  // Au chargement, on cree la session pour avoir le montant a afficher
  // (la redirection se fait au clic sur le bouton, pour que l'utilisateur ait
  //  le temps de voir le recapitulatif)
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    fetch(`${API_URL}/api/paiements/create-checkout-session?reservationId=${reservationId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMontant(data.montant);
          // On stocke l'URL Stripe pour la redirection differee
          sessionStorage.setItem(`stripe_checkout_url_${reservationId}`, data.url);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(t("payment.cannotLoad") + err.message);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId, token]);

  const handlePay = () => {
    const url = sessionStorage.getItem(`stripe_checkout_url_${reservationId}`);
    if (!url) {
      setError(t("payment.urlMissing"));
      return;
    }
    setRedirecting(true);
    // Redirection vers la page hostee par Stripe
    window.location.href = url;
  };

  return (
    <>
      <PageHeader
        title={t("payment.title")}
        subtitle={spectacleTitle}
        breadcrumb={[
          { label: t("nav.spectacles"), path: "/" },
          { label: t("payment.title") },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <h5 className="mb-4" style={{ fontWeight: "700" }}>
                    <i className="fas fa-credit-card me-2" style={{ color: "#fec810" }}></i>
                    {t("payment.summary")}
                  </h5>

                  {error && (
                    <div className="alert-error mb-3">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2 text-muted">{t("payment.preparing")}</p>
                    </div>
                  )}

                  {montant && !error && (
                    <>
                      <div className="mb-4 p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                        <p className="info-label mb-1">{t("payment.spectacle")}</p>
                        <p className="info-value mb-3">{spectacleTitle}</p>
                        <hr />
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="info-label">{t("payment.totalToPay")}</span>
                          <span style={{ fontSize: "1.8rem", fontWeight: "700", color: "#fec810" }}>
                            {montant} EUR
                          </span>
                        </div>
                      </div>

                      <div
                        className="mb-4 p-3"
                        style={{
                          background: "#e7f5ff",
                          borderLeft: "4px solid #0d6efd",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        <p className="mb-1">
                          <i className="fas fa-info-circle me-2 text-primary"></i>
                          <strong>{t("payment.stripeInfo")}</strong>
                        </p>
                        <p className="mb-0" style={{ fontSize: "0.85rem", color: "#666" }}>
                          {t("payment.stripeDesc")}
                        </p>
                      </div>

                      <button
                        onClick={handlePay}
                        disabled={redirecting}
                        className="btn btn-primary text-uppercase w-100 btn-admin"
                        style={{ padding: "14px", fontSize: "1.05rem" }}
                      >
                        {redirecting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            {t("payment.redirecting")}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-lock me-2"></i>
                            {t("payment.payWith").replace("{amount}", montant)}
                          </>
                        )}
                      </button>

                      <Link
                        to="/mes-reservations"
                        className="btn btn-link w-100 mt-2 text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <i className="fas fa-arrow-left me-1"></i>
                        {t("payment.cancel")}
                      </Link>
                    </>
                  )}

                  <div
                    className="mt-4 p-3"
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: "#666",
                    }}
                  >
                    <p className="mb-1">
                      <strong>
                        <i className="fas fa-flask me-1"></i>{t("payment.testMode")}
                      </strong>
                    </p>
                    <p className="mb-0">
                      {t("payment.testCard")} : <code>4242 4242 4242 4242</code> · <code>12/34</code> · <code>123</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentPage;
