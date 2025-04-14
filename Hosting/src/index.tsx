import { createRoot } from 'react-dom/client';
import { Map } from './pages/Map';
import { App } from './App';
import './index.tailwind.css';

const root = document.getElementById('root')!;
const app = window.location.pathname === '/gallerymap' ? <Map /> : <App />;
createRoot(root).render(app);
