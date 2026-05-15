import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";
import PageHeader from "../../components/PageHeader";

// ================================================
// Page de retour apres un paiement reussi sur Stripe
// Stripe redirige ici avec ?session_id=cs_xxx&reservationId=X
// ================================================
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
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
      setError("Identifiant de session Stripe manquant.");
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
          setError(data.error || "Confirmation echouee.");
        } else {
          setMethode(data.methode);
          // Vide la cle stockee dans sessionStorage
          if (reservationId) {
            sessionStorage.removeItem(`stripe_checkout_url_${reservationId}`);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur de confirmation : " + err.message);
        setLoading(false);
      });
  }, [sessionId, reservationId, token]);

  return (
    <>
      <PageHeader
        title={loading ? "Confirmation..." : error ? "Erreur de paiement" : "Paiement confirme"}
        subtitle="Merci pour votre reservation"
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
                      <h4 className="mt-3">Verification du paiement...</h4>
                      <p className="text-muted">
                        Nous validons votre transaction avec Stripe.
                      </p>
                    </>
                  ) : error ? (
                    <>
                      <i
                        className="fas fa-times-circle"
                        style={{ fontSize: "4rem", color: "#dc3545" }}
                      ></i>
                      <h3 className="mt-3 mb-2">Erreur de confirmation</h3>
                      <p className="text-muted mb-4">{error}</p>
                      <button
                        onClick={() => navigate("/mes-reservations")}
                        className="btn btn-outline-secondary me-2"
                      >
                        <i className="fas fa-ticket-alt me-2"></i>Mes reservations
                      </button>
                      <Link to="/" className="btn btn-primary btn-admin">
                        <i className="fas fa-home me-2"></i>Accueil
                      </Link>
                    </>
                  ) : (
                    <>
                      <i
                        className="fas fa-check-circle"
                        style={{ fontSize: "4rem", color: "#28a745" }}
                      ></i>
                      <h3 className="mt-3 mb-2">Paiement reussi !</h3>
                      <p className="text-muted mb-2">
                        Votre reservation a bien ete confirmee.
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
                            Paye par {methode}
                          </span>
                        </p>
                      )}
                      <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                        <i className="fas fa-envelope me-1 text-warning"></i>
                        Un recu a ete envoye a votre adresse email.
                      </p>
                      <button
                        onClick={() => navigate("/mes-reservations")}
                        className="btn btn-outline-secondary me-2"
                      >
                        <i className="fas fa-ticket-alt me-2"></i>Mes reservations
                      </button>
                      <Link to="/" className="btn btn-primary btn-admin">
                        <i className="fas fa-home me-2"></i>Accueil
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
