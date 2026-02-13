import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/* Import translations directly */
import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import or from "./locales/or/translation.json";

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v3",
        lng: "en", // default language
        fallbackLng: "en",

        supportedLngs: ["en", "hi", "or"],

        resources: {
            en: { translation: en },
            hi: { translation: hi },
            or: { translation: or },
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    });

export default i18n;
