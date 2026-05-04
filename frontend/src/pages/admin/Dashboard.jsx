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
  const [loadingSpectacles, setLoadingSpectacles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("spectacles");

  useEffect(() => {
    if (role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }

    fetch(`${API_URL}/api/spectacles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSpectacles(data);
        setLoadingSpectacles(false);
      });

    fetch(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      });
  }, [token, role, navigate]);

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
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <Link
            to={`/spectacles/${row.id}/edit`}
            className="btn btn-sm btn-warning"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            <i className="fas fa-pen"></i>
          </Link>
          <button
            onClick={() => deleteSpectacle(row.id, row.title)}
            className="btn btn-sm btn-outline-danger"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const userColumns = [
    { name: "Prénom", selector: (row) => row.firstName, sortable: true },
    { name: "Nom", selector: (row) => row.lastName, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Rôle", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/profile/${row.id}`}
            className="btn btn-sm btn-dark text-warning"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            <i className="fas fa-eye"></i>
          </Link>
          <button
            onClick={() => deleteUser(row.id, row.email)}
            className="btn btn-sm btn-outline-danger"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
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

  return (
    <>
      <PageHeader
        title="Dashboard Admin"
        subtitle="Gérez votre plateforme"
        breadcrumb={[{ label: "Dashboard", path: "/admin/dashboard" }]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          {/* Stats */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content text-center">
                  <i
                    className="fas fa-theater-masks fa-2x mb-2"
                    style={{ color: "#fec810" }}
                  ></i>
                  <h3
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {spectacles.length}
                  </h3>
                  <p className="info-label mb-0">Spectacles</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="agency-card">
                <div className="card-accent"></div>
                <div className="card-content text-center">
                  <i
                    className="fas fa-users fa-2x mb-2"
                    style={{ color: "#fec810" }}
                  ></i>
                  <h3
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {users.length}
                  </h3>
                  <p className="info-label mb-0">Utilisateurs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <button
              onClick={() => setActiveTab("spectacles")}
              className={`btn me-2 text-uppercase ${activeTab === "spectacles" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              <i className="fas fa-theater-masks me-2"></i>Spectacles
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`btn text-uppercase ${activeTab === "users" ? "btn-primary" : "btn-outline-secondary"}`}
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              <i className="fas fa-users me-2"></i>Utilisateurs
            </button>
          </div>

          {/* Tables */}
          {activeTab === "spectacles" && (
            <div className="agency-card">
              <div className="card-accent"></div>
              <div className="card-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SectionLabel
                    icon="theater-masks"
                    text="Gestion des spectacles"
                  />
                  <Link
                    to="/spectacles/create"
                    className="btn btn-primary btn-sm text-uppercase"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>Nouveau
                  </Link>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={exportCSV}
                    className="btn btn-outline-secondary btn-sm text-uppercase"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    <i className="fas fa-download me-2"></i>Export CSV
                  </button>
                  <Link
                    to="/spectacles/create"
                    className="btn btn-primary btn-sm text-uppercase"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>Nouveau
                  </Link>
                </div>
                <DataTable
                  columns={spectacleColumns}
                  data={spectacles}
                  progressPending={loadingSpectacles}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun spectacle trouvé"
                />
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="agency-card">
              <div className="card-accent"></div>
              <div className="card-content">
                <SectionLabel icon="users" text="Gestion des utilisateurs" />
                <DataTable
                  columns={userColumns}
                  data={users}
                  progressPending={loadingUsers}
                  pagination
                  paginationPerPage={10}
                  customStyles={customStyles}
                  noDataComponent="Aucun utilisateur trouvé"
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
