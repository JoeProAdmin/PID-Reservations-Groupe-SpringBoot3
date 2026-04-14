import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [prenom, setPrenom] = useState(localStorage.getItem("prenom"));
    const [nom, setNom] = useState(localStorage.getItem("nom"));
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    const login = (token, role, prenom, nom, id) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("prenom", prenom || "");
        localStorage.setItem("nom", nom || "");
        localStorage.setItem("userId", id || "");
        setToken(token);
        setRole(role);
        setPrenom(prenom);
        setNom(nom);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("prenom");
        localStorage.removeItem("nom");
        localStorage.removeItem("userId");
        setToken(null);
        setRole(null);
        setPrenom(null);
        setNom(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, prenom, nom, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);