import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";
import PageHeader from "../../components/PageHeader";

// Cle publique Stripe (mode test)
const stripePromise = loadStripe("pk_test_51TOofyEeoWCZyimZ98vu5yPYih5zQCNL21MFl3J5ZNJmdDuTNQQJuumDWPnZi3f0jzKp1XYEwgGFCFPfMeS3UmFz00wtWBgSol");

// ================================================
// Composant formulaire de carte bancaire
// ================================================
const CheckoutForm = ({ clientSecret, reservationId, montant, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else if (result.paymentIntent.status === "succeeded") {
      // Confirmer le paiement cote backend
      try {
        await fetch(`${API_URL}/api/paiements/confirmer?reservationId=${reservationId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess();
      } catch (err) {
        setError("Paiement reussi mais erreur de confirmation. Contactez l'admin.");
        setLoading(false);
      }
    }
  };

  const cardStyle = {
    hidePostalCode: true,
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#e74c3c", iconColor: "#e74c3c" },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="info-label mb-2">Carte bancaire</label>
        <div style={{
          padding: "12px 16px",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          transition: "border-color 0.3s"
        }}>
          <CardElement options={cardStyle} />
        </div>
      </div>

      {error && (
        <div className="alert-error mb-3">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="info-label">Total a payer</span>
        <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fec810" }}>
          {montant} €
        </span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary text-uppercase w-100 btn-admin"
        style={{ padding: "12px", fontSize: "1rem" }}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Paiement en cours...
          </>
        ) : (
          <>
            <i className="fas fa-lock me-2"></i>Payer {montant} €
          </>
        )}
      </button>

      <p className="text-center mt-3" style={{ fontSize: "0.8rem", color: "#999" }}>
        <i className="fas fa-shield-alt me-1"></i>
        Paiement securise par Stripe - Mode test
      </p>
    </form>
  );
};

// ================================================
// Page de paiement principale
// ================================================
const PaymentPage = () => {
  const { reservationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [clientSecret, setClientSecret] = useState(null);
  const [montant, setMontant] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const spectacleTitle = searchParams.get("spectacle") || "Spectacle";

  useEffect(() => {
    // Creer le PaymentIntent via le backend
    fetch(`${API_URL}/api/paiements/create-payment-intent?reservationId=${reservationId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
          setMontant(data.montant);
        }
      })
      .catch((err) => setError("Impossible de charger le paiement."));
  }, [reservationId, token]);

  if (success) {
    return (
      <>
        <PageHeader title="Paiement confirme" subtitle="Merci pour votre reservation" />
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="agency-card text-center">
                  <div className="card-accent" style={{ background: "#28a745" }}></div>
                  <div className="card-content">
                    <i className="fas fa-check-circle" style={{ fontSize: "4rem", color: "#28a745" }}></i>
                    <h3 className="mt-3 mb-2">Paiement reussi !</h3>
                    <p className="text-muted mb-4">
                      Votre reservation pour <strong>{spectacleTitle}</strong> est confirmee.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="btn btn-primary text-uppercase btn-admin"
                    >
                      <i className="fas fa-home me-2"></i>Retour aux spectacles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Paiement"
        subtitle={spectacleTitle}
        breadcrumb={[
          { label: "Spectacles", path: "/" },
          { label: "Paiement" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <h5 className="mb-4" style={{ fontWeight: "700" }}>
                    <i className="fas fa-credit-card me-2" style={{ color: "#fec810" }}></i>
                    Informations de paiement
                  </h5>

                  {error && (
                    <div className="alert-error mb-3">
                      <i className="fas fa-exclamation-circle me-2"></i>{error}
                    </div>
                  )}

                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm
                        clientSecret={clientSecret}
                        reservationId={reservationId}
                        montant={montant}
                        onSuccess={() => setSuccess(true)}
                      />
                    </Elements>
                  ) : !error ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2 text-muted">Chargement du paiement...</p>
                    </div>
                  ) : null}

                  <div className="mt-4 p-3" style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    color: "#666"
                  }}>
                    <p className="mb-1"><strong>Mode test Stripe</strong></p>
                    <p className="mb-0">
                      Carte : <code>4242 4242 4242 4242</code><br/>
                      Date : <code>12/34</code> | CVC : <code>123</code>
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
