import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import Comments from "../../components/Comments";
import ShareButtons from "../../components/ShareButtons";
import API_URL from "../../config";

import { useAuth } from "../../context/AuthContext";

const SpectacleDetail = () => {
  const { id } = useParams();
  const { token, role, userId } = useAuth();
  const currentUserId = userId ? parseInt(userId) : null;
  const [representations, setRepresentations] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);
  const [spectacle, setSpectacle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRep, setSelectedRep] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [reserving, setReserving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/spectacles/${id}`).then((res) => res.json()),
      fetch(`${API_URL}/api/representations/spectacle/${id}`).then((res) =>
        res.json(),
      ),
    ])
      .then(([spectacleData, representationsData]) => {
        setSpectacle(spectacleData);
        setRepresentations(
          Array.isArray(representationsData) ? representationsData : [],
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const deleteSpectacle = () => {
    if (window.confirm(`Supprimer "${spectacle.title}" ?`)) {
      fetch(`${API_URL}/api/spectacles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => navigate("/"));
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

  const reserve = (representation) => {
    if (!token) {
      setCartMessage({ type: "error", text: "Connectez-vous pour réserver !" });
      return;
    }
    setSelectedRep(representation);
  };

  const confirmReservation = () => {
    if (numberOfSeats < 1 || numberOfSeats > selectedRep.placesDisponibles) {
      setCartMessage({ type: "error", text: "Nombre de places invalide." });
      return;
    }
    setReserving(true);

    fetch(`${API_URL}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        representation: { id: selectedRep.id },
        user: { id: parseInt(userId) },
        numberOfSeats: parseInt(numberOfSeats),
        status: "CREATED",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la réservation");
        return res.json();
      })
      .then((data) => {
        // Redirection vers la page de paiement Stripe
        const reservationIdFromResponse = data.id;
        setSelectedRep(null);
        setNumberOfSeats(1);
        setReserving(false);
        navigate(`/paiement/${reservationIdFromResponse}?spectacle=${encodeURIComponent(spectacle.title)}`);
      })
      .catch((err) => {
        setCartMessage({ type: "error", text: err.message });
        setReserving(false);
      });
  };
  return (
    <>
      <PageHeader
        title={spectacle.title}
        subtitle={spectacle.location}
        breadcrumb={[
          { label: "Spectacles", path: "/" },
          { label: spectacle.title },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  {cartMessage && (
                    <div
                      className={
                        cartMessage.type === "success"
                          ? "alert-success-custom mb-4"
                          : "alert-error mb-4"
                      }
                    >
                      <i
                        className={`fas fa-${cartMessage.type === "success" ? "check-circle" : "exclamation-circle"} me-2`}
                      ></i>
                      {cartMessage.text}
                    </div>
                  )}
                  <SectionLabel icon="theater-masks" text="Informations" />
                  <div className="row g-4 mb-4">
                    <div className="col-md-3">
                      <p className="info-label">Titre</p>
                      <p className="info-value">{spectacle.title}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="info-label">Date</p>
                      <p className="info-value">
                        {new Date(spectacle.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="info-label">Lieu</p>
                      <p className="info-value">
                        {spectacle.location || "Non renseigné"}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="info-label">Prix</p>
                      <p className="info-value">{spectacle.price} €</p>
                    </div>
                    <div className="col-md-3">
                      <p className="info-label">Artiste</p>
                      <p className="info-value">
                        {spectacle.artist
                          ? spectacle.artist.name
                          : "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <hr className="agency-divider" />
                  <SectionLabel icon="file-alt" text="Description" />
                  <p className="text-description">
                    {spectacle.description || "Aucune description disponible."}
                  </p>

                  <hr className="agency-divider" />
                  <ShareButtons
                    title={spectacle.title}
                    text={
                      spectacle.description
                        ? spectacle.description.substring(0, 140)
                        : `Découvrez ${spectacle.title} sur PID Réservations`
                    }
                  />

                  <hr className="agency-divider" />
                  <SectionLabel
                    icon="calendar"
                    text="Représentations disponibles"
                  />
                  {role === "ROLE_ADMIN" && (
                    <div className="mb-3 d-flex justify-content-end">
                      <Link
                        to={`/spectacles/${id}/representations/create`}
                        className="btn btn-primary btn-sm text-uppercase btn-admin"
                      >
                        <i className="fas fa-plus me-2"></i>Ajouter une
                        représentation
                      </Link>
                    </div>
                  )}
                  {representations.length === 0 ? (
                    <p className="info-label">
                      Aucune représentation disponible.
                    </p>
                  ) : (
                    <div className="row g-3">
                      {representations.map((rep) => (
                        <div className="col-md-6" key={rep.id}>
                          <div className="rep-card">
                            <p className="info-label">Date et heure</p>
                            <p className="info-value">
                              {new Date(rep.dateHeure).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                            <p className="info-label mt-2">
                              Places disponibles
                            </p>
                            <p className="info-value">
                              <span
                                className={
                                  rep.placesDisponibles > 10
                                    ? "places-high"
                                    : rep.placesDisponibles > 0
                                      ? "places-low"
                                      : "places-none"
                                }
                              >
                                {rep.placesDisponibles > 0
                                  ? `${rep.placesDisponibles} places`
                                  : "Complet"}
                              </span>
                            </p>
                            <button
                              onClick={() => reserve(rep)}
                              disabled={rep.placesDisponibles === 0}
                              className="btn btn-primary btn-sm text-uppercase w-100 mt-2 btn-admin"
                            >
                              {rep.placesDisponibles === 0
                                ? "Complet"
                                : "Réserver"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedRep && (
                    <div className="modal-overlay">
                      <div className="modal-box">
                        <h5 className="modal-title">
                          Confirmer la réservation
                        </h5>
                        <p className="info-label">Spectacle</p>
                        <p className="info-value mb-3">{spectacle.title}</p>
                        <p className="info-label">Date</p>
                        <p className="info-value mb-3">
                          {new Date(selectedRep.dateHeure).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        <p className="info-label">Nombre de places</p>
                        <input
                          type="number"
                          className="form-control mb-3"
                          min="1"
                          max={selectedRep.placesDisponibles}
                          value={numberOfSeats}
                          onChange={(e) =>
                            setNumberOfSeats(parseInt(e.target.value))
                          }
                        />
                        <p className="info-label">Total</p>
                        <p className="info-value total-price mb-4">
                          {(numberOfSeats * spectacle.price).toFixed(2)} €
                        </p>
                        <div className="d-flex gap-3">
                          <button
                            onClick={() => setSelectedRep(null)}
                            className="btn-cancel w-50 text-center"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={confirmReservation}
                            disabled={reserving}
                            className="btn btn-primary text-uppercase w-50 btn-admin"
                          >
                            {reserving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Réservation...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check me-2"></i>Confirmer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="agency-divider" />
                  <SectionLabel icon="comments" text="Avis des spectateurs" />
                  <Comments spectacleId={id} />

                  <hr className="agency-divider" />
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/" className="btn-cancel">
                      <i className="fas fa-arrow-left me-2"></i>Retour
                    </Link>
                    {role === "ROLE_ADMIN" && (
                      <div className="d-flex gap-2">
                        <Link
                          to={`/spectacles/${spectacle.id}/edit`}
                          className="btn btn-warning text-uppercase btn-admin"
                        >
                          <i className="fas fa-pen me-2"></i>Modifier
                        </Link>
                        <button
                          onClick={deleteSpectacle}
                          className="btn btn-outline-danger text-uppercase btn-admin"
                        >
                          <i className="fas fa-trash me-2"></i>Supprimer
                        </button>
                      </div>
                    )}
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

export default SpectacleDetail;
