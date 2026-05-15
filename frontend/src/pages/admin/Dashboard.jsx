import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

const Dashboard = () => {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [spectacles, setSpectacles] = useState([]);
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const [pendingProducteurs, setPendingProducteurs] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingSpectacles, setLoadingSpectacles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [loadingPaiements, setLoadingPaiements] = useState(true);
  const [loadingCommentaires, setLoadingCommentaires] = useState(true);
  const [activeTab, setActiveTab] = useState("spectacles");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API_URL}/api/spectacles?size=1000`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setSpectacles(Array.isArray(data) ? data : data.content || []);
        setLoadingSpectacles(false);
      })
      .catch(() => setLoadingSpectacles(false));

    fetch(`${API_URL}/api/users`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch(() => setLoadingUsers(false));

    fetch(`${API_URL}/api/artists`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setLoadingArtists(false);
      })
      .catch(() => setLoadingArtists(false));

    fetch(`${API_URL}/api/reservations`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoadingReservations(false);
      })
      .catch(() => setLoadingReservations(false));

    fetch(`${API_URL}/api/paiements`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setPaiements(data);
        setLoadingPaiements(false);
      })
      .catch(() => setLoadingPaiements(false));

    fetch(`${API_URL}/api/commentaires`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setCommentaires(Array.isArray(data) ? data : []);
        setLoadingCommentaires(false);
      })
      .catch(() => setLoadingCommentaires(false));

    fetch(`${API_URL}/api/admin/producteurs/pending`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setPendingProducteurs(Array.isArray(data) ? data : []);
        setLoadingPending(false);
      })
      .catch(() => setLoadingPending(false));
  }, [token, role, navigate]);

  // ============================
  // PRODUCTEUR HANDLERS
  // ============================
  const approveProducteur = (userId) => {
    fetch(`${API_URL}/api/admin/producteurs/${userId}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        setPendingProducteurs(pendingProducteurs.filter((p) => p.id !== userId));
        // Refresh users list aussi
        fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((data) => setUsers(data));
      }
    });
  };

  const rejectProducteur = (userId) => {
    if (!window.confirm("Rejeter cette demande producteur ?")) return;
    fetch(`${API_URL}/api/admin/producteurs/${userId}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        setPendingProducteurs(pendingProducteurs.filter((p) => p.id !== userId));
      }
    });
  };

  const changeUserRole = (userId, newRole, currentEmail) => {
    if (!window.confirm(`Changer le rôle de ${currentEmail} en ${newRole} ?`)) return;
    fetch(`${API_URL}/api/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data }))
      )
      .then(({ ok, data }) => {
        if (!ok) {
          alert(data.message || data.error || "Erreur lors du changement de rôle");
          return;
        }
        setUsers(users.map((u) => (u.id === userId ? data : u)));
        // Si on a promu en producteur, retirer de la liste pending
        if (newRole !== "ROLE_PRODUCTEUR_PENDING") {
          setPendingProducteurs(pendingProducteurs.filter((p) => p.id !== userId));
        }
      })
      .catch((err) => alert("Erreur réseau : " + err.message));
  };

  // ============================
  // COMMENTAIRES HANDLERS
  // ============================
  const changeCommentaireStatut = (id, statut) => {
    fetch(`${API_URL}/api/commentaires/${id}/statut`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statut }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setCommentaires(commentaires.map((c) => (c.id === id ? updated : c)))
      );
  };

  const deleteCommentaire = (id) => {
    if (!window.confirm(`Supprimer le commentaire #${id} ?`)) return;
    fetch(`${API_URL}/api/commentaires/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setCommentaires(commentaires.filter((c) => c.id !== id)));
  };

  // ============================
  // DELETE HANDLERS
  // ============================
  const deleteSpectacle = (id, title) => {
    if (window.confirm(`Supprimer "${title}" ?`)) {
      fetch(`${API_URL}/api/spectacles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setSpectacles(spectacles.filter((s) => s.id !== id)));
    }
  };

  const deleteUser = (id, email) => {
    if (window.confirm(`Supprimer "${email}" ?`)) {
      fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setUsers(users.filter((u) => u.id !== id)));
    }
  };

  const deleteArtist = (id, name) => {
    if (window.confirm(`Supprimer "${name}" ?`)) {
      fetch(`${API_URL}/api/artists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setArtists(artists.filter((a) => a.id !== id)));
    }
  };

  const deleteReservation = (id) => {
    if (window.confirm(`Supprimer la reservation #${id} ?`)) {
      fetch(`${API_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => setReservations(reservations.filter((r) => r.id !== id)));
    }
  };

  // ============================
  // STATUS BADGE
  // ============================
  const statusBadge = (status) => {
    const colors = {
      CREATED: { bg: "#fff3cd", color: "#856404", icon: "clock" },
      CONFIRMED: { bg: "#d4edda", color: "#155724", icon: "check-circle" },
      CANCELLED: { bg: "#f8d7da", color: "#721c24", icon: "times-circle" },
      PAYE: { bg: "#d4edda", color: "#155724", icon: "check" },
      EN_ATTENTE: { bg: "#fff3cd", color: "#856404", icon: "hourglass-half" },
      REFUSE: { bg: "#f8d7da", color: "#721c24", icon: "ban" },
      PUBLIE: { bg: "#d4edda", color: "#155724", icon: "eye" },
      REJETE: { bg: "#f8d7da", color: "#721c24", icon: "eye-slash" },
    };
    const s = colors[status] || {
      bg: "#e2e3e5",
      color: "#383d41",
      icon: "question",
    };
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          backgroundColor: s.bg,
          color: s.color,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <i className={`fas fa-${s.icon} me-1`}></i>
        {status}
      </span>
    );
  };

  // ============================
  // COLUMNS
  // ============================
  const btnStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 700,
    fontSize: "0.7rem",
  };

  const spectacleColumns = [
    { name: "Titre", selector: (row) => row.title, sortable: true },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("fr-FR"),
      sortable: true,
    },
    { name: "Lieu", selector: (row) => row.location || "—", sortable: true },
    { name: "Prix", selector: (row) => `${row.price} €`, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/spectacles/${row.id}`}
            className="btn btn-sm btn-dark text-warning"
            style={btnStyle}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <Link
            to={`/spectacles/${row.id}/edit`}
            className="btn btn-sm btn-warning"
            style={btnStyle}
          >
            <i className="fas fa-pen"></i>
          </Link>
          <button
            onClick={() => deleteSpectacle(row.id, row.title)}
            className="btn btn-sm btn-outline-danger"
            style={btnStyle}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const userColumns = [
    {
      name: "Prenom",
      selector: (row) => row.firstName || row.prenom || "—",
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row) => row.lastName || row.nom || "—",
      sortable: true,
    },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Role",
      cell: (row) => (
        <select
          value={row.role || "ROLE_USER"}
          onChange={(e) => changeUserRole(row.id, e.target.value, row.email)}
          className="form-select form-select-sm"
          style={{
            fontSize: "0.75rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            border: "1px solid #dee2e6",
            backgroundColor:
              row.role === "ROLE_ADMIN"
                ? "#fec810"
                : row.role === "ROLE_PRODUCTEUR"
                ? "#cfe2ff"
                : row.role === "ROLE_PRODUCTEUR_PENDING"
                ? "#fff3cd"
                : "#e2e3e5",
            color: row.role === "ROLE_ADMIN" ? "#212529" : "#383d41",
            cursor: "pointer",
          }}
        >
          <option value="ROLE_USER">USER</option>
          <option value="ROLE_PRODUCTEUR">PRODUCTEUR</option>
          <option value="ROLE_PRODUCTEUR_PENDING">PRODUCTEUR (en attente)</option>
          <option value="ROLE_ADMIN">ADMIN</option>
        </select>
      ),
      sortable: true,
      width: "210px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/profile/${row.id}`}
            className="btn btn-sm btn-dark text-warning"
            style={btnStyle}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <button
            onClick={() => deleteUser(row.id, row.email)}
            className="btn btn-sm btn-outline-danger"
            style={btnStyle}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const artistColumns = [
    { name: "Nom", selector: (row) => row.name, sortable: true },
    { name: "Genre", selector: (row) => row.genre || "—", sortable: true },
    { name: "Pays", selector: (row) => row.country || "—", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/artists/${row.id}`}
            className="btn btn-sm btn-dark text-warning"
            style={btnStyle}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <Link
            to={`/artists/${row.id}/edit`}
            className="btn btn-sm btn-warning"
            style={btnStyle}
          >
            <i className="fas fa-pen"></i>
          </Link>
          <button
            onClick={() => deleteArtist(row.id, row.name)}
            className="btn btn-sm btn-outline-danger"
            style={btnStyle}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const reservationColumns = [
    {
      name: "ID",
      selector: (row) => `#${row.id}`,
      sortable: true,
      width: "70px",
    },
    {
      name: "Spectacle",
      selector: (row) => row.representation?.spectacle?.title || "—",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) =>
        row.representation?.dateHeure
          ? new Date(row.representation.dateHeure).toLocaleDateString("fr-FR")
          : "—",
      sortable: true,
    },
    {
      name: "Places",
      selector: (row) => row.numberOfSeats,
      sortable: true,
      width: "80px",
    },
    {
      name: "Utilisateur",
      selector: (row) =>
        row.user ? `${row.user.prenom} ${row.user.nom}` : "—",
      sortable: true,
    },
    { name: "Statut", cell: (row) => statusBadge(row.status), sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => deleteReservation(row.id)}
          className="btn btn-sm btn-outline-danger"
          style={btnStyle}
        >
          <i className="fas fa-trash"></i>
        </button>
      ),
    },
  ];

  const commentaireColumns = [
    {
      name: "ID",
      selector: (row) => `#${row.id}`,
      sortable: true,
      width: "70px",
    },
    {
      name: "Spectacle",
      selector: (row) => row.spectacleTitle || "—",
      sortable: true,
    },
    {
      name: "Auteur",
      selector: (row) =>
        `${row.userPrenom || ""} ${row.userNom || ""}`.trim() || "—",
      sortable: true,
    },
    {
      name: "Note",
      cell: (row) => (
        <span style={{ color: "#fec810", fontWeight: 700 }}>
          {row.note}/5 <i className="fas fa-star ms-1"></i>
        </span>
      ),
      width: "90px",
      sortable: true,
      selector: (row) => row.note,
    },
    {
      name: "Contenu",
      cell: (row) => (
        <div
          style={{
            maxWidth: "300px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.contenu}
        >
          {row.contenu}
        </div>
      ),
    },
    {
      name: "Statut",
      cell: (row) => statusBadge(row.statut),
      sortable: true,
      selector: (row) => row.statut,
      width: "120px",
    },
    {
      name: "Date",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "—",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          {row.statut === "PUBLIE" ? (
            <button
              onClick={() => changeCommentaireStatut(row.id, "REJETE")}
              className="btn btn-sm btn-outline-warning"
              style={btnStyle}
              title="Masquer (rejeter)"
            >
              <i className="fas fa-eye-slash"></i>
            </button>
          ) : (
            <button
              onClick={() => changeCommentaireStatut(row.id, "PUBLIE")}
              className="btn btn-sm btn-outline-success"
              style={btnStyle}
              title="Republier"
            >
              <i className="fas fa-eye"></i>
            </button>
          )}
          <button
            onClick={() => deleteCommentaire(row.id)}
            className="btn btn-sm btn-outline-danger"
            style={btnStyle}
            title="Supprimer"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const paiementColumns = [
    {
      name: "ID",
      selector: (row) => `#${row.id}`,
      sortable: true,
      width: "70px",
    },
    { name: "Montant", selector: (row) => `${row.montant} €`, sortable: true },
    { name: "Methode", selector: (row) => row.methode || "—", sortable: true },
    { name: "Statut", cell: (row) => statusBadge(row.statut), sortable: true },
    {
      name: "Date",
      selector: (row) =>
        row.datePaiement
          ? new Date(row.datePaiement).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
      sortable: true,
    },
    {
      name: "Reservation",
      selector: (row) => (row.reservation ? `#${row.reservation.id}` : "—"),
    },
  ];

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

  // ============================
  // CSV EXPORT / IMPORT
  // ============================
  const exportCSV = () => {
    const headers = ["ID", "Titre", "Date", "Lieu", "Prix", "Description"];
    const rows = spectacles.map((s) => [
      s.id,
      s.title,
      new Date(s.date).toLocaleDateString("fr-FR"),
      s.location || "",
      s.price,
      s.description || "",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "spectacles.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").slice(1);
      const promises = lines
        .filter((line) => line.trim())
        .map((line) => {
          const [, title, date, location, price, description] = line
            .split(",")
            .map((cell) => cell.replace(/^"|"$/g, "").trim());
          return fetch(`${API_URL}/api/spectacles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              date: new Date(date.split("/").reverse().join("-")).toISOString(),
              location,
              price: parseFloat(price),
              description,
            }),
          });
        });
      Promise.all(promises)
        .then(() => {
          setImportMessage({
            type: "success",
            text: `${lines.length} spectacles importes !`,
          });
          fetch(`${API_URL}/api/spectacles`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((data) => setSpectacles(data));
        })
        .catch(() =>
          setImportMessage({ type: "error", text: "Erreur lors de l'import." }),
        )
        .finally(() => setImporting(false));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ============================
  // COMPUTED STATS
  // ============================
  const totalRevenus = paiements
    .filter((p) => p.statut === "PAYE")
    .reduce((sum, p) => sum + (p.montant || 0), 0);

  const confirmedReservations = reservations.filter(
    (r) => r.status === "CONFIRMED",
  ).length;

  // ============================
  // TABS CONFIG
  // ============================
  const tabs = [
    { key: "spectacles", label: "Spectacles", icon: "theater-masks" },
    { key: "artists", label: "Artistes", icon: "music" },
    { key: "reservations", label: "Reservations", icon: "ticket-alt" },
    { key: "paiements", label: "Paiements", icon: "credit-card" },
    { key: "users", label: "Utilisateurs", icon: "users" },
    { key: "commentaires", label: "Commentaires", icon: "comments" },
    {
      key: "producteurs",
      label: `Producteurs${pendingProducteurs.length > 0 ? ` (${pendingProducteurs.length})` : ""}`,
      icon: "briefcase",
    },
  ];

  // ============================
  // FILTERED DATA
  // ============================

  const filteredSpectacles = spectacles.filter((s) =>
    [s.title, s.location].some((v) =>
      v?.toLowerCase().includes(searchText.toLowerCase()),
    ),
  );
  const filteredArtists = artists.filter((a) =>
    [a.name, a.genre, a.country].some((v) =>
      v?.toLowerCase().includes(searchText.toLowerCase()),
    ),
  );
  const filteredUsers = users.filter((u) =>
    [u.email, u.prenom, u.nom, u.firstName, u.lastName].some((v) =>
      v?.toLowerCase().includes(searchText.toLowerCase()),
    ),
  );
  const filteredReservations = reservations.filter((r) =>
    [
      r.representation?.spectacle?.title,
      r.user?.prenom,
      r.user?.nom,
      r.status,
    ].some((v) => v?.toLowerCase().includes(searchText.toLowerCase())),
  );
  const filteredCommentaires = commentaires.filter((c) =>
    [c.contenu, c.spectacleTitle, c.userPrenom, c.userNom, c.statut].some(
      (v) => v?.toLowerCase().includes(searchText.toLowerCase()),
    ),
  );

  const searchBar = (
    <input
      type="text"
      placeholder="Rechercher..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="form-control form-control-sm"
      style={{ maxWidth: "250px", fontFamily: "Roboto Slab, serif" }}
    />
  );

  return (
    <>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Gerez votre plateforme"
        breadcrumb={[{ label: "Dashboard", path: "/admin/dashboard" }]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          {/* ==================== STATS ==================== */}
          <div className="row g-3 mb-4">
            {[
              {
                icon: "theater-masks",
                count: spectacles.length,
                label: "Spectacles",
                color: "#fec810",
              },
              {
                icon: "music",
                count: artists.length,
                label: "Artistes",
                color: "#6f42c1",
              },
              {
                icon: "ticket-alt",
                count: reservations.length,
                label: "Reservations",
                color: "#0d6efd",
              },
              {
                icon: "credit-card",
                count: `${totalRevenus.toFixed(2)} €`,
                label: "Revenus",
                color: "#198754",
              },
              {
                icon: "users",
                count: users.length,
                label: "Utilisateurs",
                color: "#dc3545",
              },
            ].map((stat, i) => (
              <div className="col" key={i}>
                <div className="agency-card">
                  <div
                    className="card-accent"
                    style={{ background: stat.color }}
                  ></div>
                  <div
                    className="card-content text-center"
                    style={{ padding: "20px 10px" }}
                  >
                    <i
                      className={`fas fa-${stat.icon} fa-2x mb-2`}
                      style={{ color: stat.color }}
                    ></i>
                    <h3
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.4rem",
                      }}
                    >
                      {stat.count}
                    </h3>
                    <p
                      className="info-label mb-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==================== TABS ==================== */}
          <div className="mb-4 d-flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchText("");
                }}
                className={`btn text-uppercase ${activeTab === tab.key ? "btn-primary" : "btn-outline-secondary"}`}
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

          {importMessage && (
            <div
              className={`${importMessage.type === "success" ? "alert-success-custom" : "alert-error"} mb-4`}
            >
              <i
                className={`fas fa-${importMessage.type === "success" ? "check-circle" : "exclamation-circle"} me-2`}
              ></i>
              {importMessage.text}
            </div>
          )}

          {/* ==================== SPECTACLES ==================== */}
          {activeTab === "spectacles" && (
            <div className="agency-card">
              <div className="card-accent"></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel
                    icon="theater-masks"
                    text="Gestion des spectacles"
                  />
                  <div className="d-flex gap-2">
                    <label
                      className="btn btn-outline-secondary btn-sm text-uppercase mb-0"
                      style={btnStyle}
                    >
                      {importing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Import...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload me-2"></i>Import CSV
                        </>
                      )}
                      <input
                        type="file"
                        accept=".csv"
                        onChange={importCSV}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      onClick={exportCSV}
                      className="btn btn-outline-secondary btn-sm text-uppercase"
                      style={btnStyle}
                    >
                      <i className="fas fa-download me-2"></i>Export CSV
                    </button>
                    <Link
                      to="/spectacles/create"
                      className="btn btn-primary btn-sm text-uppercase"
                      style={btnStyle}
                    >
                      <i className="fas fa-plus me-2"></i>Nouveau
                    </Link>
                  </div>
                </div>
                <DataTable
                  columns={spectacleColumns}
                  data={filteredSpectacles}
                  subHeader
                  subHeaderComponent={searchBar}
                  progressPending={loadingSpectacles}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun spectacle"
                />
              </div>
            </div>
          )}

          {/* ==================== ARTISTES ==================== */}
          {activeTab === "artists" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#6f42c1" }}
              ></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel icon="music" text="Gestion des artistes" />
                  <Link
                    to="/artists/create"
                    className="btn btn-primary btn-sm text-uppercase"
                    style={btnStyle}
                  >
                    <i className="fas fa-plus me-2"></i>Nouveau
                  </Link>
                </div>
                <DataTable
                  columns={artistColumns}
                  data={filteredArtists}
                  subHeader
                  subHeaderComponent={searchBar}
                  progressPending={loadingArtists}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun artiste"
                />
              </div>
            </div>
          )}

          {/* ==================== RESERVATIONS ==================== */}
          {activeTab === "reservations" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#0d6efd" }}
              ></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel
                    icon="ticket-alt"
                    text="Gestion des reservations"
                  />
                  <div className="d-flex gap-3 align-items-center">
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      <i
                        className="fas fa-check-circle me-1"
                        style={{ color: "#198754" }}
                      ></i>
                      {confirmedReservations} confirmees / {reservations.length}{" "}
                      total
                    </span>
                  </div>
                </div>
                <DataTable
                  columns={reservationColumns}
                  data={filteredReservations}
                  subHeader
                  subHeaderComponent={searchBar}
                  progressPending={loadingReservations}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucune reservation"
                />
              </div>
            </div>
          )}

          {/* ==================== PAIEMENTS ==================== */}
          {activeTab === "paiements" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#198754" }}
              ></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel
                    icon="credit-card"
                    text="Gestion des paiements (Stripe)"
                  />
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#198754",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Total : {totalRevenus.toFixed(2)} €
                  </span>
                </div>
                <DataTable
                  columns={paiementColumns}
                  data={paiements}
                  progressPending={loadingPaiements}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun paiement"
                />
              </div>
            </div>
          )}

          {/* ==================== COMMENTAIRES ==================== */}
          {activeTab === "commentaires" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#17a2b8" }}
              ></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel
                    icon="comments"
                    text="Modération des commentaires"
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    <i className="fas fa-eye me-1" style={{ color: "#198754" }}></i>
                    {commentaires.filter((c) => c.statut === "PUBLIE").length} publiés /
                    <i
                      className="fas fa-eye-slash ms-2 me-1"
                      style={{ color: "#dc3545" }}
                    ></i>
                    {commentaires.filter((c) => c.statut === "REJETE").length} rejetés
                  </span>
                </div>
                <DataTable
                  columns={commentaireColumns}
                  data={filteredCommentaires}
                  subHeader
                  subHeaderComponent={searchBar}
                  progressPending={loadingCommentaires}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun commentaire"
                />
              </div>
            </div>
          )}

          {/* ==================== PRODUCTEURS ==================== */}
          {activeTab === "producteurs" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#6f42c1" }}
              ></div>
              <div className="card-content">
                <SectionLabel
                  icon="briefcase"
                  text="Demandes producteur en attente"
                />
                {loadingPending ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : pendingProducteurs.length === 0 ? (
                  <p className="info-label text-center py-4">
                    Aucune demande en attente.
                  </p>
                ) : (
                  <DataTable
                    columns={[
                      {
                        name: "ID",
                        selector: (r) => `#${r.id}`,
                        width: "70px",
                      },
                      {
                        name: "Prénom",
                        selector: (r) => r.firstName || "—",
                        sortable: true,
                      },
                      {
                        name: "Nom",
                        selector: (r) => r.lastName || "—",
                        sortable: true,
                      },
                      { name: "Email", selector: (r) => r.email, sortable: true },
                      {
                        name: "Actions",
                        cell: (r) => (
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => approveProducteur(r.id)}
                              className="btn btn-sm btn-success text-uppercase"
                              style={btnStyle}
                            >
                              <i className="fas fa-check me-1"></i>Approuver
                            </button>
                            <button
                              onClick={() => rejectProducteur(r.id)}
                              className="btn btn-sm btn-outline-danger text-uppercase"
                              style={btnStyle}
                            >
                              <i className="fas fa-times me-1"></i>Rejeter
                            </button>
                          </div>
                        ),
                      },
                    ]}
                    data={pendingProducteurs}
                    pagination
                    paginationPerPage={10}
                    customStyles={customStyles}
                  />
                )}
              </div>
            </div>
          )}

          {/* ==================== UTILISATEURS ==================== */}
          {activeTab === "users" && (
            <div className="agency-card">
              <div
                className="card-accent"
                style={{ background: "#dc3545" }}
              ></div>
              <div className="card-content">
                <SectionLabel icon="users" text="Gestion des utilisateurs" />
                <DataTable
                  columns={userColumns}
                  data={filteredUsers}
                  subHeader
                  subHeaderComponent={searchBar}
                  progressPending={loadingUsers}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun utilisateur"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
