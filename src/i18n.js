import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import translationEN from "./locale/en/translation.json";
import translationAR from "./locale/ar/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      ar: {
        translation: translationAR,
      },
    },
    lng: localStorage.getItem("language") || "en",
    fallbacking: "en",
    supportedLngs: ["en", "ar"],
    detection: {
      order: [
        "htmlTag",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
