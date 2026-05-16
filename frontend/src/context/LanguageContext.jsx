import { createContext, useContext, useState, useCallback, useMemo } from "react";
import translations from "../i18n/translations";

const STORAGE_KEY = "appLanguage";
const DEFAULT_LANG = "fr";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return stored && translations[stored] ? stored : DEFAULT_LANG;
  });

  const setLang = useCallback((newLang) => {
    if (!translations[newLang]) return;
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
  }, []);

  // Fonction de traduction : t("nav.spectacles") -> "Spectacles" (selon la lang courante)
  // Si la cle n'existe pas dans la lang choisie, fallback sur fr, sinon retourne la cle
  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations[DEFAULT_LANG];
      if (dict[key]) return dict[key];
      const fallback = translations[DEFAULT_LANG];
      return fallback[key] || key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage doit être utilisé dans un LanguageProvider");
  }
  return ctx;
};
