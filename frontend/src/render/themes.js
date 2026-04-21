// Theme definitions for the render layer.
// getThemes(t) still accepts a translation function for this milestone
// (i18n will be decoupled in a future milestone).
// No imports from ui/, hooks/, or i18n/ modules.

export const getThemes = (t) => ({
  light: {
    id: 'light',
    name: t('themes.light'),
    config: {
      background_color: '#FFFFFF',
      text_color: '#333333',
      accent_color: '#007AFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  dark: {
    id: 'dark',
    name: t('themes.dark'),
    config: {
      background_color: '#1a1a1a',
      text_color: '#E5E5E5',
      accent_color: '#4A9EFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  warm: {
    id: 'warm',
    name: t('themes.warm'),
    config: {
      background_color: '#FFF8F0',
      text_color: '#5D4E37',
      accent_color: '#D2691E',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  forest: {
    id: 'forest',
    name: t('themes.forest'),
    config: {
      background_color: '#F0F9F0',
      text_color: '#2D3A2D',
      accent_color: '#4CAF50',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  ocean: {
    id: 'ocean',
    name: t('themes.ocean'),
    config: {
      background_color: '#001F3F',
      text_color: '#F0F8FF',
      accent_color: '#7FDBFF',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  vintage: {
    id: 'vintage',
    name: t('themes.vintage'),
    config: {
      background_color: '#F4ECD8',
      text_color: '#4A3728',
      accent_color: '#8B4513',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  midnight: {
    id: 'midnight',
    name: t('themes.midnight'),
    config: {
      background_color: '#121212',
      text_color: '#B0B0B0',
      accent_color: '#BB86FC',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  },
  sakura: {
    id: 'sakura',
    name: t('themes.sakura'),
    config: {
      background_color: '#FFF0F5',
      text_color: '#4A4A4A',
      accent_color: '#FF69B4',
      font_family: 'PingFang SC, -apple-system, sans-serif',
    }
  }
});
