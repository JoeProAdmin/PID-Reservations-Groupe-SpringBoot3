import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "cookieConsent";
const COOKIE_DATE_KEY = "cookieConsentDate";

export const getCookieConsent = () => localStorage.getItem(COOKIE_KEY);

export const setCookieConsent = (value) => {
  localStorage.setItem(COOKIE_KEY, value);
  localStorage.setItem(COOKIE_DATE_KEY, new Date().toISOString());
  window.dispatchEvent(new Event("cookieConsentChanged"));
};

export const clearCookieConsent = () => {
  localStorage.removeItem(COOKIE_KEY);
  localStorage.removeItem(COOKIE_DATE_KEY);
  window.dispatchEvent(new Event("cookieConsentChanged"));
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkConsent = () => setVisible(!getCookieConsent());
    checkConsent();
    window.addEventListener("cookieConsentChanged", checkConsent);
    return () => window.removeEventListener("cookieConsentChanged", checkConsent);
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#1a1a1a",
        borderTop: "4px solid #fec810",
        padding: "20px",
        zIndex: 9999,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="d-flex align-items-start">
              <i
                className="fas fa-cookie-bite me-3"
                style={{ color: "#fec810", fontSize: "2rem" }}
              ></i>
              <div>
                <h5
                  style={{
                    color: "#fec810",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  Respect de votre vie privée
                </h5>
                <p
                  style={{
                    color: "#fff",
                    fontFamily: "Roboto Slab, serif",
                    fontSize: "0.9rem",
                    marginBottom: 0,
                  }}
                >
                  Nous utilisons des cookies techniques essentiels au
                  fonctionnement du site (session, authentification) et, avec
                  votre accord, des cookies de mesure d'audience.{" "}
                  <Link
                    to="/mentions-legales"
                    style={{ color: "#fec810", fontWeight: 700 }}
                  >
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
              <button
                onClick={handleReject}
                className="btn btn-outline-light text-uppercase"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                <i className="fas fa-times me-2"></i>Refuser
              </button>
              <button
                onClick={handleAccept}
                className="btn btn-primary text-uppercase"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                }}
              >
                <i className="fas fa-check me-2"></i>Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
