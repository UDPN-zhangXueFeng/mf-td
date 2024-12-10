import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector'; // 浏览器语言检测
import en from './assets/locales/en/login.json';
import zh from './assets/locales/zh/login.json';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['login'],
    defaultNS: 'login',
    resources: {
      en: {
        login: en
      },
      zh: {
        login: zh
      }
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 