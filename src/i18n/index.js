import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';

export const resources = {
  en: { translation: en },
  es: { translation: es },
};

if (!i18n.isInitialized) {
  const detected =
    typeof navigator !== 'undefined' && navigator.language
      ? navigator.language.split('-')[0]
      : 'en';

  i18n.use(initReactI18next).init({
    lng: detected in resources ? detected : 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // React already escapes rendered values
    },
  });
}

export default i18n;
