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
                        <a className="link-dark text-decoration-none me-3" href="#">
                            Politique de confidentialité
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;