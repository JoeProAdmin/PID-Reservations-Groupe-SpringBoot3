import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import SectionLabel from "../../components/SectionLabel";
import { useLanguage } from "../../context/LanguageContext";
import {
  getCookieConsent,
  setCookieConsent,
  clearCookieConsent,
} from "../../components/CookieBanner";

const MentionsLegales = () => {
  const { t } = useLanguage();
  const [consent, setConsent] = useState(getCookieConsent());

  useEffect(() => {
    const refresh = () => setConsent(getCookieConsent());
    window.addEventListener("cookieConsentChanged", refresh);
    return () =>
      window.removeEventListener("cookieConsentChanged", refresh);
  }, []);

  const consentLabel = {
    accepted: { text: t("legal.cookiesAccepted"), color: "#198754", icon: "check-circle" },
    rejected: { text: t("legal.cookiesRejected"), color: "#dc3545", icon: "times-circle" },
  }[consent] || { text: t("legal.cookiesNotChosen"), color: "#6c757d", icon: "question-circle" };

  return (
    <>
      <PageHeader
        title={t("legal.title")}
        subtitle={t("legal.subtitle")}
        breadcrumb={[
          { label: t("paySuccess.home"), path: "/" },
          { label: t("legal.legalNotice") },
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
                  <SectionLabel icon="building" text={t("legal.legalNotice")} />

                  <p className="info-label mb-1">{t("legal.editor")}</p>
                  <p className="info-value mb-3">{t("legal.editorDesc")}</p>

                  <p className="info-label mb-1">{t("legal.contact")}</p>
                  <p className="info-value mb-3">contact@pid-reservations.be</p>

                  <p className="info-label mb-1">{t("legal.hosting")}</p>
                  <p className="info-value mb-3">{t("legal.hostingDesc")}</p>

                  <p className="info-label mb-1">{t("legal.tech")}</p>
                  <p className="info-value mb-0">{t("legal.techDesc")}</p>
                </div>
              </div>

              {/* ====== POLITIQUE DE CONFIDENTIALITÉ ====== */}
              <div className="agency-card mb-4">
                <div className="card-accent" style={{ background: "#0d6efd" }}></div>
                <div className="card-content">
                  <SectionLabel
                    icon="user-shield"
                    text={t("legal.privacy")}
                  />

                  <p className="info-label mb-1">{t("legal.dataCollected")}</p>
                  <p className="text-description mb-3">{t("legal.dataCollectedDesc")}</p>

                  <p className="info-label mb-1">{t("legal.purpose")}</p>
                  <p className="text-description mb-3">{t("legal.purposeDesc")}</p>

                  <p className="info-label mb-1">{t("legal.retention")}</p>
                  <p className="text-description mb-3">{t("legal.retentionDesc")}</p>

                  <p className="info-label mb-1">{t("legal.rights")}</p>
                  <p className="text-description mb-0">
                    {t("legal.rightsDesc")}{" "}
                    <strong>contact@pid-reservations.be</strong>.
                  </p>
                </div>
              </div>

              {/* ====== COOKIES ====== */}
              <div className="agency-card mb-4">
                <div className="card-accent" style={{ background: "#fec810" }}></div>
                <div className="card-content">
                  <SectionLabel icon="cookie-bite" text={t("legal.cookies")} />

                  <div
                    className="mb-4 p-3"
                    style={{
                      background: "#f8f9fa",
                      borderLeft: `4px solid ${consentLabel.color}`,
                    }}
                  >
                    <p className="info-label mb-1">{t("legal.cookiesYourChoice")}</p>
                    <p
                      className="info-value mb-2"
                      style={{ color: consentLabel.color, fontWeight: 700 }}
                    >
                      <i
                        className={`fas fa-${consentLabel.icon} me-2`}
                      ></i>
                      {t("legal.cookiesOptional")} : {consentLabel.text}
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
                        <i className="fas fa-check me-1"></i>{t("legal.cookiesAccept")}
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
                        <i className="fas fa-times me-1"></i>{t("legal.cookiesReject")}
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
                        <i className="fas fa-redo me-1"></i>{t("legal.cookiesReset")}
                      </button>
                    </div>
                  </div>

                  <p className="info-label mb-1">{t("legal.cookiesTechnical")}</p>
                  <p className="text-description mb-3">{t("legal.cookiesTechnicalDesc")}</p>

                  <p className="info-label mb-1">{t("legal.cookiesOptional")}</p>
                  <p className="text-description mb-0">{t("legal.cookiesOptionalDesc")}</p>
                </div>
              </div>

              {/* ====== STRIPE / PAIEMENTS ====== */}
              <div className="agency-card">
                <div className="card-accent" style={{ background: "#198754" }}></div>
                <div className="card-content">
                  <SectionLabel icon="lock" text={t("legal.payments")} />
                  <p className="text-description mb-0">{t("legal.paymentsDesc")}</p>
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
