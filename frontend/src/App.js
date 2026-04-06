import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import ArtistList from './pages/artists/ArtistList';
import ArtistDetail from './pages/artists/ArtistDetail';
import ArtistCreate from './pages/artists/ArtistCreate';
import ArtistEdit from './pages/artists/ArtistEdit';
import Header from './components/Header';

function App() {
    return (
        <BrowserRouter>
            <Header />  
            <Routes>
                <Route path="/" element={<ArtistList />} />
                <Route path="/artists/create" element={<ArtistCreate />} />
                <Route path="/artists/:id" element={<ArtistDetail />} />
                <Route path="/artists/:id/edit" element={<ArtistEdit />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;

