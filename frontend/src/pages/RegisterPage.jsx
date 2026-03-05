import React, { useState } from 'react';
import { 
  Box, Button, FormControl, FormLabel, Heading, Input, 
  Stack, Text, useToast, InputGroup, InputRightElement, IconButton,
  Tabs, TabList, Tab, TabPanels, TabPanel, Flex
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [tabIndex, setTabIndex] = useState(0); // 0: User, 1: Admin
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // USER ALANLARI
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ADMIN ÖZEL ALANLARI
  const [storeId, setStoreId] = useState(''); 
  const [identityName, setIdentityName] = useState(''); 

  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = () => {
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || "[]");
      let newUser;

      // 1. MÜŞTERİ KAYDI
      if (tabIndex === 0) {
        if (!name || !email || !password) {
            toast({ title: "Eksik Bilgi", description: "Lütfen tüm alanları doldurun.", status: "warning" });
            setIsLoading(false); return;
        }
        
        if(users.find(u => u.email === email)) {
            toast({ title: "Hata", description: "Bu e-posta zaten kayıtlı.", status: "error" });
            setIsLoading(false); return;
        }

        newUser = {
          id: Date.now(), name, email, password, role: "user", balance: 0 
        };
      } 
      
      // 2. YÖNETİCİ KAYDI
      else {
        if (!storeId || !identityName || !password) {
            toast({ title: "Eksik Bilgi", description: "Lütfen mağaza bilgilerini doldurun.", status: "warning" });
            setIsLoading(false); return;
        }

        if(users.find(u => u.storeId === storeId)) {
            toast({ title: "Hata", description: "Bu Mağaza Kimliği zaten kayıtlı.", status: "error" });
            setIsLoading(false); return;
        }

        newUser = {
          id: Date.now(),
          name: identityName, 
          storeId: storeId,   
          password: password,
          role: "admin",
          balance: 99999 
        };
      }

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast({ 
        title: "Kayıt Başarılı!", 
        description: "Giriş ekranına yönlendiriliyorsunuz.", 
        status: "success", 
        duration: 2000 
      });

      setTimeout(() => navigate('/login'), 1500);
      
    }, 1000);
  };

  return (
    // ARKA PLAN: AYNI SOLUK KIRMIZI/MAVİ TEMA
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bgGradient="linear(to-r, #FFF5F5 50%, #EBF8FF 50%)"
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
            <Heading fontSize="3xl" mb={2} color={tabIndex === 0 ? "blue.600" : "purple.600"} fontFamily="'Segoe UI', sans-serif">
              {tabIndex === 0 ? "Hesap Oluştur" : "Mağaza Kaydı"}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Formu doldurarak aramıza katılın.
            </Text>
          </Box>

          <Tabs isFitted variant="soft-rounded" colorScheme={tabIndex === 0 ? "blue" : "purple"} onChange={(index) => setTabIndex(index)}>
            <TabList mb="1em" bg="gray.50" p={1} borderRadius="full">
              <Tab borderRadius="full" _selected={{ color: 'white', bg: 'blue.500' }}>Bireysel</Tab>
              <Tab borderRadius="full" _selected={{ color: 'white', bg: 'purple.500' }}>Kurumsal</Tab>
            </TabList>

            <TabPanels>
              {/* --- KULLANICI FORMU --- */}
              <TabPanel p={0}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>İsim Soyisim</FormLabel>
                    <Input size="lg" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>E-posta</FormLabel>
                    <Input type="email" size="lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                      <InputRightElement><IconButton variant="ghost" icon={showPass ? <FaEyeSlash/> : <FaEye/>} onClick={() => setShowPass(!showPass)}/></InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>

              {/* --- ADMİN FORMU --- */}
              <TabPanel p={0}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Mağaza Kimlik Kartı</FormLabel>
                    <Input size="lg" value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="Örn: 34-IST-001" bg="purple.50" borderColor="purple.100"/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Kimlik Kartı İsim Soyisim</FormLabel>
                    <Input size="lg" value={identityName} onChange={(e) => setIdentityName(e.target.value)} placeholder="Yetkili Adı" bg="purple.50" borderColor="purple.100"/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <Input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" bg="purple.50" borderColor="purple.100"/>
                      <InputRightElement><IconButton variant="ghost" icon={showPass ? <FaEyeSlash/> : <FaEye/>} onClick={() => setShowPass(!showPass)}/></InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>

            {/* KAYIT BUTONU (TYPE=BUTTON) */}
            <Button 
              mt={6} w="full" size="lg"
              colorScheme={tabIndex === 0 ? "blue" : "purple"} 
              isLoading={isLoading}
              onClick={handleRegister}
              type="button"
            >
              {tabIndex === 0 ? "Kayıt Ol" : "Mağazayı Kaydet"}
            </Button>

          </Tabs>

          <Flex justify="center" gap={1}>
            <Text fontSize="sm">Zaten hesabınız var mı?</Text>
            <Button variant="link" colorScheme={tabIndex === 0 ? "blue" : "purple"} size="sm" onClick={() => navigate('/login')}>
              Giriş Yap
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;