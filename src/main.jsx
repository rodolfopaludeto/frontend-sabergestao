import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Certifique-se de que o App.jsx está sendo exportado corretamente
import './index.css'; // Inclua estilos globais aqui, se necessário

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

