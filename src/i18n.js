import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

const savedLanguage = localStorage.getItem('i18nextLng');

let detectedLanguage = 'en';
if (!savedLanguage) {
    const browserLang = (navigator.language || navigator.languages?.[0] || 'en').split('-')[0];
    if (browserLang === 'fr' || browserLang === 'en') {
        detectedLanguage = browserLang;
    }
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
    },
    lng: savedLanguage || detectedLanguage,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
        escapeValue: false,
    },
    returnObjects: true,
});

i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
    document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
