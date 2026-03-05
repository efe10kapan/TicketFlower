import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

// Sayfalar
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ContentAddPage from './pages/admin/ContentAddPage.jsx';
import ContentListPage from './pages/user/ContentListPage.jsx';

// YENİ EKLENEN ADMİN YÖNETİM SAYFALARI
import AdminMovieManager from './pages/admin/AdminMovieManager.jsx';
import AdminTheaterManager from './pages/admin/AdminTheaterManager.jsx';

// Detay ve Profil Sayfaları
import UserProfile from './pages/user/UserProfile.jsx';
import ContentDetailPage from './pages/user/ContentDetailPage.jsx'; 
import TheaterDetailPage from './pages/user/TheaterDetailPage.jsx'; 

// TİYATRO LİSTE SAYFASI (VİTRİN)
import TheaterPage from './pages/TheaterPage.jsx';

function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        
        {/* Giriş Sayfası */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Kayıt Sayfası */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ana Uygulama (/app) */}
        <Route path="/app" element={<DashboardLayout />}>
            
            {/* --- KULLANICI TARAFI --- */}
            <Route index element={<UserDashboard />} />
            <Route path="content/movie" element={<ContentListPage />} />
            <Route path="content/theater" element={<TheaterPage />} />
            
            {/* Detay Sayfaları */}
            <Route path="content/movie/detail/:id" element={<ContentDetailPage />} />
            <Route path="content/theater/detail/:id" element={<TheaterDetailPage />} />

            {/* Profil */}
            <Route path="profile" element={<UserProfile />} />

            {/* --- ADMİN TARAFI --- */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/add" element={<ContentAddPage />} />
            
            {/* YENİ: Film ve Tiyatro Yönetim Rotaları */}
            <Route path="admin/movies" element={<AdminMovieManager />} />
            <Route path="admin/theaters" element={<AdminTheaterManager />} />

        </Route>

        {/* Hatalı rotaları Login'e yönlendir */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Box>
  );
}

export default App;