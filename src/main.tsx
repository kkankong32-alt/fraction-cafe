import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './CafeApp';
import './rebuild.css';
import './concepts.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
