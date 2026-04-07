import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import ArtistList from "./pages/artists/ArtistList";
import ArtistDetail from "./pages/artists/ArtistDetail";
import ArtistCreate from "./pages/artists/ArtistCreate";
import ArtistEdit from "./pages/artists/ArtistEdit";
import Header from "./components/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ArtistList />} />
          <Route path="/artists/create" element={<ArtistCreate />} />
          <Route path="/artists/:id" element={<ArtistDetail />} />
          <Route path="/artists/:id/edit" element={<ArtistEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
