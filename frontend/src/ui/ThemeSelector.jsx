import { useTranslation } from 'react-i18next';

export default function ThemeSelector({ THEMES, selectedTheme, onApplyTheme }) {
  const { t } = useTranslation();
  return (
    <div className="config-group">
      <label>{t('selectTheme')}</label>
      <div className="theme-selector">
        {Object.values(THEMES).map(theme => (
          <button
            key={theme.id}
            className={`theme-btn ${selectedTheme === theme.id ? 'active' : ''}`}
            onClick={() => onApplyTheme(theme.id)}
            style={{
              background: theme.config.is_gradient
                ? `linear-gradient(${theme.config.gradient_angle}deg, ${theme.config.gradient_start}, ${theme.config.gradient_end})`
                : theme.config.background_color,
              color: theme.config.text_color,
              borderColor: theme.config.accent_color,
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
