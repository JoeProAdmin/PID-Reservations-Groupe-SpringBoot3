// ================================================
// Dictionnaire de traductions (FR / EN / NL)
// ================================================
// Pour ajouter une cle :
//   1. Ajoute-la dans les 3 langues ci-dessous
//   2. Utilise dans un composant : const { t } = useLanguage(); t("ma.cle")

const translations = {
  fr: {
    // ===== Navigation =====
    "nav.spectacles": "Spectacles",
    "nav.artists": "Artistes",
    "nav.reservations": "Mes Réservations",
    "nav.adminDashboard": "Dashboard",
    "nav.producerDashboard": "Espace Producteur",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.logout": "Déconnexion",

    // ===== Footer =====
    "footer.copyright": "Copyright",
    "footer.legal": "Mentions légales",
    "footer.rss": "RSS",

    // ===== Auth =====
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.signin": "Se connecter",
    "auth.signup": "S'inscrire",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.noAccount": "Pas encore de compte ?",
    "auth.hasAccount": "Déjà un compte ?",

    // ===== Profil =====
    "profile.firstName": "Prénom",
    "profile.lastName": "Nom",
    "profile.role": "Rôle",
    "profile.language": "Langue",
    "profile.edit": "Modifier mon profil",
    "profile.delete": "Supprimer mon compte",

    // ===== Roles =====
    "role.admin": "Administrateur",
    "role.producer": "Producteur",
    "role.user": "Utilisateur",

    // ===== Communs =====
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.delete": "Supprimer",
    "common.back": "Retour",
    "common.share": "Partager",
  },

  en: {
    "nav.spectacles": "Shows",
    "nav.artists": "Artists",
    "nav.reservations": "My Bookings",
    "nav.adminDashboard": "Dashboard",
    "nav.producerDashboard": "Producer Space",
    "nav.login": "Sign in",
    "nav.register": "Sign up",
    "nav.logout": "Logout",

    "footer.copyright": "Copyright",
    "footer.legal": "Legal notice",
    "footer.rss": "RSS",

    "auth.email": "Email",
    "auth.password": "Password",
    "auth.signin": "Sign in",
    "auth.signup": "Sign up",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "No account yet?",
    "auth.hasAccount": "Already have an account?",

    "profile.firstName": "First name",
    "profile.lastName": "Last name",
    "profile.role": "Role",
    "profile.language": "Language",
    "profile.edit": "Edit my profile",
    "profile.delete": "Delete my account",

    "role.admin": "Administrator",
    "role.producer": "Producer",
    "role.user": "User",

    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.back": "Back",
    "common.share": "Share",
  },

  nl: {
    "nav.spectacles": "Voorstellingen",
    "nav.artists": "Artiesten",
    "nav.reservations": "Mijn Reserveringen",
    "nav.adminDashboard": "Dashboard",
    "nav.producerDashboard": "Producer Ruimte",
    "nav.login": "Inloggen",
    "nav.register": "Registreren",
    "nav.logout": "Uitloggen",

    "footer.copyright": "Copyright",
    "footer.legal": "Juridische kennisgeving",
    "footer.rss": "RSS",

    "auth.email": "E-mail",
    "auth.password": "Wachtwoord",
    "auth.signin": "Aanmelden",
    "auth.signup": "Registreren",
    "auth.forgotPassword": "Wachtwoord vergeten?",
    "auth.noAccount": "Nog geen account?",
    "auth.hasAccount": "Al een account?",

    "profile.firstName": "Voornaam",
    "profile.lastName": "Achternaam",
    "profile.role": "Rol",
    "profile.language": "Taal",
    "profile.edit": "Mijn profiel wijzigen",
    "profile.delete": "Mijn account verwijderen",

    "role.admin": "Beheerder",
    "role.producer": "Producent",
    "role.user": "Gebruiker",

    "common.cancel": "Annuleren",
    "common.save": "Opslaan",
    "common.delete": "Verwijderen",
    "common.back": "Terug",
    "common.share": "Delen",
  },
};

export const SUPPORTED_LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export default translations;
