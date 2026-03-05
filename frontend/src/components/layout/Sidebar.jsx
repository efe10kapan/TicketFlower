import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, VStack, Text, Button, Divider, IconButton, Flex, Avatar, Tooltip,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, 
  useDisclosure, Icon
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';

// İKONLAR
import { 
  FaHome, FaUser, FaChevronLeft, FaChevronRight, FaTheaterMasks, FaFilm, 
  FaSignOutAlt, FaGem, FaChartPie, FaCogs
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const dispatch = useDispatch();
  
  // Çıkış Modalı
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || "{}");
  const isAdmin = currentUser?.role === 'admin';

  const [balance, setBalance] = useState(0);

  // URL Query Kontrolü (Sekmeler için)
  const currentTab = new URLSearchParams(location.search).get('tab');

  // Tema Rengi
  const getThemeColor = () => {
    const path = location.pathname;
    if (path.includes('/content/theater') || path.includes('/admin/theaters')) return 'red.900';
    if (path.includes('/content/movie') || path.includes('/admin/movies')) return 'blue.900';
    if (path.includes('/profile')) return 'purple.900';
    if (path.includes('/admin')) return 'black'; // Admin Dashboard
    return 'gray.900';
  };
  const themeColor = getThemeColor();

  useEffect(() => {
    const updateBalance = () => {
      const saved = localStorage.getItem('userBalance');
      if (saved) setBalance(parseFloat(saved));
    };
    updateBalance();
    const interval = setInterval(updateBalance, 2000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogoutConfirm = () => {
    onAlertClose();
    dispatch(logout());
    dispatch(reset());
    localStorage.removeItem('currentUser'); 
    navigate('/login');
  };

  // --- MENÜ LİNKLERİ ---
  
  // 1. Kullanıcı Menüsü
  const userLinks = [
    { name: 'Ana Sayfa', icon: FaHome, path: '/app', type: 'path' },
    { name: 'Filmler', icon: FaFilm, path: '/app/content/movie', type: 'path' },
    { name: 'Tiyatrolar', icon: FaTheaterMasks, path: '/app/content/theater', type: 'path' },
    { name: 'Profilim', icon: FaUser, path: '/app/profile', type: 'path' },
  ];

  // 2. Admin Menüsü (GÜNCELLENDİ: Yeni rotalara yönlendiriyor)
  const adminLinks = [
    { name: 'Ana Sayfa', icon: FaHome, path: '/app/admin', tab: null }, 
    { name: 'Finans & Raporlar', icon: FaChartPie, path: '/app/admin?tab=finance', tab: 'finance' }, 
    { name: 'Operasyon Merkezi', icon: FaCogs, path: '/app/admin?tab=ops', tab: 'ops' },
    { name: 'Film Yönetimi', icon: FaFilm, path: '/app/admin/movies', type: 'path' }, // YENİ ROTA
    { name: 'Tiyatro Yönetimi', icon: FaTheaterMasks, path: '/app/admin/theaters', type: 'path' }, // YENİ ROTA
  ];

  const linksToShow = isAdmin ? adminLinks : userLinks;

  // Aktiflik Kontrol Fonksiyonu
  const isActive = (link) => {
    if (isAdmin) {
        // Admin için Tab ve Path kontrolü
        if (link.type === 'path') return location.pathname === link.path;
        return location.pathname === '/app/admin' && currentTab === link.tab;
    } else {
        // User için Path kontrolü
        return location.pathname === link.path;
    }
  };

  return (
    <>
      <Box
        h="100%" w="100%"
        bg={themeColor} 
        color="white" p={isOpen ? 5 : 2}
        borderRight="1px solid rgba(255,255,255,0.1)"
        display="flex" flexDirection="column"
        transition="all 0.4s ease"
        boxShadow="4px 0 15px rgba(0,0,0,0.3)"
      >
        <Flex justify={isOpen ? "space-between" : "center"} align="center" mb={10}>
          {isOpen && (
            <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" letterSpacing="widest">TICKET FLOWER</Text>
                {isAdmin && <Text fontSize="xs" color="yellow.400" letterSpacing="widest">YÖNETİM PANELİ</Text>}
            </VStack>
          )}
          <IconButton icon={isOpen ? <FaChevronLeft /> : <FaChevronRight />} onClick={toggleSidebar} size="sm" variant="ghost" colorScheme="whiteAlpha" />
        </Flex>

        <VStack spacing={2} align="stretch" flex="1">
            {linksToShow.map((link) => {
                const active = isActive(link);
                return (
                    <Tooltip key={link.name} label={link.name} placement="right" isDisabled={isOpen}>
                        <Button 
                            justifyContent={isOpen ? "flex-start" : "center"} 
                            variant="ghost"
                            bg={active ? 'whiteAlpha.300' : 'transparent'} 
                            color={active ? 'white' : 'gray.400'}
                            borderLeft={active ? "4px solid" : "4px solid transparent"}
                            borderColor={isAdmin ? "yellow.400" : "white"}
                            _hover={{ bg: 'whiteAlpha.200', transform: 'translateX(5px)', color: 'white' }}
                            colorScheme="whiteAlpha" 
                            leftIcon={<Icon as={link.icon} boxSize={5} color={active ? (isAdmin ? "yellow.400" : "white") : "gray.500"} />} 
                            onClick={() => navigate(link.path)} 
                            px={isOpen ? 4 : 0}
                            transition="all 0.2s"
                        >
                            {isOpen && link.name}
                        </Button>
                    </Tooltip>
                )
            })}
        </VStack>

        <Box mt="auto" mb={4}>
          <Divider mb={4} opacity={0.3} />
          
          {isOpen ? (
              <Flex align="center" gap={3} mb={4} p={2} bg="whiteAlpha.100" borderRadius="lg" border="1px solid" borderColor="whiteAlpha.200">
                  <Avatar 
                    size="sm" 
                    name={currentUser?.name} 
                    bg={isAdmin ? "yellow.500" : "white"} 
                    color={isAdmin ? "black" : themeColor} 
                    src={isAdmin ? "https://cdn-icons-png.flaticon.com/512/1042/1042390.png" : null}
                  />
                  <Box>
                      <Text fontSize="sm" fontWeight="bold" noOfLines={1}>{currentUser?.name || "Misafir"}</Text>
                      {isAdmin ? (
                          <Flex align="center" fontSize="xs" color="yellow.400" fontWeight="bold">
                              <Icon as={FaGem} mr={1} /> BOSS
                          </Flex>
                      ) : (
                          <Text fontSize="xs" color="green.300">Bakiye: {balance} ₺</Text>
                      )}
                  </Box>
              </Flex>
          ) : (
               <Flex justify="center" mb={4}>
                  <Tooltip label={isAdmin ? "Patron" : `Bakiye: ${balance} ₺`} placement="right">
                      <Avatar size="xs" name={currentUser?.name} bg={isAdmin ? "yellow.500" : "white"} color={themeColor} cursor="pointer" />
                  </Tooltip>
               </Flex>
          )}

          <Button 
            colorScheme="red" width="100%" variant="solid" size="sm" 
            onClick={onAlertOpen} boxShadow="lg" leftIcon={<FaSignOutAlt />}
          >
            {isOpen ? "ÇIKIŞ YAP" : ""}
          </Button>
        </Box>
      </Box>

      <AlertDialog
        isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose} isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(5px)">
          <AlertDialogContent bg="#000" color="white" border="1px solid #444">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.500">Çıkış İşlemi</AlertDialogHeader>
            <AlertDialogBody>Sistemden çıkış yapmak istediğinize emin misiniz?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose} variant="ghost" colorScheme="gray">Vazgeç</Button>
              <Button colorScheme="red" onClick={handleLogoutConfirm} ml={3}>Çıkış Yap</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Sidebar;