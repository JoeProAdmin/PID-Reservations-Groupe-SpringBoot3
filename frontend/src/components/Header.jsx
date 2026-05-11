import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { token, role, prenom, nom, userId, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-music me-2"></i>
            ArtistDB
          </Link>

          <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
          >
            Menu <i className="fas fa-bars ms-1"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <Link
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                    to="/"
                >
                  Spectacles
                </Link>
              </li>

              <li className="nav-item">
                <Link
                    className={`nav-link ${isActive("/artists") ? "active" : ""}`}
                    to="/artists"
                >
                  Artistes
                </Link>
              </li>

              {token ? (
                  <>
                    <li className="nav-item">
                      <Link
                          className="nav-link"
                          to={`/profile/${userId}`}
                          style={{ color: "#fec810" }}
                      >
                        <i className="fas fa-user me-1"></i>
                        {prenom} {nom}
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/mes-reservations">
                        <i className="fas fa-ticket-alt me-1"></i>
                        Mes Réservations
                      </Link>
                    </li>

                    {role === "ROLE_ADMIN" && (
                        <li className="nav-item">
                          <Link className="nav-link" to="/admin/dashboard">
                            Dashboard
                          </Link>
                        </li>
                    )}

                    <li className="nav-item">
                      <button
                          className="nav-link btn btn-link text-uppercase"
                          onClick={logout}
                          style={{ color: "#fff" }}
                      >
                        <i className="fas fa-sign-out-alt me-1"></i>
                        Déconnexion
                      </button>
                    </li>
                  </>
              ) : (
                  <>
                    <li className="nav-item">
                      <Link
                          className={`nav-link ${
                              isActive("/login") ? "active" : ""
                          }`}
                          to="/login"
                      >
                        Connexion
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                          className={`nav-link ${
                              isActive("/register") ? "active" : ""
                          }`}
                          to="/register"
                      >
                        Inscription
                      </Link>
                    </li>
                  </>
              )}
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default Header;