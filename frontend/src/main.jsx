import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
// 🔥 BURASI ÇOK ÖNEMLİ: Router'ı import ediyoruz
import { BrowserRouter } from 'react-router-dom';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
      500: '#4299e1', 
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