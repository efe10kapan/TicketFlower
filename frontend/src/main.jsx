import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// 🔥 BURASI ÇOK ÖNEMLİ: Router'ı import ediyoruz
import { BrowserRouter } from 'react-router-dom';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#150d3a',
      800: '#3b22a5',
      700: '#5b3bd5',
      500: '#7c3aed',
      400: '#8b5cf6',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(180deg, #080b14 0%, #05060a 100%)',
        color: 'whiteAlpha.900',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Redux Store Bağlantısı */}
    <Provider store={store}>
      {/* 2. React Router Bağlantısı (Hata buradaydı, eklendi) */}
      <BrowserRouter>
        {/* 3. Chakra UI Tema Bağlantısı */}
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);