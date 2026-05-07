import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/artists/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Artiste introuvable");
        return res.json();
      })
      .then((data) => {
        setArtist(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const deleteArtist = () => {
    if (window.confirm(`Supprimer "${artist.name}" ?`)) {
      fetch(`${API_URL}/api/artists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => navigate("/artists"));
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
        title={artist.name}
        subtitle={artist.country}
        breadcrumb={[{ label: "Artistes", path: "/" }, { label: artist.name }]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="user" text="Informations" />
                  <div className="row g-4 mb-4">
                    <div className="col-md-4">
                      <p className="info-label">Nom</p>
                      <p className="info-value">{artist.name}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="info-label">Genre</p>
                      <p className="info-value">
                        {artist.genre || "Non renseigné"}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <p className="info-label">Pays</p>
                      <p className="info-value">
                        {artist.country || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <hr className="agency-divider" />
                  <SectionLabel icon="file-alt" text="Biographie" />
                  <p
                    style={{
                      fontFamily: "Roboto Slab, serif",
                      fontSize: "0.95rem",
                      color: "#495057",
                      lineHeight: 1.8,
                    }}
                  >
                    {artist.description || "Aucune biographie disponible."}
                  </p>

                  <hr className="agency-divider" />
                  <div className="d-flex justify-content-between align-items-center">
                    {artist.createdAt && (
                      <p className="info-label mb-0">
                        <i className="fas fa-calendar me-1"></i>
                        Ajouté le{" "}
                        {new Date(artist.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    )}
                    <div className="d-flex gap-2">
                      <Link to="/artists" className="btn-cancel">
                        <i className="fas fa-arrow-left me-2"></i>Retour
                      </Link>
                      {role === "ROLE_ADMIN" && (
                        <>
                          <Link
                            to={`/artists/${id}/edit`}
                            className="btn btn-warning text-uppercase"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                            }}
                          >
                            <i className="fas fa-pen me-2"></i>Modifier
                          </Link>
                          <button
                            onClick={deleteArtist}
                            className="btn btn-outline-danger text-uppercase"
                            style={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                            }}
                          >
                            <i className="fas fa-trash me-2"></i>Supprimer
                          </button>
                        </>
                      )}
                    </div>
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

export default ArtistDetail;
