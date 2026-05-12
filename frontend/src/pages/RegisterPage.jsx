import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Heading, Input,
  Stack, Text, useToast, InputGroup, InputRightElement, InputLeftElement,
  IconButton, Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Link, Icon
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaStore, FaIdCard, FaTicketAlt } from 'react-icons/fa';
import authService from '../services/authService.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice.js';

const RegisterPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [storeId, setStoreId] = useState('');
  const [identityName, setIdentityName] = useState('');

  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    setIsLoading(true);

    if (tabIndex === 0) {
      if (!name || !email || !password) {
        toast({ title: "Eksik Bilgi", description: "Lütfen tüm alanları doldurun.", status: "warning" });
        setIsLoading(false);
        return;
      }
      try {
        const userData = await authService.register({ name, email, password });
        dispatch(setUser(userData));
        toast({ title: "Kayıt Başarılı!", description: "Sisteme giriş yapıldı.", status: "success", duration: 2000 });
        navigate('/app');
      } catch (error) {
        toast({ title: "Kayıt Başarısız", description: error.response?.data?.message || error.message || 'Bir şeyler yanlış gitti', status: "error" });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || "[]");

      if (!storeId || !identityName || !password) {
        toast({ title: "Eksik Bilgi", description: "Lütfen mağaza bilgilerini doldurun.", status: "warning" });
        setIsLoading(false);
        return;
      }

      if (users.find(u => u.storeId === storeId)) {
        toast({ title: "Hata", description: "Bu Mağaza Kimliği zaten kayıtlı.", status: "error" });
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        name: identityName,
        storeId,
        password,
        role: "admin",
        balance: 99999
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast({ title: "Kayıt Başarılı!", description: "Yönetici hesabı oluşturuldu.", status: "success", duration: 2000 });
      setTimeout(() => navigate('/login'), 1500);
      setIsLoading(false);
    }, 1000);
  };

  const isUser = tabIndex === 0;
  const focusHex = isUser ? '#76E4F7' : '#D6BCFA';

  const inputStyle = {
    bg: 'rgba(255,255,255,0.07)',
    border: '1px solid',
    borderColor: 'rgba(255,255,255,0.12)',
    color: 'white',
    borderRadius: 'xl',
    _placeholder: { color: 'whiteAlpha.400' },
    _hover: { borderColor: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.09)' },
    _focus: { borderColor: focusHex, boxShadow: `0 0 0 1px ${focusHex}`, bg: 'rgba(255,255,255,0.1)' },
  };

  const labelStyle = {
    color: 'whiteAlpha.600',
    fontSize: 'xs',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 'wider',
    mb: 1,
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="#0d0d1a"
      position="relative"
      overflow="hidden"
      py={{ base: 8, md: 0 }}
    >
      {/* Arka plan ışıltıları */}
      <Box
        position="absolute" top="-100px" left="-100px"
        w={{ base: '300px', md: '500px' }} h={{ base: '300px', md: '500px' }}
        borderRadius="full"
        bg={isUser ? "cyan.900" : "purple.900"}
        opacity={0.6}
        filter="blur(100px)"
        pointerEvents="none"
        transition="background 0.4s"
      />
      <Box
        position="absolute" bottom="-150px" right="-100px"
        w={{ base: '300px', md: '550px' }} h={{ base: '300px', md: '550px' }}
        borderRadius="full"
        bg={isUser ? "blue.900" : "pink.900"}
        opacity={0.5}
        filter="blur(120px)"
        pointerEvents="none"
        transition="background 0.4s"
      />

      {/* Kart */}
      <Box
        sx={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        bg="rgba(255,255,255,0.05)"
        p={{ base: 6, sm: 8, md: 10 }}
        borderRadius={{ base: '2xl', md: '3xl' }}
        boxShadow="0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
        border="1px solid rgba(255,255,255,0.1)"
        w="full"
        maxW={{ base: 'full', sm: 'md' }}
        mx={{ base: 3, sm: 4 }}
        position="relative"
        zIndex={1}
      >
        {/* Marka */}
        <Flex direction="column" align="center" mb={{ base: 6, md: 8 }}>
          <Flex align="center" gap={2} mb={{ base: 3, md: 4 }}>
            <Box
              p={{ base: 1.5, md: 2 }}
              borderRadius="lg"
              bgGradient={isUser ? "linear(to-br, cyan.400, blue.600)" : "linear(to-br, purple.500, pink.500)"}
              boxShadow={isUser ? "0 4px 20px rgba(56,178,172,0.4)" : "0 4px 20px rgba(159,122,234,0.4)"}
              transition="all 0.3s"
            >
              <Icon as={FaTicketAlt} w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} color="white" />
            </Box>
            <Heading fontSize={{ base: 'lg', md: 'xl' }} color="white" fontWeight="800" letterSpacing="tight">
              TicketFlower
            </Heading>
          </Flex>
          <Heading fontSize={{ base: 'xl', md: '2xl' }} color="white" fontWeight="700" mb={1} textAlign="center">
            {isUser ? "Hesap Oluştur ✨" : "Mağaza Kaydı"}
          </Heading>
          <Text color="whiteAlpha.500" fontSize="sm" textAlign="center">
            {isUser ? "Aramıza katılın, bilet dünyasını keşfedin" : "Mağazanızı sisteme ekleyin"}
          </Text>
        </Flex>

        <Stack spacing={{ base: 5, md: 6 }}>
          <Tabs isFitted variant="unstyled" onChange={(index) => setTabIndex(index)}>
            <TabList
              bg="rgba(255,255,255,0.05)"
              p="5px"
              borderRadius="xl"
              border="1px solid rgba(255,255,255,0.1)"
              gap={1}
            >
              <Tab
                borderRadius="lg"
                py={{ base: 1.5, md: 2 }}
                color="whiteAlpha.500" fontWeight="600"
                fontSize={{ base: 'xs', sm: 'sm' }}
                _selected={{
                  color: 'white',
                  bgGradient: 'linear(to-r, cyan.500, blue.500)',
                  boxShadow: '0 4px 14px rgba(56,178,172,0.4)'
                }}
                transition="all 0.25s"
              >
                Bireysel
              </Tab>
              <Tab
                borderRadius="lg"
                py={{ base: 1.5, md: 2 }}
                color="whiteAlpha.500" fontWeight="600"
                fontSize={{ base: 'xs', sm: 'sm' }}
                _selected={{
                  color: 'white',
                  bgGradient: 'linear(to-r, purple.500, pink.500)',
                  boxShadow: '0 4px 14px rgba(159,122,234,0.4)'
                }}
                transition="all 0.25s"
              >
                Kurumsal
              </Tab>
            </TabList>

            <TabPanels mt={{ base: 4, md: 6 }}>
              {/* Kullanıcı Formu */}
              <TabPanel p={0}>
                <Stack spacing={{ base: 4, md: 5 }}>
                  <FormControl>
                    <FormLabel {...labelStyle}>İsim Soyisim</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaUser} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız Soyadınız" />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel {...labelStyle}>E-posta</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaEnvelope} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel {...labelStyle}>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaLock} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                      <InputRightElement>
                        <IconButton variant="ghost" size="sm" color="whiteAlpha.500"
                          _hover={{ color: 'white', bg: 'transparent' }}
                          icon={showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          onClick={() => setShowPass(!showPass)} />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>

              {/* Admin Formu */}
              <TabPanel p={0}>
                <Stack spacing={{ base: 4, md: 5 }}>
                  <FormControl>
                    <FormLabel {...labelStyle}>Mağaza Kimlik Kartı</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaStore} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} value={storeId} onChange={(e) => setStoreId(e.target.value)} placeholder="Örn: 34-IST-001" />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel {...labelStyle}>Kimlik Kartı İsim Soyisim</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaIdCard} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} value={identityName} onChange={(e) => setIdentityName(e.target.value)} placeholder="Yetkili Adı" />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel {...labelStyle}>Şifre</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none" pl={1}>
                        <Icon as={FaLock} color="whiteAlpha.400" boxSize={{ base: 3.5, md: 4 }} />
                      </InputLeftElement>
                      <Input {...inputStyle} pl={10} type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                      <InputRightElement>
                        <IconButton variant="ghost" size="sm" color="whiteAlpha.500"
                          _hover={{ color: 'white', bg: 'transparent' }}
                          icon={showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          onClick={() => setShowPass(!showPass)} />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>

            <Button
              mt={{ base: 5, md: 6 }} w="full"
              size={{ base: 'md', md: 'lg' }}
              bgGradient={isUser ? "linear(to-r, cyan.500, blue.600)" : "linear(to-r, purple.500, pink.500)"}
              color="white" fontWeight="700" borderRadius="xl"
              _hover={{
                bgGradient: isUser ? "linear(to-r, cyan.400, blue.500)" : "linear(to-r, purple.400, pink.400)",
                transform: 'translateY(-2px)',
                boxShadow: isUser ? '0 12px 30px rgba(56,178,172,0.45)' : '0 12px 30px rgba(159,122,234,0.45)'
              }}
              _active={{ transform: 'translateY(0)', boxShadow: 'none' }}
              transition="all 0.25s"
              isLoading={isLoading}
              onClick={handleRegister}
              type="button"
            >
              {isUser ? "Kayıt Ol" : "Mağazayı Kaydet"}
            </Button>
          </Tabs>

          <Flex justify="center" gap={2} align="center" flexWrap="wrap">
            <Text fontSize="sm" color="whiteAlpha.500">Zaten hesabınız var mı?</Text>
            <Link as={RouterLink} to="/login"
              color={isUser ? "cyan.400" : "purple.400"}
              fontWeight="700" fontSize="sm"
              _hover={{ color: isUser ? "cyan.300" : "purple.300", textDecoration: 'none' }}>
              Giriş Yap →
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
