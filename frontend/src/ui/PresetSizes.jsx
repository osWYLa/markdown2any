export default function PresetSizes({ PRESET_SIZES, onApplyPreset }) {
  return (
    <div className="preset-sizes">
      {PRESET_SIZES.map((preset, index) => (
        <button key={index} className="preset-btn" onClick={() => onApplyPreset(preset)}>
          {preset.name}
        </button>
      ))}
    </div>
  );
}
