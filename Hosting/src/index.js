//@ts-check
import { createRoot } from 'react-dom/client';
import './index.tailwind.css';

import { Map } from './pages/Map.tsx';

// components
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { App } from './App.tsx';

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

  createRoot(element).render(<App />);
});
