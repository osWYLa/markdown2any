import App from './App.jsx';
import RenderRoute from './routes/RenderRoute.jsx';

// Simple pathname-based router — no react-router-dom dependency needed.
// /render is a headless-only endpoint consumed by Playwright; all other paths render the UI.
export default function AppRouter() {
  if (window.location.pathname === '/render') {
    return <RenderRoute />;
  }
  return <App />;
}
