import React, { useState, useEffect } from 'react';
import {
  Box, Container, Flex, Heading, Text, Button, Image, Icon, 
  SimpleGrid, Badge, VStack, HStack, Divider, Input,
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Card, CardHeader, CardBody, 
  useToast, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton, useDisclosure,
  Grid, GridItem, FormControl, FormLabel
} from '@chakra-ui/react';
import { 
  FaTicketAlt, FaWallet, FaUser, FaQrcode, FaChair, FaLock, FaCreditCard, FaHistory 
} from 'react-icons/fa';

const UserProfile = () => {
  // --- STATE ---
  // 1. Kullanıcıyı LocalStorage'dan al, yoksa Demo verisini kullan
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : { name: "Efe Kapan", email: "efe@ticketflower.com" };
  });

  const [balance, setBalance] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // QR Modalı için
  
  // Bakiye Yükleme State'leri
  const [amountToLoad, setAmountToLoad] = useState(0); 
  const [customAmount, setCustomAmount] = useState(""); 
  const [password, setPassword] = useState(""); 

  // Modallar
  const { isOpen: isQROpen, onOpen: onQROpen, onClose: onQRClose } = useDisclosure();
  const { isOpen: isAddFundsOpen, onOpen: onAddFundsOpen, onClose: onAddFundsClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  
  const toast = useToast();

  // --- VERİLERİ ÇEK ---
  useEffect(() => {
    // Bakiyeyi Çek
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
    } else {
        // Eğer kayıtlı bakiye yoksa (ilk giriş), kullanıcının varsayılan bakiyesini al
        setBalance(user.balance || 0);
    }

    // Biletleri Çek
    const savedTickets = JSON.parse(localStorage.getItem('myTickets') || "[]");
    // Ters çevir ki en son alınan bilet en üstte görünsün
    setTickets(savedTickets.reverse());
  }, [user.balance]); // user.balance değişirse tetikle

  // --- BAKİYE YÜKLEME SÜRECİ ---

  // 1. Adım: Tutar Seçimi
  const initiateLoad = () => {
    let finalAmount = 0;
    
    if (customAmount && parseFloat(customAmount) > 0) {
      finalAmount = parseFloat(customAmount);
    } else if (amountToLoad > 0) {
      finalAmount = amountToLoad;
    } else {
      toast({ title: "Lütfen bir tutar seçin veya girin.", status: "warning", position: "top" });
      return;
    }
    
    setAmountToLoad(finalAmount); 
    onAddFundsClose(); 
    onConfirmOpen();   
  };

  // 2. Adım: Şifre Kontrolü ve Yükleme
  const confirmAndLoad = () => {
    if (password !== "123456") { 
      toast({ title: "Hatalı Şifre!", status: "error", position: "top" });
      return;
    }

    const newBalance = balance + amountToLoad;
    setBalance(newBalance);
    localStorage.setItem('userBalance', newBalance);
    
    toast({
      title: "Yükleme Başarılı",
      description: `Hesabınıza ${amountToLoad} TL yüklendi.`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top"
    });

    // Temizlik
    setPassword("");
    setCustomAmount("");
    setAmountToLoad(0);
    onConfirmClose();
  };

  const openQR = (ticket) => {
    setSelectedTicket(ticket);
    onQROpen();
  };

  return (
    <Box bg="#f7fafc" minH="100vh" pb={20} fontFamily="'Segoe UI', sans-serif">
      
      {/* 1. ÜST HEADER (MOR TEMA) */}
      <Box bgGradient="linear(to-r, purple.800, purple.600)" h="320px" position="relative" mb={20}>
        <Container maxW="1200px" h="100%" display="flex" alignItems="center" pt={5}>
           <HStack spacing={6} align="center">
              <Flex w="110px" h="110px" bg="white" borderRadius="full" align="center" justify="center" boxShadow="2xl" border="4px solid white">
                 <Icon as={FaUser} boxSize={50} color="purple.500" />
              </Flex>
              <Box color="white">
                 <Heading size="xl" mb={1}>{user.name}</Heading>
                 <Text opacity={0.8} fontSize="lg">{user.email}</Text>
                 <Badge mt={3} colorScheme="yellow" p={1} px={3} borderRadius="full" fontSize="0.8em">PREMIUM ÜYE</Badge>
              </Box>
           </HStack>
        </Container>
      </Box>

      {/* 2. ANA İÇERİK */}
      <Container maxW="1200px" mt="-60px">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            
            {/* SOL: CÜZDAN KARTI */}
            <Box gridColumn={{ lg: "span 1" }}>
                <Card borderRadius="2xl" boxShadow="2xl" bg="white" overflow="hidden">
                    <Box bgGradient="linear(to-br, gray.800, black)" p={8} color="white" position="relative">
                        <Flex justify="space-between" mb={8}>
                            <Icon as={FaCreditCard} boxSize={8} opacity={0.8} />
                            <Text letterSpacing="2px" fontWeight="bold">TICKET FLOWER</Text>
                        </Flex>
                        
                        <Text fontSize="sm" opacity={0.6} mb={1}>MEVCUT BAKİYE</Text>
                        <Heading size="2xl" mb={8}>
                            {balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                        </Heading>
                        
                        <Flex justify="space-between" align="flex-end">
                            <Box>
                                <Text fontSize="xs" opacity={0.6} mb={1}>KART SAHİBİ</Text>
                                <Text fontSize="md" fontWeight="bold">{user.name.toUpperCase()}</Text>
                            </Box>
                            <Text fontSize="md" letterSpacing="2px">**** 4289</Text>
                        </Flex>
                        
                        {/* Dekoratif Daire */}
                        <Box position="absolute" bottom="-30px" right="-30px" w="120px" h="120px" bg="whiteAlpha.100" borderRadius="full" />
                    </Box>
                    <CardBody>
                        <Button 
                            w="full" colorScheme="purple" size="lg" h="60px" fontSize="lg"
                            onClick={onAddFundsOpen} boxShadow="lg"
                            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
                        >
                            + Bakiye Yükle
                        </Button>
                        
                        <Divider my={6} />
                        
                        <Heading size="sm" mb={4} color="gray.600">Bilet İstatistikleri</Heading>
                        <HStack spacing={4}>
                            <VStack bg="purple.50" p={4} borderRadius="xl" w="full" border="1px solid" borderColor="purple.100">
                                <Heading size="lg" color="purple.600">{tickets.length}</Heading>
                                <Text fontSize="xs" color="gray.500" fontWeight="bold">TOPLAM BİLET</Text>
                            </VStack>
                            <VStack bg="blue.50" p={4} borderRadius="xl" w="full" border="1px solid" borderColor="blue.100">
                                <Heading size="lg" color="blue.600">{Math.floor(tickets.length * 15)}</Heading>
                                <Text fontSize="xs" color="gray.500" fontWeight="bold">PUANLAR</Text>
                            </VStack>
                        </HStack>
                    </CardBody>
                </Card>
            </Box>

            {/* SAĞ: BİLETLERİM LİSTESİ */}
            <Box gridColumn={{ lg: "span 2" }}>
                <Card borderRadius="2xl" boxShadow="xl" minH="600px" border="1px solid #eee">
                    <CardHeader borderBottom="1px solid" borderColor="gray.100" bg="white" borderRadius="2xl 2xl 0 0" py={6}>
                        <Flex justify="space-between" align="center">
                            <Heading size="md" color="gray.700">
                                <Icon as={FaTicketAlt} mr={3} color="purple.500"/>
                                Biletlerim
                            </Heading>
                            <Tabs variant="soft-rounded" colorScheme="purple" size="sm">
                                <TabList>
                                    <Tab>Aktif Biletler</Tab>
                                    <Tab><Icon as={FaHistory} mr={2}/>Geçmiş</Tab>
                                </TabList>
                            </Tabs>
                        </Flex>
                    </CardHeader>

                    <CardBody bg="#fbfbfb" p={6}>
                        {tickets.length === 0 ? (
                            <VStack py={20} spacing={6} opacity={0.6}>
                                <Icon as={FaTicketAlt} boxSize={24} color="gray.300" />
                                <Text fontSize="lg" color="gray.500">Henüz hiç bilet almadınız.</Text>
                                <Button size="sm" colorScheme="purple" variant="outline" onClick={() => window.location.href='/app/content/theater'}>Etkinliklere Göz At</Button>
                            </VStack>
                        ) : (
                            <VStack spacing={6}>
                                {tickets.map((ticket, index) => {
                                    // Tiyatro mu Sinema mı kontrolü (Daha sağlam mantık)
                                    const isTheater = ticket.type === 'theater' || ticket.salon?.includes("Sahne") || ticket.stage; 
                                    const themeColor = isTheater ? "red" : "blue";
                                    const categoryName = isTheater ? "TİYATRO" : "SİNEMA";

                                    return (
                                        <Flex 
                                            key={index} 
                                            w="full" bg="white" borderRadius="xl" overflow="hidden" boxShadow="md"
                                            border="1px solid" borderColor="gray.200"
                                            direction={{ base: "column", md: "row" }}
                                            transition="all 0.3s"
                                            _hover={{ transform: "translateY(-5px)", boxShadow: "lg", borderColor: `${themeColor}.300` }}
                                        >
                                            {/* SOL ŞERİT */}
                                            <Box w={{ base: "100%", md: "12px" }} h={{ base: "12px", md: "auto" }} bg={`${themeColor}.500`} />
                                            
                                            {/* ORTA BİLGİLER */}
                                            <Box p={6} flex="1">
                                                <HStack justify="space-between" mb={3}>
                                                    <Badge colorScheme={themeColor} fontSize="0.8em" px={2} py={1} borderRadius="md">
                                                        {categoryName} • {ticket.cinema || ticket.stage || ticket.salon || "Genel"}
                                                    </Badge>
                                                    <Text fontSize="sm" color="gray.500" fontWeight="bold">{ticket.date}</Text>
                                                </HStack>
                                                
                                                <Heading size="md" mb={2} color="gray.800">{ticket.movie || ticket.t || ticket.title || "Bilet"}</Heading>
                                                <Text fontSize="sm" color="gray.500" mb={5}>
                                                    {ticket.session || ticket.time ? (ticket.session || ticket.time) : "Seans Bilgisi Yok"}
                                                </Text>

                                                <Divider mb={4} borderStyle="dashed" />

                                                <SimpleGrid columns={2} spacing={4} fontSize="sm">
                                                    <Flex align="center" color="gray.600">
                                                        <Icon as={FaChair} mr={2} color="gray.400" />
                                                        <Text fontWeight="bold">Koltuklar: {ticket.seats ? ticket.seats.join(", ") : "-"}</Text>
                                                    </Flex>
                                                    <Flex align="center" color="gray.600">
                                                        <Icon as={FaWallet} mr={2} color="gray.400" />
                                                        <Text>Tutar: <span style={{color: themeColor === 'red' ? '#c53030' : '#2b6cb0', fontWeight:"bold"}}>{ticket.price || ticket.totalPrice} TL</span></Text>
                                                    </Flex>
                                                </SimpleGrid>
                                            </Box>

                                            {/* SAĞ QR ALANI */}
                                            <Box 
                                                position="relative" w={{ base: "100%", md: "140px" }}
                                                p={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center" 
                                                bg="gray.50" borderLeft={{ md: "2px dashed #e2e8f0" }}
                                                borderTop={{ base: "2px dashed #e2e8f0", md: "none" }}
                                            >
                                                {/* Süsleme Kesikler */}
                                                <Box position="absolute" left="-12px" top="-12px" w="24px" h="24px" bg="#fbfbfb" borderRadius="full" boxShadow="inset -2px -2px 5px rgba(0,0,0,0.05)" display={{ base: "none", md: "block" }} />
                                                <Box position="absolute" left="-12px" bottom="-12px" w="24px" h="24px" bg="#fbfbfb" borderRadius="full" boxShadow="inset -2px 2px 5px rgba(0,0,0,0.05)" display={{ base: "none", md: "block" }} />

                                                <Button 
                                                    flexDirection="column" h="90px" w="90px" colorScheme="gray" variant="outline"
                                                    onClick={() => openQR(ticket)} borderRadius="xl"
                                                    _hover={{ bg: "white", borderColor: `${themeColor}.400`, color: `${themeColor}.500` }}
                                                >
                                                    <Icon as={FaQrcode} boxSize={8} mb={2} />
                                                    <Text fontSize="xs">QR</Text>
                                                </Button>
                                            </Box>
                                        </Flex>
                                    );
                                })}
                            </VStack>
                        )}
                    </CardBody>
                </Card>
            </Box>
        </SimpleGrid>
      </Container>

      {/* --- MODAL 1: BAKİYE YÜKLEME SEÇİMİ --- */}
      <Modal isOpen={isAddFundsOpen} onClose={onAddFundsClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl">
            <ModalHeader bg="purple.600" color="white" borderRadius="2xl 2xl 0 0">Bakiye Yükle</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={8}>
                <Text mb={4} color="gray.600">Yüklemek istediğiniz tutarı seçin:</Text>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
                    <GridItem>
                        <VStack spacing={3}>
                            {[100, 200, 250].map(amt => {
                                const isSelected = amountToLoad === amt && customAmount === "";
                                return (
                                    <Button 
                                        key={amt} w="full" h="50px"
                                        variant={isSelected ? "solid" : "outline"} 
                                        colorScheme="purple"
                                        borderWidth={isSelected ? 0 : "1px"}
                                        onClick={() => { setAmountToLoad(amt); setCustomAmount(""); }}
                                    >
                                        {amt} TL
                                    </Button>
                                );
                            })}
                        </VStack>
                    </GridItem>
                    <GridItem>
                        <VStack spacing={3}>
                            {[400, 500, 1000].map(amt => {
                                const isSelected = amountToLoad === amt && customAmount === "";
                                return (
                                    <Button 
                                        key={amt} w="full" h="50px"
                                        variant={isSelected ? "solid" : "outline"} 
                                        colorScheme="purple"
                                        borderWidth={isSelected ? 0 : "1px"}
                                        onClick={() => { setAmountToLoad(amt); setCustomAmount(""); }}
                                    >
                                        {amt} TL
                                    </Button>
                                );
                            })}
                        </VStack>
                    </GridItem>
                </Grid>

                <Divider mb={6} />
                
                <FormControl mb={6}>
                    <FormLabel>Farklı Tutar Giriniz</FormLabel>
                    <Input 
                        type="number" placeholder="Örn: 1500" size="lg" 
                        value={customAmount} 
                        onChange={(e) => { setCustomAmount(e.target.value); setAmountToLoad(0); }}
                        focusBorderColor="purple.500"
                    />
                </FormControl>

                <Button w="full" colorScheme="purple" size="lg" onClick={initiateLoad}>
                    DEVAM ET
                </Button>
            </ModalBody>
        </ModalContent>
      </Modal>

      {/* --- MODAL 2: ŞİFRE ONAYI --- */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl" border="2px solid" borderColor="purple.500">
            <ModalHeader textAlign="center" pt={6}>Güvenlik Kontrolü</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={8} textAlign="center">
                <Icon as={FaLock} boxSize={12} color="purple.500" mb={4} />
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {amountToLoad || customAmount} TL Yüklenecek
                </Text>
                <Text color="gray.500" mb={6}>
                    İşlemi onaylamak için lütfen giriş şifrenizi (123456) giriniz.
                </Text>
                
                <Input 
                    type="password" placeholder="Şifre" textAlign="center" size="lg" mb={6}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="purple.500"
                />
                
                <Button w="full" colorScheme="green" size="lg" onClick={confirmAndLoad}>
                    ONAYLA VE YÜKLE
                </Button>
            </ModalBody>
        </ModalContent>
      </Modal>

      {/* --- MODAL 3: QR KOD --- */}
      <Modal isOpen={isQROpen} onClose={onQRClose} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="white" borderRadius="xl" borderTop="8px solid #6b46c1">
            <ModalCloseButton />
            <ModalBody p={8} textAlign="center">
                <Heading size="md" mb={2} color="gray.700">Giriş Bileti</Heading>
                <Text fontSize="sm" color="gray.500" mb={6}>Turnikelerde bu kodu okutunuz.</Text>
                
                <Box border="2px solid" borderColor="gray.200" p={2} borderRadius="lg" display="inline-block" mb={4}>
                    <Image 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket?.id || "ticket"}`} 
                        alt="QR Code"
                    />
                </Box>

                <VStack spacing={1} bg="gray.50" p={3} borderRadius="lg">
                    <Text fontWeight="bold" fontSize="md" color="purple.700">{selectedTicket?.movie || selectedTicket?.t || selectedTicket?.title || "Etkinlik"}</Text>
                    <Text fontSize="xs" color="gray.500">{selectedTicket?.date} • {selectedTicket?.time || selectedTicket?.session}</Text>
                    <Badge colorScheme="green" mt={1}>ÖDENDİ</Badge>
                </VStack>
            </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default UserProfile;