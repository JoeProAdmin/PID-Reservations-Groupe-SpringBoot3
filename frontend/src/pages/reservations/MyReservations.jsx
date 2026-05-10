import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

const MyReservations = () => {
  const { token, userId } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/reservations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        setReservations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, token]);

  const cancelReservation = (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      fetch(`${API_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setReservations(reservations.filter((r) => r.id !== id)));
    }
  };

  if (loading)
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 pt-5 text-center text-danger">{error}</div>
    );

  return (
    <>
      <PageHeader
        title="Mes réservations"
        subtitle="Historique de vos réservations"
        breadcrumb={[
          { label: "Accueil", path: "/" },
          { label: "Mes réservations" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {reservations.length === 0 ? (
                <div className="agency-card">
                  <div className="card-accent"></div>
                  <div className="card-content text-center py-4">
                    <i
                      className="fas fa-ticket-alt fa-3x mb-3"
                      style={{ color: "#adb5bd" }}
                    ></i>
                    <p className="info-label">
                      Aucune réservation pour le moment.
                    </p>
                    <Link
                      to="/"
                      className="btn btn-primary text-uppercase btn-admin mt-2"
                    >
                      <i className="fas fa-theater-masks me-2"></i>Voir les
                      spectacles
                    </Link>
                  </div>
                </div>
              ) : (
                reservations.map((reservation) => (
                  <div className="agency-card mb-4" key={reservation.id}>
                    <div className="card-accent"></div>
                    <div className="card-content">
                      <SectionLabel
                        icon="theater-masks"
                        text={reservation.representation.spectacle.title}
                      />

                      <div className="row g-4 mb-4">
                        <div className="col-md-3">
                          <p className="info-label">Date</p>
                          <p className="info-value">
                            {new Date(
                              reservation.representation.dateHeure,
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <p className="info-label">Lieu</p>
                          <p className="info-value">
                            {reservation.representation.spectacle.location ||
                              "Non renseigné"}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <p className="info-label">Places</p>
                          <p className="info-value">
                            {reservation.numberOfSeats}
                          </p>
                        </div>
                        <div className="col-md-3">
                          <p className="info-label">Total</p>
                          <p className="info-value total-price">
                            {(
                              reservation.numberOfSeats *
                              reservation.representation.spectacle.price
                            ).toFixed(2)}{" "}
                            €
                          </p>
                        </div>
                      </div>

                      <hr className="agency-divider" />

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="info-label mb-0">Statut</p>
                          <span
                            className={`badge-genre ${reservation.status === "CANCELLED" ? "bg-danger" : reservation.status === "CONFIRMED" ? "bg-success" : ""}`}
                          >
                            {reservation.status}
                          </span>
                        </div>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/spectacles/${reservation.representation.spectacle.id}`}
                            className="btn btn-sm btn-dark text-warning btn-admin"
                          >
                            <i className="fas fa-eye me-1"></i>Voir le spectacle
                          </Link>
                          {reservation.status !== "CANCELLED" && (
                            <button
                              onClick={() => cancelReservation(reservation.id)}
                              className="btn btn-sm btn-outline-danger btn-admin"
                            >
                              <i className="fas fa-times me-1"></i>Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyReservations;
