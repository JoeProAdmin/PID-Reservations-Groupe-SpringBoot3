import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ArtistList from "./pages/artists/ArtistList";
import ArtistDetail from "./pages/artists/ArtistDetail";
import ArtistCreate from "./pages/artists/ArtistCreate";
import ArtistEdit from "./pages/artists/ArtistEdit";
import Header from "./components/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import SpectacleList from "./pages/spectacles/SpectacleList.jsx";
import SpectacleDetail from "./pages/spectacles/SpectacleDetail.jsx";
import SpectacleCreate from "./pages/spectacles/SpectacleCreate.jsx";
import SpectacleEdit from "./pages/spectacles/SpectacleEdit.jsx";
import Profile from './pages/profile/Profile';
import ProfileEdit from './pages/profile/ProfileEdit';
import RepresentationCreate from './pages/representations/RepresentationCreate';
import Dashboard from './pages/admin/Dashboard';
import PaymentPage from './pages/paiement/PaymentPage';
import MesReservations from './pages/reservations/MesReservations';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<SpectacleList />} />
          <Route path="/spectacles/:id" element={<SpectacleDetail />} />
          <Route path="/spectacles/create" element={<SpectacleCreate />} />
          <Route path="/spectacles/:id/edit" element={<SpectacleEdit />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/artists/create" element={<ArtistCreate />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/artists/:id/edit" element={<ArtistEdit />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/spectacles/:spectacleId/representations/create" element={<RepresentationCreate />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/paiement/:reservationId" element={<PaymentPage />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
