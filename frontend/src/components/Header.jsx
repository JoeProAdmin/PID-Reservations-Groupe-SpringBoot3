import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { SUPPORTED_LANGUAGES } from "../i18n/translations";

const Header = () => {
  const location = useLocation();
  const { token, role, prenom, nom, userId, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

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
            <style>{`#mainNav .nav-link, #mainNav .nav-link.btn { white-space: nowrap; }`}</style>
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <Link
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                    to="/"
                >
                  {t("nav.spectacles")}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                    className={`nav-link ${isActive("/artists") ? "active" : ""}`}
                    to="/artists"
                >
                  {t("nav.artists")}
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
                        {t("nav.reservations")}
                      </Link>
                    </li>

                    {role === "ROLE_ADMIN" && (
                        <li className="nav-item">
                          <Link className="nav-link" to="/admin/dashboard">
                            {t("nav.adminDashboard")}
                          </Link>
                        </li>
                    )}

                    {(role === "ROLE_PRODUCTEUR" || role === "ROLE_PRODUCTEUR_PENDING") && (
                        <li className="nav-item">
                          <Link className="nav-link" to="/producteur/dashboard">
                            <i className="fas fa-briefcase me-1"></i>
                            {t("nav.producerDashboard")}
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
                        {t("nav.logout")}
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
                        {t("nav.login")}
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                          className={`nav-link ${
                              isActive("/register") ? "active" : ""
                          }`}
                          to="/register"
                      >
                        {t("nav.register")}
                      </Link>
                    </li>
                  </>
              )}

              {/* Selecteur de langue (drapeaux) */}
              <li className="nav-item d-flex align-items-center ms-lg-2">
                <div className="d-flex gap-1">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      title={l.label}
                      style={{
                        background: "transparent",
                        border: lang === l.code ? "2px solid #fec810" : "2px solid transparent",
                        borderRadius: "4px",
                        padding: "2px 4px",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        opacity: lang === l.code ? 1 : 0.5,
                        transition: "opacity 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = lang === l.code ? 1 : 0.5)}
                    >
                      {l.flag}
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default Header;
