import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

const MesReservations = () => {
  const { token, userId } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`${API_URL}/api/reservations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, userId, navigate]);

  const cancelReservation = (id) => {
    if (!window.confirm("Annuler cette reservation ?")) return;
    fetch(`${API_URL}/api/reservations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setReservations(reservations.filter((r) => r.id !== id));
        setMessage({ type: "success", text: "Reservation annulee." });
      })
      .catch(() => setMessage({ type: "error", text: "Erreur lors de l'annulation." }));
  };

  const statusBadge = (status) => {
    const styles = {
      CREATED: { bg: "#fff3cd", color: "#856404", icon: "clock", label: "En attente de paiement" },
      CONFIRMED: { bg: "#d4edda", color: "#155724", icon: "check-circle", label: "Confirmee" },
      CANCELLED: { bg: "#f8d7da", color: "#721c24", icon: "times-circle", label: "Annulee" },
    };
    const s = styles[status] || { bg: "#e2e3e5", color: "#383d41", icon: "question", label: status };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem",
        fontWeight: 700, backgroundColor: s.bg, color: s.color,
        fontFamily: "Montserrat, sans-serif",
      }}>
        <i className={`fas fa-${s.icon}`}></i>{s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Mes Reservations" subtitle="Chargement..." />
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Mes Reservations"
        subtitle={`${reservations.length} reservation(s)`}
        breadcrumb={[
          { label: "Spectacles", path: "/" },
          { label: "Mes Reservations" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          {message && (
            <div className={`${message.type === "success" ? "alert-success-custom" : "alert-error"} mb-4`}>
              <i className={`fas fa-${message.type === "success" ? "check-circle" : "exclamation-circle"} me-2`}></i>
              {message.text}
            </div>
          )}

          {reservations.length === 0 ? (
            <div className="agency-card">
              <div className="card-accent"></div>
              <div className="card-content text-center py-5">
                <i className="fas fa-ticket-alt fa-3x mb-3" style={{ color: "#ccc" }}></i>
                <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
                  Aucune reservation
                </h4>
                <p className="text-muted mb-4">Vous n'avez pas encore fait de reservation.</p>
                <Link to="/" className="btn btn-primary text-uppercase" style={{
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem",
                }}>
                  <i className="fas fa-search me-2"></i>Voir les spectacles
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {reservations.map((res) => {
                const spectacle = res.representation?.spectacle;
                const rep = res.representation;
                const total = spectacle ? (res.numberOfSeats * spectacle.price).toFixed(2) : "—";

                return (
                  <div className="col-lg-6" key={res.id}>
                    <div className="agency-card" style={{ height: "100%" }}>
                      <div className="card-accent" style={{
                        background: res.status === "CONFIRMED" ? "#198754"
                          : res.status === "CANCELLED" ? "#dc3545" : "#fec810",
                      }}></div>
                      <div className="card-content">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, marginBottom: "4px" }}>
                              {spectacle?.title || "Spectacle"}
                            </h5>
                            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {spectacle?.location || "Lieu non renseigne"}
                            </p>
                          </div>
                          {statusBadge(res.status)}
                        </div>

                        <hr className="agency-divider" />

                        {/* Infos */}
                        <div className="row g-3 mb-3">
                          <div className="col-6">
                            <p className="info-label mb-1">Date</p>
                            <p className="info-value" style={{ fontSize: "0.9rem" }}>
                              {rep?.dateHeure
                                ? new Date(rep.dateHeure).toLocaleDateString("fr-FR", {
                                    day: "numeric", month: "long", year: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                  })
                                : "—"}
                            </p>
                          </div>
                          <div className="col-3">
                            <p className="info-label mb-1">Places</p>
                            <p className="info-value" style={{ fontSize: "0.9rem" }}>
                              <i className="fas fa-chair me-1" style={{ color: "#fec810" }}></i>
                              {res.numberOfSeats}
                            </p>
                          </div>
                          <div className="col-3">
                            <p className="info-label mb-1">Total</p>
                            <p className="info-value" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fec810" }}>
                              {total} €
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                          {spectacle && (
                            <Link
                              to={`/spectacles/${spectacle.id}`}
                              className="btn btn-outline-secondary btn-sm text-uppercase flex-fill"
                              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem" }}
                            >
                              <i className="fas fa-eye me-1"></i>Voir le spectacle
                            </Link>
                          )}
                          {res.status === "CREATED" && (
                            <>
                              <Link
                                to={`/paiement/${res.id}?spectacle=${encodeURIComponent(spectacle?.title || "")}`}
                                className="btn btn-primary btn-sm text-uppercase flex-fill"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem" }}
                              >
                                <i className="fas fa-credit-card me-1"></i>Payer
                              </Link>
                              <button
                                onClick={() => cancelReservation(res.id)}
                                className="btn btn-outline-danger btn-sm text-uppercase"
                                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.75rem" }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MesReservations;
