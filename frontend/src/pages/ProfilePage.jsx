// frontend/src/pages/ProfilePage.jsx
import { Box, Heading, Text, VStack, Stat, StatLabel, StatNumber, StatHelpText, StatGroup, Divider, Button, useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { FaMoneyBillAlt } from 'react-icons/fa';

const ProfilePage = () => {
  // Redux'tan kullanıcı bilgilerini çekme
  const user = useSelector(state => state.auth.user);
  const toast = useToast();

  const handleDeposit = () => {
    // API bağlantısı olmadığı için simülasyon yapalım.
    toast({
      title: "Bakiye Yükleme Başlatıldı",
      description: "Bakiye yükleme API'si şu an aktif değil. Backend bağlantısından sonra eklenecek.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Box p={5}>
      <Heading size="xl" mb={6} color="brand.900">
        Profilim ve Hesap Yönetimi
      </Heading>
      
      <VStack align="stretch" spacing={6}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Kullanıcı Bilgileri</Heading>
          <Text><strong>Ad Soyad:</strong> {user?.name || 'Yükleniyor...'}</Text>
          <Text><strong>E-posta:</strong> {user?.email || 'Yükleniyor...'}</Text>
          <Text><strong>Rol:</strong> <Text as="span" color={user?.role === 'admin' ? 'red.500' : 'green.500'} fontWeight="bold">{user?.role || 'user'}</Text></Text>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Bakiye Durumu</Heading>
          <StatGroup>
            <Stat>
              <StatLabel>Güncel Bakiye</StatLabel>
              <StatNumber color="green.500" fontSize="3xl">{user?.balance?.toFixed(2) || '500.00'} TL</StatNumber>
              <StatHelpText>Başlangıç bakiyeniz {user ? user.balance : 500} TL idi.</StatHelpText>
            </Stat>
          </StatGroup>
          <Divider my={4} />
          <Button leftIcon={<FaMoneyBillAlt />} colorScheme="green" onClick={handleDeposit}>
            Bakiye Yükle
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfilePage;