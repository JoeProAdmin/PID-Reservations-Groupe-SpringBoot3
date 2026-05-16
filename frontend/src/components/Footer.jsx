import { Link } from "react-router-dom";
import API_URL from "../config";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="footer py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-lg-start"
                        style={{ fontFamily: "'Roboto Slab', serif" }}>
                        {t("footer.copyright")} &copy; ArtistDB 2026
                    </div>
                    <div className="col-lg-4 my-3 my-lg-0 text-center">
                        <i className="fas fa-music text-primary"></i>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <a
                            className="link-dark text-decoration-none me-3"
                            href={`${API_URL}/rss/spectacles`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t("footer.rss")}
                        >
                            <i className="fas fa-rss text-warning me-1"></i>{t("footer.rss")}
                        </a>
                        <Link className="link-dark text-decoration-none" to="/mentions-legales">
                            {t("footer.legal")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
