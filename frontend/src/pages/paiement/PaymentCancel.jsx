import { useSearchParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

// ================================================
// Page de retour si l'utilisateur annule sur Stripe
// ================================================
const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  return (
    <>
      <PageHeader
        title="Paiement annule"
        subtitle="Aucun montant n'a ete debite"
      />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="agency-card text-center">
                <div className="card-accent" style={{ background: "#fec810" }}></div>
                <div className="card-content">
                  <i
                    className="fas fa-exclamation-triangle"
                    style={{ fontSize: "4rem", color: "#fec810" }}
                  ></i>
                  <h3 className="mt-3 mb-2">Paiement annule</h3>
                  <p className="text-muted mb-4">
                    Vous avez annule la transaction. Aucun montant n'a ete preleve.
                  </p>
                  <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                    Votre reservation reste en attente. Vous pouvez relancer le
                    paiement quand vous le souhaitez depuis votre espace.
                  </p>

                  {reservationId && (
                    <Link
                      to={`/paiement/${reservationId}`}
                      className="btn btn-primary text-uppercase btn-admin me-2"
                    >
                      <i className="fas fa-redo me-2"></i>Reessayer le paiement
                    </Link>
                  )}
                  <Link to="/mes-reservations" className="btn btn-outline-secondary">
                    <i className="fas fa-ticket-alt me-2"></i>Mes reservations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentCancel;
