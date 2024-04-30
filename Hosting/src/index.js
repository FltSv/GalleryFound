//@ts-check
import { createRoot } from 'react-dom/client';
import './index.tailwind.css';

import { AuthProvider } from './components/AuthContext';

// components
import React from 'react';
import App from './App';

// イベント
document.addEventListener('DOMContentLoaded', () => {
  var element = document.getElementById('app');
  if (!element) {
    return;
  }

  createRoot(element).render(
    <AuthProvider>
      <App />
    </AuthProvider>,
  );
});
