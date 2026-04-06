import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/artists')
            .then(res => res.json())
            .then(data => { setArtists(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const deleteArtist = (id, name) => {
        if (window.confirm(`Supprimer "${name}" ?`)) {
            fetch(`http://localhost:8080/api/artists/${id}`, { method: 'DELETE' })
                .then(() => setArtists(artists.filter(a => a.id !== id)));
        }
    };

    if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="container mt-5 pt-5 text-center text-danger">{error}</div>;

    return (
        <>
            <PageHeader
                title="Liste des artistes"
                subtitle="Gérez vos artistes"
                breadcrumb={[{ label: 'Artistes', path: '/' }]}
            />

            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="count-badge">
                            {artists.length} artiste{artists.length !== 1 ? 's' : ''}
                        </span>
                        <Link to="/artists/create" className="btn btn-primary text-uppercase"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}>
                            <i className="fas fa-plus me-2"></i>Nouvel artiste
                        </Link>
                    </div>

                    <div className="row g-4">
                        {artists.map(artist => (
                            <div className="col-lg-4 col-md-6" key={artist.id}>
                                <div className="artist-card">
                                    <div style={{ height: '5px', background: '#fec810' }}></div>
                                    <div className="p-4">
                                        <h5 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>
                                            {artist.name}
                                        </h5>
                                        <span className="badge-genre">{artist.genre || 'Genre inconnu'}</span>
                                        <p style={{ fontFamily: 'Roboto Slab, serif', color: '#6c757d', fontSize: '0.85rem' }}>
                                            <i className="fas fa-map-marker-alt me-1 text-warning"></i>
                                            {artist.country || 'Pays inconnu'}
                                        </p>
                                        {artist.description && (
                                            <p style={{ fontFamily: 'Roboto Slab, serif', color: '#495057', fontSize: '0.85rem' }}>
                                                {artist.description.substring(0, 80)}{artist.description.length > 80 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2 px-4 pb-4" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                                        <Link to={`/artists/${artist.id}`} className="btn btn-sm btn-dark text-warning"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                            <i className="fas fa-eye me-1"></i>Voir
                                        </Link>
                                        <Link to={`/artists/${artist.id}/edit`} className="btn btn-sm btn-warning"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                            <i className="fas fa-pen me-1"></i>Modifier
                                        </Link>
                                        <button onClick={() => deleteArtist(artist.id, artist.name)}
                                            className="btn btn-sm btn-outline-danger ms-auto"
                                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                                            <i className="fas fa-trash me-1"></i>Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ArtistList;