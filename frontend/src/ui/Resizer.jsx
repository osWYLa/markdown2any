export default function Resizer({ onMouseDown, active }) {
  return (
    <div
      className={`resizer ${active ? 'active' : ''}`}
      onMouseDown={onMouseDown}
    />
  );
}
