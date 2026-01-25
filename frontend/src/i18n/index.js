import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        translation: zh
      },
      en: {
        translation: en
      }
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
