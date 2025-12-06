import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/global.css';
import './services/commonService.js';
import App from './App.jsx';
import { useAuthStore } from "@/store/authStore";

useAuthStore.getState().fetchSession();

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
