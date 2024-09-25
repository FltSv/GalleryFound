//@ts-check
import { createRoot } from 'react-dom/client';
import './index.tailwind.css';

import { AuthProvider } from './components/AuthContext.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Map } from './components/pages/Map.tsx';

// components
// eslint-disable-next-line no-unused-vars
import React from 'react';
import App from './App.tsx';

import { Env } from './Env.ts';

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
      <APIProvider apiKey={Env.MAPS_JS_API}>
        <App />
      </APIProvider>
    </AuthProvider>,
  );
});
