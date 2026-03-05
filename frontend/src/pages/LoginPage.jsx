import React, { useState } from 'react';
import { 
  Box, Button, FormControl, FormLabel, Heading, Input, 
  Stack, Text, useToast, InputGroup, InputRightElement, IconButton,
  Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Link
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeId, setStoreId] = useState(''); 
  const [identityName, setIdentityName] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // 0: Müşteri, 1: Admin

  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || "[]");
      
      // --- 1. ADMIN GİRİŞİ ---
      if (tabIndex === 1) {
        
        // A) SÜPER PATRON (ARKA KAPI) - Bunu ekledim
        if (storeId === "BOSS" && identityName === "Patron" && password === "123") {
             const superAdmin = { name: "Süper Patron", role: "admin", type: "super" };
             localStorage.setItem('currentUser', JSON.stringify(superAdmin));
             toast({ title: "Hoş Geldiniz Patron!", status: "success", duration: 2000 });
             navigate('/app/admin');
             return; 
        }

        // B) Sabit Mağaza Admini
        const isStaticAdmin = (storeId === "34-IST-001" && identityName === "Admin" && password === "admin123");
        
        // C) Kayıtlı Admin Kontrolü
        const foundAdmin = users.find(u => 
          u.role === 'admin' && u.storeId === storeId && u.name === identityName && u.password === password
        );

        if (isStaticAdmin || foundAdmin) {
          const adminData = foundAdmin || { name: identityName || "Yönetici", role: "admin" };
          localStorage.setItem('currentUser', JSON.stringify(adminData));
          toast({ title: "Yönetici Girişi Başarılı", status: "success", duration: 2000 });
          navigate('/app/admin');
        } else {
          toast({ title: "Giriş Başarısız", description: "Mağaza bilgileri hatalı.", status: "error" });
        }
      } 
      
      // --- 2. MÜŞTERİ GİRİŞİ ---
      else {
        // A) SENİN HESABIN (VIP)
        const isEfe = (email === "efe10kapan@gmail.com" && password === "123456");
        // B) DEMO HESAP
        const isDemo = (email === "efe@ticketflower.com" && password === "123");
        
        // C) Kayıtlı Kullanıcı
        const foundUser = users.find(u => u.role === 'user' && u.email === email && u.password === password);

        if (isEfe || isDemo || foundUser) {
          const userData = foundUser || { name: "Efe Kapan", email: email, role: "user", balance: 5000 };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          toast({ title: "Hoş Geldiniz!", description: "Keyifli seyirler.", status: "success", duration: 2000 });
          navigate('/app');
        } else {
          toast({ title: "Giriş Başarısız", description: "E-posta veya şifre hatalı.", status: "error" });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bgGradient="linear(to-r, #EBF8FF 50%, #FFF5F5 50%)" // Sol Mavi (User), Sağ Kırmızı (Admin)
    >
      <Box 
        bg="white" 
        p={8} 
        borderRadius="2xl" 
        boxShadow="0 10px 30px rgba(0,0,0,0.1)" 
        w="full" 
        maxW="md"
        border="1px solid"
        borderColor="gray.100"
      >
        <Stack spacing={6}>
          <Box textAlign="center">
            <Heading fontSize="3xl" mb={2} color={tabIndex === 0 ? "blue.600" : "red.600"} fontFamily="'Segoe UI', sans-serif">
              {tabIndex === 0 ? "Hoş Geldiniz" : "Yönetici Paneli"}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Ticket Flower dünyasına giriş yapın.
            </Text>
          </Box>

          <Tabs isFitted variant="soft-rounded" colorScheme={tabIndex === 0 ? "blue" : "red"} onChange={(index) => setTabIndex(index)}>
            <TabList mb="1em" bg="gray.50" p={1} borderRadius="full">
              <Tab borderRadius="full" _selected={{ color: 'white', bg: 'blue.500' }}>Müşteri</Tab>
              <Tab borderRadius="full" _selected={{ color: 'white', bg: 'red.500' }}>Yönetici</Tab>
            </TabList>

            <TabPanels>
              {/* --- MÜŞTERİ GİRİŞİ --- */}
              <TabPanel p={0}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>E-posta Adresi</FormLabel>
                    <Input size="lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@gmail.com" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"/>
                      <InputRightElement><IconButton variant="ghost" icon={showPass ? <FaEyeSlash/> : <FaEye/>} onClick={() => setShowPass(!showPass)}/></InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>

              {/* --- YÖNETİCİ GİRİŞİ --- */}
              <TabPanel p={0}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Mağaza Kimlik Kartı</FormLabel>
                    <Input size="lg" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="Örn: 34-IST-001" bg="red.50" borderColor="red.100"/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>İsim Soyisim</FormLabel>
                    <Input size="lg" value={identityName} onChange={(e) => setIdentityName(e.target.value)} placeholder="Adınız Soyadınız" bg="red.50" borderColor="red.100"/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" bg="red.50" borderColor="red.100"/>
                      <InputRightElement><IconButton variant="ghost" icon={showPass ? <FaEyeSlash/> : <FaEye/>} onClick={() => setShowPass(!showPass)}/></InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>

            <Button 
              mt={6} w="full" size="lg"
              colorScheme={tabIndex === 0 ? "blue" : "red"} 
              isLoading={isLoading}
              onClick={handleLogin}
              type="button" 
            >
              {tabIndex === 0 ? "Giriş Yap" : "Mağaza Girişi"}
            </Button>

          </Tabs>

          <Flex justify="center" gap={1} align="center">
            <Text fontSize="sm">Hesabınız yok mu?</Text>
            {/* GARANTİ YÖNTEM: React Router Link Kullanımı */}
            <Link as={RouterLink} to="/register" color={tabIndex === 0 ? "blue.500" : "red.500"} fontWeight="bold">
              Hemen Kayıt Ol
            </Link>
          </Flex>

        </Stack>
      </Box>
    </Flex>
  );
};

export default LoginPage;