import { useSearchParams, Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useLanguage } from "../../context/LanguageContext";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const reservationId = searchParams.get("reservationId");

  return (
    <>
      <PageHeader
        title={t("payCancel.title")}
        subtitle={t("payCancel.subtitle")}
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
                  <h3 className="mt-3 mb-2">{t("payCancel.title")}</h3>
                  <p className="text-muted mb-4">
                    {t("payCancel.message")}
                  </p>
                  <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                    {t("payCancel.bookingPending")}
                  </p>

                  {reservationId && (
                    <Link
                      to={`/paiement/${reservationId}`}
                      className="btn btn-primary text-uppercase btn-admin me-2"
                    >
                      <i className="fas fa-redo me-2"></i>{t("payCancel.retry")}
                    </Link>
                  )}
                  <Link to="/mes-reservations" className="btn btn-outline-secondary">
                    <i className="fas fa-ticket-alt me-2"></i>{t("payCancel.myReservations")}
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
