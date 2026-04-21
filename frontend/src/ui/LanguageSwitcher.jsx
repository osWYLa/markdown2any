import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === 'zh' ? 'active' : ''}`}
        onClick={() => i18n.changeLanguage('zh')}
      >
        中文
      </button>
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        English
      </button>
    </div>
  );
}
