
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { setupStorage } from './utils/setupStorage';
import { CartProvider } from './contexts/CartContext';

// Initialize storage buckets with better error handling
const initializeApp = async () => {
  try {
    // Try to set up storage but don't block app loading
    await setupStorage().catch(error => {
      console.error("Storage setup error:", error);
      // We'll retry storage setup after user logs in
    });
  } catch (error) {
    console.error("App initialization error:", error);
  }
  
  // Render the app regardless of storage setup status
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  );
};

initializeApp();
