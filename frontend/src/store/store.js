// frontend/src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice'; // <<< YENİ İMPORT

// frontend/src/store/store.js

// ... diğer kodlar (configureStore vs.)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
  },
});

export default store; // 🔥 BU SATIRI EKLE