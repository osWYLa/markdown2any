/**
 * MetaInfo component — renders author / timestamp for a given position.
 * Props: { config, position } where position is 'top' | 'bottom'
 * No imports from ui/, hooks/, or i18n/.
 */
export default function MetaInfo({ config, position }) {
  if (!config.author && !config.timestamp) return null;
  if (config.meta_position !== position) return null;

  const style =
    position === 'top'
      ? { fontSize: `${config.font_size * 0.875}px`, marginBottom: `${config.padding}px` }
      : { fontSize: `${config.font_size * 0.875}px`, marginTop: `${config.padding}px` };

  return (
    <div className="meta-info" style={style}>
      {config.author && <span>{config.author}</span>}
      {config.author && config.timestamp && <span> · </span>}
      {config.timestamp && <span>{config.timestamp}</span>}
    </div>
  );
}
