
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initStorage } from './utils/setupStorage';

// Initialize storage as the app starts
initStorage().catch(error => {
  console.error("Error initializing storage:", error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
