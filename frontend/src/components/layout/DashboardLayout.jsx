import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const DashboardLayout = () => {
  // Sidebar'ın açık/kapalı durumunu burada yönetiyoruz
  // Varsayılan: true (Açık başlasın istedin)
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex h="100vh" w="100vw" overflow="hidden" bg="gray.100">
      
      {/* SOL: Sidebar Kutusu */}
      {/* Genişliği state'e göre değişiyor (Yumuşak geçişli) */}
      <Box 
        w={isSidebarOpen ? "250px" : "80px"} 
        transition="width 0.3s ease" // 🔥 Animasyon
        flexShrink={0}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </Box>

      {/* SAĞ: İçerik */}
      <Box flex="1" h="100%" overflowY="auto" position="relative">
        <Outlet />
      </Box>

    </Flex>
  );
};

export default DashboardLayout;