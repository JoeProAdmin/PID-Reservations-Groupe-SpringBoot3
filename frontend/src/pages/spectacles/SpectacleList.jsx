import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const PAGE_SIZE = 9;

const SpectacleList = () => {
    const { role } = useAuth();

    const [spectacles, setSpectacles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterLocation, setFilterLocation] = useState('');

    // Debounce de la recherche pour ne pas spam le backend
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset à la page 0 quand un filtre/tri change
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch, sortBy, sortOrder, filterLocation]);

    // Map des champs front -> champs backend
    const sortField = useMemo(() => {
        if (sortBy === 'price') return 'price';
        if (sortBy === 'name') return 'title';
        return 'date';
    }, [sortBy]);

    // Charger la liste des lieux (1 fois)
    useEffect(() => {
        fetch(`${API_URL}/api/spectacles/locations`)
            .then(res => res.json())
            .then(data => setLocations(Array.isArray(data) ? data : []))
            .catch(() => setLocations([]));
    }, []);

    const fetchSpectacles = useCallback(() => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', PAGE_SIZE);
        params.append('sort', `${sortField},${sortOrder}`);
        if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
        if (filterLocation) params.append('location', filterLocation);

        fetch(`${API_URL}/api/spectacles?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error('Erreur lors du chargement');
                return res.json();
            })
            .then(data => {
                setSpectacles(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [page, sortField, sortOrder, debouncedSearch, filterLocation]);

    useEffect(() => {
        fetchSpectacles();
    }, [fetchSpectacles]);

    const goToPage = (p) => {
        if (p < 0 || p >= totalPages) return;
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Numéros de page à afficher (max 5 autour de la page courante)
    const pageNumbers = useMemo(() => {
        if (totalPages <= 1) return [];
        const start = Math.max(0, Math.min(page - 2, totalPages - 5));
        const end = Math.min(totalPages, start + 5);
        return Array.from({ length: end - start }, (_, i) => start + i);
    }, [page, totalPages]);

    return (
        <>
            <PageHeader
                title="Nos Spectacles"
                subtitle="Découvrez et réservez vos spectacles"
                breadcrumb={[{ label: 'Spectacles', path: '/' }]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <span className="count-badge">
                            {totalElements} spectacle{totalElements !== 1 ? 's' : ''}
                        </span>
                        {(role === 'ROLE_ADMIN' || role === 'ROLE_PRODUCTEUR') && (
                            <Link to="/spectacles/create" className="btn btn-primary text-uppercase btn-admin">
                                <i className="fas fa-plus me-2"></i>Nouveau spectacle
                            </Link>
                        )}
                    </div>

                    <div className="row g-2 mb-4">
                        <div className="col-md-12">
                            <label className="form-label info-label mb-1">
                                <i className="fas fa-search me-1 text-warning"></i>Rechercher
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Titre ou description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label info-label mb-1">
                                <i className="fas fa-sort me-1 text-warning"></i>Trier par
                            </label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Date</option>
                                <option value="price">Prix</option>
                                <option value="name">Nom</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label info-label mb-1">
                                <i className="fas fa-arrows-alt-v me-1 text-warning"></i>Ordre
                            </label>
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="asc">Ascendant</option>
                                <option value="desc">Descendant</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label info-label mb-1">
                                <i className="fas fa-map-marker-alt me-1 text-warning"></i>Lieu
                            </label>
                            <select
                                className="form-select"
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                            >
                                <option value="">Tous les lieux</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-danger py-5">{error}</div>
                    ) : spectacles.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-theater-masks fa-3x text-muted mb-3"></i>
                            <p className="info-label">
                                Aucun spectacle ne correspond à votre recherche.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="row g-4">
                                {spectacles.map(spectacle => (
                                    <div className="col-lg-4 col-md-6" key={spectacle.id}>
                                        <div className="artist-card">
                                            <div className="card-accent"></div>
                                            <div className="p-4">
                                                <h5 className="artist-card-title">
                                                    {spectacle.title}
                                                </h5>
                                                <p className="info-value">
                                                    <i className="fas fa-calendar me-1 text-warning"></i>
                                                    {new Date(spectacle.date).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                                {spectacle.location && (
                                                    <p className="info-value">
                                                        <i className="fas fa-map-marker-alt me-1 text-warning"></i>
                                                        {spectacle.location}
                                                    </p>
                                                )}
                                                <span className="count-badge">
                                                    {spectacle.price} €
                                                </span>
                                                {spectacle.artist && (
                                                    <p className="info-value">
                                                        <i className="fas fa-user me-1 text-warning"></i>
                                                        {spectacle.artist.name}
                                                    </p>
                                                )}
                                                {spectacle.description && (
                                                    <p className="text-description mt-2">
                                                        {spectacle.description.substring(0, 80)}
                                                        {spectacle.description.length > 80 ? '...' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="d-flex gap-2 px-4 pb-4 card-footer-actions">
                                                <Link to={`/spectacles/${spectacle.id}`}
                                                    className="btn btn-sm btn-dark text-warning btn-admin">
                                                    <i className="fas fa-eye me-1"></i>Voir
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <nav aria-label="Pagination" className="mt-5">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => goToPage(page - 1)}
                                                disabled={page === 0}
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        </li>

                                        {pageNumbers[0] > 0 && (
                                            <>
                                                <li className="page-item">
                                                    <button className="page-link" onClick={() => goToPage(0)}>1</button>
                                                </li>
                                                {pageNumbers[0] > 1 && (
                                                    <li className="page-item disabled">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                )}
                                            </>
                                        )}

                                        {pageNumbers.map(p => (
                                            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(p)}>
                                                    {p + 1}
                                                </button>
                                            </li>
                                        ))}

                                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                            <>
                                                {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                                                    <li className="page-item disabled">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                )}
                                                <li className="page-item">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => goToPage(totalPages - 1)}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </li>
                                            </>
                                        )}

                                        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => goToPage(page + 1)}
                                                disabled={page >= totalPages - 1}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                    <p className="text-center info-label mt-2">
                                        Page {page + 1} sur {totalPages}
                                    </p>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default SpectacleList;
