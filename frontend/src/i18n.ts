import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: 'Home',
          dashboard: 'Dashboard',
          login: 'Login',
          mes_system: 'MES System',
          home_page_title: 'Home Page',
          dashboard_page_title: 'Dashboard',
          not_found_page_title: '404 Not Found'
        }
      },
      'zh-TW': {
        translation: {
          home: '首頁',
          dashboard: '儀表板',
          login: '登入',
          mes_system: '製造執行系統',
          home_page_title: '首頁',
          dashboard_page_title: '儀表板',
          not_found_page_title: '404 找不到頁面'
        }
      }
    }
  });

export default i18n; 