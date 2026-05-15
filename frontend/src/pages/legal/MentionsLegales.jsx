import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import {
  getCookieConsent,
  setCookieConsent,
  clearCookieConsent,
} from "../../components/CookieBanner";

const MentionsLegales = () => {
  const [consent, setConsent] = useState(getCookieConsent());

  useEffect(() => {
    const refresh = () => setConsent(getCookieConsent());
    window.addEventListener("cookieConsentChanged", refresh);
    return () =>
      window.removeEventListener("cookieConsentChanged", refresh);
  }, []);

  const consentLabel = {
    accepted: { text: "Acceptés", color: "#198754", icon: "check-circle" },
    rejected: { text: "Refusés", color: "#dc3545", icon: "times-circle" },
  }[consent] || { text: "Non choisi", color: "#6c757d", icon: "question-circle" };

  return (
    <>
      <PageHeader
        title="Mentions légales & Confidentialité"
        subtitle="Vos droits et nos obligations"
        breadcrumb={[
          { label: "Accueil", path: "/" },
          { label: "Mentions légales" },
        ]}
      />

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {/* ====== MENTIONS LÉGALES ====== */}
              <div className="agency-card mb-4">
                <div className="card-accent"></div>
                <div className="card-content">
                  <SectionLabel icon="building" text="Mentions légales" />

                  <p className="info-label mb-1">Éditeur du site</p>
                  <p className="info-value mb-3">
                    PID Réservations — Projet académique réalisé dans le cadre
                    du cours de Projet Intégré (ICC).
                  </p>

                  <p className="info-label mb-1">Contact</p>
                  <p className="info-value mb-3">contact@pid-reservations.be</p>

                  <p className="info-label mb-1">Hébergement</p>
                  <p className="info-value mb-3">
                    Frontend déployé sur Vercel — Backend déployé sur Render —
                    Base de données MySQL.
                  </p>

                  <p className="info-label mb-1">Technologies</p>
                  <p className="info-value mb-0">
                    React 18, Spring Boot 3, MySQL, Stripe (paiements),
                    Mailtrap (emails de test).
                  </p>
                </div>
              </div>

              {/* ====== POLITIQUE DE CONFIDENTIALITÉ ====== */}
              <div className="agency-card mb-4">
                <div className="card-accent" style={{ background: "#0d6efd" }}></div>
                <div className="card-content">
                  <SectionLabel
                    icon="user-shield"
                    text="Politique de confidentialité (RGPD)"
                  />

                  <p className="info-label mb-1">Données collectées</p>
                  <p className="text-description mb-3">
                    Lors de votre inscription, nous collectons : votre nom,
                    prénom, email et un mot de passe (stocké chiffré avec
                    BCrypt). Lors d'une réservation, nous conservons l'historique
                    de vos achats pour vous permettre d'y accéder dans votre
                    espace personnel.
                  </p>

                  <p className="info-label mb-1">Finalité</p>
                  <p className="text-description mb-3">
                    Vos données servent uniquement à fournir le service de
                    réservation : authentification, achat de billets, envoi
                    d'emails de confirmation et de réinitialisation de mot de
                    passe. Aucune donnée n'est revendue à des tiers.
                  </p>

                  <p className="info-label mb-1">Durée de conservation</p>
                  <p className="text-description mb-3">
                    Vos données sont conservées tant que votre compte est actif.
                    À la suppression de votre compte, vos données personnelles
                    sont effacées dans un délai de 30 jours (les réservations
                    historiques sont anonymisées pour la comptabilité).
                  </p>

                  <p className="info-label mb-1">Vos droits</p>
                  <p className="text-description mb-0">
                    Conformément au RGPD, vous disposez d'un droit d'accès, de
                    rectification, de suppression et de portabilité de vos
                    données. Pour exercer ces droits, contactez-nous à{" "}
                    <strong>contact@pid-reservations.be</strong>.
                  </p>
                </div>
              </div>

              {/* ====== COOKIES ====== */}
              <div className="agency-card mb-4">
                <div className="card-accent" style={{ background: "#fec810" }}></div>
                <div className="card-content">
                  <SectionLabel icon="cookie-bite" text="Cookies" />

                  <div
                    className="mb-4 p-3"
                    style={{
                      background: "#f8f9fa",
                      borderLeft: `4px solid ${consentLabel.color}`,
                    }}
                  >
                    <p className="info-label mb-1">Votre choix actuel</p>
                    <p
                      className="info-value mb-2"
                      style={{ color: consentLabel.color, fontWeight: 700 }}
                    >
                      <i
                        className={`fas fa-${consentLabel.icon} me-2`}
                      ></i>
                      Cookies optionnels : {consentLabel.text}
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        onClick={() => setCookieConsent("accepted")}
                        className="btn btn-sm btn-success text-uppercase"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        <i className="fas fa-check me-1"></i>Accepter
                      </button>
                      <button
                        onClick={() => setCookieConsent("rejected")}
                        className="btn btn-sm btn-outline-danger text-uppercase"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        <i className="fas fa-times me-1"></i>Refuser
                      </button>
                      <button
                        onClick={clearCookieConsent}
                        className="btn btn-sm btn-outline-secondary text-uppercase"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        <i className="fas fa-redo me-1"></i>Réinitialiser
                      </button>
                    </div>
                  </div>

                  <p className="info-label mb-1">Cookies techniques (obligatoires)</p>
                  <p className="text-description mb-3">
                    Le site utilise <code>localStorage</code> pour conserver
                    votre token JWT (session de connexion) et votre profil
                    utilisateur (prénom, nom, rôle). Ces données sont
                    indispensables au fonctionnement et ne nécessitent pas votre
                    consentement.
                  </p>

                  <p className="info-label mb-1">Cookies optionnels</p>
                  <p className="text-description mb-0">
                    Aucun cookie de tracking tiers (Google Analytics, Facebook
                    Pixel, etc.) n'est actuellement utilisé. Le bandeau de
                    consentement vous permettra d'accepter ou refuser ces
                    cookies si nous en ajoutons à l'avenir.
                  </p>
                </div>
              </div>

              {/* ====== STRIPE / PAIEMENTS ====== */}
              <div className="agency-card">
                <div className="card-accent" style={{ background: "#198754" }}></div>
                <div className="card-content">
                  <SectionLabel icon="lock" text="Paiements sécurisés" />
                  <p className="text-description mb-0">
                    Les paiements sont traités par <strong>Stripe</strong>.
                    Aucune donnée bancaire n'est stockée sur nos serveurs : le
                    numéro de carte est saisi directement dans un formulaire
                    sécurisé hébergé par Stripe (norme PCI-DSS).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MentionsLegales;
