//@ts-check
import { createRoot } from 'react-dom/client';
import './index.tailwind.css';

import { AuthProvider } from './components/AuthContext';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Map } from './components/pages/Map';

// components
import React from 'react';
import App from './App';

// イベント
document.addEventListener('DOMContentLoaded', () => {
  var element = document.getElementById('app');
  if (!element) {
    return;
  }

  if (window.location.pathname === '/gallerymap') {
    createRoot(element).render(<Map />);
    return;
  }

  createRoot(element).render(
    <AuthProvider>
      <APIProvider apiKey={process.env.MAPS_JS_API ?? ''}>
        <App />
      </APIProvider>
    </AuthProvider>,
  );
});
