import { useTranslation } from 'react-i18next';
import PresetSizes from '../PresetSizes.jsx';

export default function CanvasSize({ config, setConfig, PRESET_SIZES, onApplyPreset }) {
  const { t } = useTranslation();
  return (
    <div className="config-group">
      <label>{t('canvasSize')}</label>
      <PresetSizes PRESET_SIZES={PRESET_SIZES} onApplyPreset={onApplyPreset} />
      <div className="size-inputs">
        <input
          type="number"
          value={config.canvas_width}
          onChange={(e) => setConfig({ ...config, canvas_width: parseInt(e.target.value) })}
          placeholder={t('widthPlaceholder')}
        />
        <span>×</span>
        <input
          type="number"
          value={config.canvas_height}
          onChange={(e) => setConfig({ ...config, canvas_height: parseInt(e.target.value) })}
          placeholder={t('heightPlaceholder')}
        />
      </div>
    </div>
  );
}
