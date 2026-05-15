import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

const ProducteurDashboard = () => {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [commentaires, setCommentaires] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = useCallback(() => {
    setLoadingStats(true);
    fetch(`${API_URL}/api/producteur/stats`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));

    setLoadingComments(true);
    fetch(`${API_URL}/api/producteur/commentaires`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setCommentaires(Array.isArray(data) ? data : []);
        setLoadingComments(false);
      })
      .catch(() => setLoadingComments(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (role === "ROLE_PRODUCTEUR_PENDING") {
      return;
    }
    if (role !== "ROLE_PRODUCTEUR" && role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }
    fetchAll();
  }, [token, role, navigate, fetchAll]);

  const moderate = (id, statut) => {
    fetch(`${API_URL}/api/producteur/commentaires/${id}/statut`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setCommentaires(commentaires.map((c) => (c.id === id ? updated : c)))
      );
  };

  const deleteComment = (id) => {
    if (!window.confirm(`Supprimer le commentaire #${id} ?`)) return;
    fetch(`${API_URL}/api/producteur/commentaires/${id}`, {
      method: "DELETE",
      headers,
    }).then(() => setCommentaires(commentaires.filter((c) => c.id !== id)));
  };

  // ====== Compte en attente ======
  if (role === "ROLE_PRODUCTEUR_PENDING") {
    return (
      <>
        <PageHeader
          title="Compte en attente"
          subtitle="Validation administrateur requise"
          breadcrumb={[{ label: "Producteur" }]}
        />
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="agency-card">
                  <div
                    className="card-accent"
                    style={{ background: "#fec810" }}
                  ></div>
                  <div className="card-content text-center py-5">
                    <i
                      className="fas fa-hourglass-half fa-3x mb-3"
                      style={{ color: "#fec810" }}
                    ></i>
                    <h4
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Votre compte producteur est en attente
                    </h4>
                    <p className="text-description mt-3">
                      Un administrateur doit valider votre demande avant que
                      vous puissiez créer des spectacles et accéder aux
                      statistiques. Vous serez notifié par email dès la
                      validation.
                    </p>
                    <Link to="/" className="btn btn-primary mt-3 btn-admin">
                      <i className="fas fa-arrow-left me-2"></i>
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const btnStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 700,
    fontSize: "0.7rem",
  };

  const customStyles = {
    headCells: {
      style: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        textTransform: "uppercase",
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        color: "#495057",
        backgroundColor: "#f8f9fa",
      },
    },
    cells: {
      style: {
        fontFamily: "Roboto Slab, serif",
        fontSize: "0.85rem",
        color: "#212529",
      },
    },
  };

  const fillRateColor = (rate) => {
    if (rate >= 75) return "#198754";
    if (rate >= 40) return "#fec810";
    return "#dc3545";
  };

  const spectacleStatsColumns = [
    { name: "Titre", selector: (r) => r.title, sortable: true, grow: 2 },
    {
      name: "Date",
      selector: (r) => (r.date ? new Date(r.date).toLocaleDateString("fr-FR") : "—"),
      sortable: true,
    },
    {
      name: "Représentations",
      selector: (r) => r.representationsCount,
      sortable: true,
      width: "130px",
    },
    {
      name: "Places vendues",
      cell: (r) => `${r.seatsSold} / ${r.totalCapacity}`,
      sortable: true,
      selector: (r) => r.seatsSold,
      width: "130px",
    },
    {
      name: "Remplissage",
      cell: (r) => (
        <div style={{ width: "100%" }}>
          <div
            style={{
              background: "#e9ecef",
              borderRadius: "10px",
              height: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, r.fillRate)}%`,
                height: "100%",
                background: fillRateColor(r.fillRate),
              }}
            />
          </div>
          <small
            style={{ fontWeight: 700, color: fillRateColor(r.fillRate) }}
          >
            {r.fillRate.toFixed(0)}%
          </small>
        </div>
      ),
      sortable: true,
      selector: (r) => r.fillRate,
      width: "140px",
    },
    {
      name: "Revenus",
      cell: (r) => (
        <span style={{ fontWeight: 700, color: "#198754" }}>
          {r.revenue.toFixed(2)} €
        </span>
      ),
      sortable: true,
      selector: (r) => r.revenue,
      width: "100px",
    },
    {
      name: "Note moy.",
      cell: (r) =>
        r.averageRating != null ? (
          <span style={{ color: "#fec810", fontWeight: 700 }}>
            {r.averageRating}/5 <i className="fas fa-star ms-1"></i>
            <small style={{ color: "#6c757d" }} className="ms-1">
              ({r.commentsCount})
            </small>
          </span>
        ) : (
          <span style={{ color: "#6c757d" }}>—</span>
        ),
      sortable: true,
      selector: (r) => r.averageRating || 0,
      width: "120px",
    },
    {
      name: "Actions",
      cell: (r) => (
        <div className="d-flex gap-2">
          <Link
            to={`/spectacles/${r.id}`}
            className="btn btn-sm btn-dark text-warning"
            style={btnStyle}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <Link
            to={`/spectacles/${r.id}/edit`}
            className="btn btn-sm btn-warning"
            style={btnStyle}
          >
            <i className="fas fa-pen"></i>
          </Link>
        </div>
      ),
    },
  ];

  const commentaireColumns = [
    { name: "ID", selector: (r) => `#${r.id}`, width: "70px" },
    { name: "Spectacle", selector: (r) => r.spectacleTitle, sortable: true },
    {
      name: "Auteur",
      selector: (r) => `${r.userPrenom} ${r.userNom}`.trim(),
      sortable: true,
    },
    {
      name: "Note",
      cell: (r) => (
        <span style={{ color: "#fec810", fontWeight: 700 }}>
          {r.note}/5 <i className="fas fa-star ms-1"></i>
        </span>
      ),
      width: "90px",
      sortable: true,
      selector: (r) => r.note,
    },
    {
      name: "Contenu",
      cell: (r) => (
        <div
          style={{
            maxWidth: "300px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={r.contenu}
        >
          {r.contenu}
        </div>
      ),
    },
    {
      name: "Statut",
      cell: (r) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 700,
            backgroundColor: r.statut === "PUBLIE" ? "#d4edda" : "#f8d7da",
            color: r.statut === "PUBLIE" ? "#155724" : "#721c24",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <i
            className={`fas fa-${r.statut === "PUBLIE" ? "eye" : "eye-slash"} me-1`}
          ></i>
          {r.statut}
        </span>
      ),
      sortable: true,
      selector: (r) => r.statut,
      width: "120px",
    },
    {
      name: "Actions",
      cell: (r) => (
        <div className="d-flex gap-2">
          {r.statut === "PUBLIE" ? (
            <button
              onClick={() => moderate(r.id, "REJETE")}
              className="btn btn-sm btn-outline-warning"
              style={btnStyle}
              title="Masquer"
            >
              <i className="fas fa-eye-slash"></i>
            </button>
          ) : (
            <button
              onClick={() => moderate(r.id, "PUBLIE")}
              className="btn btn-sm btn-outline-success"
              style={btnStyle}
              title="Republier"
            >
              <i className="fas fa-eye"></i>
            </button>
          )}
          <button
            onClick={() => deleteComment(r.id)}
            className="btn btn-sm btn-outline-danger"
            style={btnStyle}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    { key: "overview", label: "Vue d'ensemble", icon: "chart-bar" },
    { key: "spectacles", label: "Mes spectacles", icon: "theater-masks" },
    { key: "commentaires", label: "Commentaires", icon: "comments" },
  ];

  return (
    <>
      <PageHeader
        title="Espace Producteur"
        subtitle="Suivez vos spectacles et vos performances"
        breadcrumb={[{ label: "Producteur" }]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          {/* ==== STATS GLOBALES ==== */}
          {loadingStats ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : stats ? (
            <div className="row g-3 mb-4">
              {[
                {
                  icon: "theater-masks",
                  count: stats.totalSpectacles,
                  label: "Spectacles",
                  color: "#6f42c1",
                },
                {
                  icon: "calendar",
                  count: stats.totalRepresentations,
                  label: "Représentations",
                  color: "#0d6efd",
                },
                {
                  icon: "ticket-alt",
                  count: stats.totalReservations,
                  label: "Réservations",
                  color: "#fec810",
                },
                {
                  icon: "users",
                  count: stats.totalSeatsSold,
                  label: "Places vendues",
                  color: "#17a2b8",
                },
                {
                  icon: "euro-sign",
                  count: `${stats.totalRevenue.toFixed(2)} €`,
                  label: "Revenus",
                  color: "#198754",
                },
                {
                  icon: "star",
                  count: stats.averageRating != null ? `${stats.averageRating}/5` : "—",
                  label: `Note (${stats.totalComments} avis)`,
                  color: "#dc3545",
                },
              ].map((s, i) => (
                <div className="col" key={i}>
                  <div className="agency-card">
                    <div className="card-accent" style={{ background: s.color }}></div>
                    <div className="card-content text-center" style={{ padding: "20px 10px" }}>
                      <i
                        className={`fas fa-${s.icon} fa-2x mb-2`}
                        style={{ color: s.color }}
                      ></i>
                      <h3
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "1.4rem",
                        }}
                      >
                        {s.count}
                      </h3>
                      <p className="info-label mb-0" style={{ fontSize: "0.75rem" }}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning mb-4">
              Impossible de charger les statistiques.
            </div>
          )}

          {/* ==== TABS ==== */}
          <div className="mb-4 d-flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn text-uppercase ${
                  activeTab === tab.key ? "btn-primary" : "btn-outline-secondary"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                <i className={`fas fa-${tab.icon} me-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ==== OVERVIEW ==== */}
          {activeTab === "overview" && stats && (
            <div className="agency-card">
              <div className="card-accent" style={{ background: "#6f42c1" }}></div>
              <div className="card-content">
                <SectionLabel icon="chart-bar" text="Performance par spectacle" />
                <DataTable
                  columns={spectacleStatsColumns}
                  data={stats.spectacles || []}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun spectacle pour le moment. Créez votre premier spectacle !"
                />
              </div>
            </div>
          )}

          {/* ==== MES SPECTACLES ==== */}
          {activeTab === "spectacles" && (
            <div className="agency-card">
              <div className="card-accent" style={{ background: "#0d6efd" }}></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel icon="theater-masks" text="Mes spectacles" />
                  <Link
                    to="/spectacles/create"
                    className="btn btn-primary btn-sm text-uppercase"
                    style={btnStyle}
                  >
                    <i className="fas fa-plus me-2"></i>Nouveau spectacle
                  </Link>
                </div>
                {stats && stats.spectacles.length === 0 ? (
                  <p className="info-label text-center py-4">
                    Aucun spectacle pour le moment.
                  </p>
                ) : (
                  <div className="row g-3">
                    {stats &&
                      stats.spectacles.map((s) => (
                        <div className="col-md-6 col-lg-4" key={s.id}>
                          <div className="rep-card">
                            <h5 className="artist-card-title">{s.title}</h5>
                            <p className="info-value">
                              <i className="fas fa-map-marker-alt me-1 text-warning"></i>
                              {s.location || "—"}
                            </p>
                            <p className="info-value">
                              <i className="fas fa-calendar me-1 text-warning"></i>
                              {new Date(s.date).toLocaleDateString("fr-FR")}
                            </p>
                            <hr />
                            <p className="info-label mb-1">Remplissage</p>
                            <div
                              style={{
                                background: "#e9ecef",
                                borderRadius: "10px",
                                height: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(100, s.fillRate)}%`,
                                  height: "100%",
                                  background: fillRateColor(s.fillRate),
                                  borderRadius: "10px",
                                }}
                              />
                            </div>
                            <p
                              className="info-value mt-1"
                              style={{
                                color: fillRateColor(s.fillRate),
                                fontWeight: 700,
                              }}
                            >
                              {s.fillRate.toFixed(0)}% — {s.seatsSold}/{s.totalCapacity} places
                            </p>
                            <p className="info-value">
                              <i className="fas fa-euro-sign me-1 text-success"></i>
                              <strong>{s.revenue.toFixed(2)} €</strong>
                            </p>
                            <Link
                              to={`/spectacles/${s.id}`}
                              className="btn btn-sm btn-dark text-warning w-100 mt-2"
                            >
                              <i className="fas fa-eye me-2"></i>Voir
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==== COMMENTAIRES ==== */}
          {activeTab === "commentaires" && (
            <div className="agency-card">
              <div className="card-accent" style={{ background: "#17a2b8" }}></div>
              <div className="card-content">
                <SectionLabel icon="comments" text="Commentaires sur mes spectacles" />
                <DataTable
                  columns={commentaireColumns}
                  data={commentaires}
                  progressPending={loadingComments}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun commentaire pour le moment"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProducteurDashboard;
