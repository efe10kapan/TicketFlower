// frontend/src/pages/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, Spinner, Text } from '@chakra-ui/react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa, hemen Login sayfasına yönlendir
    // Zaten giriş yapmışsa, PrivateRoute onu /app'e yönlendirir.
    // Şimdilik /login'e yönlendiriyoruz.
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      navigate('/app');
    }
  }, [navigate]);

  return (
    <Center h="100vh" flexDirection="column">
      <Spinner size="xl" color="brand.500" />
      <Text mt={4} fontSize="lg">Yönlendiriliyor...</Text>
    </Center>
  );
};

export default LandingPage;