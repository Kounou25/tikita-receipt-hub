import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import fr from "./locales/fr/common.json";

const resources = {
  en: { common: en },
  fr: { common: fr },
};

const defaultLng = (localStorage.getItem("lang") as string) || (navigator.language && navigator.language.startsWith("fr") ? "fr" : "en");

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLng,
  fallbackLng: "fr",
  ns: ["common"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
