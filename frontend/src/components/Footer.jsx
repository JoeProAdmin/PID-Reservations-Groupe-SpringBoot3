import { Link } from "react-router-dom";
import API_URL from "../config";

const Footer = () => {
    return (
        <footer className="footer py-4">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-4 text-lg-start"
                        style={{ fontFamily: "'Roboto Slab', serif" }}>
                        Copyright &copy; ArtistDB 2026
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
                            title="S'abonner au flux RSS"
                        >
                            <i className="fas fa-rss text-warning me-1"></i>RSS
                        </a>
                        <Link className="link-dark text-decoration-none" to="/mentions-legales">
                            Mentions légales
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
