// Canvas preset sizes for the render layer.
// getPresetSizes(t) still accepts a translation function for this milestone
// (i18n will be decoupled in a future milestone).
// No imports from ui/, hooks/, or i18n/ modules.

export const getPresetSizes = (t) => [
  { name: t('presetSizes.wechat'), width: 1080, height: 1260 },
  { name: t('presetSizes.weibo'), width: 1080, height: 1920 },
  { name: t('presetSizes.instagram_square'), width: 1080, height: 1080 },
  { name: t('presetSizes.instagram_portrait'), width: 1080, height: 1350 },
  { name: t('presetSizes.xiaohongshu'), width: 1080, height: 1440 },
];
