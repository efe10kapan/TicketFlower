import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Button, Image, Icon, 
  VStack, HStack, Divider, useDisclosure,
  useToast, Avatar, Tooltip, Grid, GridItem, 
  List, ListItem, ListIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Tabs, TabList, Tab, IconButton, Badge, Flex
} from '@chakra-ui/react';
import { 
  FaTicketAlt, FaStar, FaArrowLeft, FaClock, FaMapMarkerAlt, 
  FaChair, FaLock, FaTheaterMasks, FaUserTie, FaParking, FaGlassMartiniAlt, FaCheckCircle, FaSyncAlt, FaChevronRight, FaChevronLeft
} from 'react-icons/fa';

// --- 1. VERİ HAVUZU (TheaterPage ile AYNI OLMAK ZORUNDA) ---
const POSTER_MAP = {
  "Alice Harikalar Diyarında": "https://images.justwatch.com/poster/260769800/s718/alis-harikalar-diyarinda.%7Bformat%7D",
  "Cimri": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/cimri-20235291064.jpeg",
  "Hamlet": "https://img.rgstatic.com/content/movie/c2872588-32f5-47d9-9a36-689111780adc/poster-780.jpg",
  "Amadeus": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/d273f76c8d7643ada1eeae7f3f474bee.jpg",
  "Lüküs Hayat": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/lukus-hayat-ebb-202492616019b04127a67233494ea10c7abc48886a56.jpg",
  "Kürk Mantolu Madonna": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/kurk-mantolu-madonna-20246291432409f6af6c2f6ea4af282439b42c8f84406.jpg",
  "Godot'yu Beklerken": "https://playtusu.com/wp-content/uploads/2024/08/GT6bwtrXgAA0u4U.jpeg",
  "Bir Delinin Hatıra Defteri": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/bir-delinin-hatira-defteri-sonsuz-2025921556204a1f25ae37dd447c9ff42cf9e708e435.png",
  "Macbeth": "https://www.bonzoproductions.com/macbeth/graphics/macbeth-background3b.jpg",
  "Kel Şarkıcı": "https://tse4.mm.bing.net/th/id/OIP.dyT7EXa0J8WjS8HMPeGpnAHaJL?w=950&h=1178&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Kanlı Nigar": "https://tr.web.img3.acsta.net/pictures/bzp/01/213405.jpg",
  "Romeo ve Juliet": "https://cdn.timas.com.tr/urun/romeo-ve-juliet-9786054985418.jpg",
  "Othello": "https://th.bing.com/th/id/R.00835daa09f64570c9da1a6ded189315?rik=QuhXxsPDa7%2bKAA&riu=http%3a%2f%2f4.bp.blogspot.com%2f_D9cWf075QuU%2fTAuBVPcWIdI%2fAAAAAAAAAR4%2fNZkE8mqM9wI%2fs1600%2fOthello%2bby%2bWilliam%2bShakespeare%2bOKEEH.jpg&ehk=dnJyNK5SDFj2VQKMm4k%2bELeg%2f8wqatzDQdh%2bPvNWvXQ%3d&risl=&pid=ImgRaw&r=0",
  "Sefiller": "https://tse4.mm.bing.net/th/id/OIP.z9gSpLc-3hpgiZLdzxPnCwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Fareler ve İnsanlar": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/fareler-ve-insanlar-20231116114722c18e0ff0db994f7ba81145f3578bbcd2.jpeg",
  "Don Kişot": "https://tse4.mm.bing.net/th/id/OIP.MJP2MpV4Dnj3Y495615Q5AHaKt?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Kral Lear": "https://www.databazeknih.cz/img/books/50_/507952/big_kral-lear-bTD-507952.jpg",
  "Fırtına": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/firtina-tiyatro-oyunu-2025911337164ee0e36d6cfd4e9e8282ab731322ac0c.jpeg",
  "Operadaki Hayalet": "https://images.justwatch.com/poster/73350280/s718/operadaki-hayalet.jpg",
  "Aslan Kral": "https://images.justwatch.com/poster/264337438/s718/aslan-kral-2019.%7Bformat%7D",
  "Hisseli Harikalar Kumpanyası": "https://im.haberturk.com/movies/movie/b/hisseli-harikalar-kumpanyasi-350167.jpg?ver=1701241199",
  "Keşanlı Ali Destanı": "https://i4.hurimg.com/i/hurriyet/75/750x422/5c0fbd15c03c0e0df4fba5c0.jpg",
  "Ferhangi Şeyler": "https://tse1.mm.bing.net/th/id/OIP.dLobHS7gCmKbJVWOLub-2gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Vişne Bahçesi": "https://www.gazetekadikoy.com.tr/Uploads/gazetekadikoy.com.tr/202307131539321-img.jpeg",
  "Küçük Prens": "https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG",
  "Martı": "https://b6s54eznn8xq.merlincdn.net/IBB/TheatrePlay/Brochure/45f43206b3ba4ed0a1ef002e203707f4.jpg",
  "1984": "https://tse4.mm.bing.net/th/id/OIP.mZ8lfUjtuU5CvVzBCcc9ygHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Şeker Portakalı": "https://tse4.mm.bing.net/th/id/OIP.QPdsxb6wcoxsHJv8gn1ZawHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Saatleri Ayarlama Enstitüsü": "https://tse3.mm.bing.net/th/id/OIP.TidPlmAJoctWXhpy-P1J6gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Suç ve Ceza": "https://th.bing.com/th/id/R.5a74e63b3bf9fb61648996d9c2b36f00?rik=kbXvjykxKiptVw&pid=ImgRaw&r=0",
  "Dönüşüm": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/donusum-highest-2025424917238fff5d63b8bf4d3d8d9e1a7a80ef8b3a.png",
  "Zengin Mutfağı": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/zengin-mutfagi-2021123011125.jpg",
  "Kundakçı": "https://tse3.mm.bing.net/th/id/OIP.brv0Ks7MuCA-DvWBvv9k6gHaKX?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Bir Baba Hamlet": "https://www.babasahne.com/uploads/oyun_afis/134_1t9NseGC0Z.jpg",
  "Tartuffe": "https://ridgeviewecho.com/wp-content/uploads/2024/02/IMG_1006-scaled.jpg",
  "Notre Dame'ın Kamburu": "https://tse2.mm.bing.net/th/id/OIP.LxpmVVO26qJ7IyZGE1zLiwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Ayak Bacak Fabrikası": "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/ayak-bacak-fabrikasi-2020108163523.jpg",
  "Yedi Kocalı Hürmüz": "https://th.bing.com/th/id/R.55b0274070fe6da1b0772404b8fe200f?rik=L410RnQi%2bGYkHQ&pid=ImgRaw&r=0",
  "Cyrano de Bergerac": "https://tse1.mm.bing.net/th/id/OIP.henIErdQrt3yTTtJWWg5NwHaKq?w=556&h=800&rs=1&pid=ImgDetMain&o=7&rm=3",
  "Bir Yaz Gecesi Rüyası": "https://th.bing.com/th/id/R.9ab85f2cad936027e18b26d0958cba26?rik=8xjXZ5%2bswYQI4g&pid=ImgRaw&r=0",
  "Vanya Dayı": "https://tse4.mm.bing.net/th/id/OIP.p2-g3OSMTmBzfMDreTUDUwHaLh?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Üç Kız Kardeş": "https://penguenkitap.com.tr/upload/products/uc-kiz-kardes/uc-kiz-kardes_2319.jpg",
  "Satıcının Ölümü": "https://tse4.mm.bing.net/th/id/OIP.Zey9VonvQ8z0PdOnhXghEgHaKl?rs=1&pid=ImgDetMain&o=7&rm=3",
  "Arzu Tramvayı": "https://tiyatrolar.com.tr/files/activity/a/arzu-tramvayi/image/arzu-tramvayi.jpg",
  "Damdaki Kemancı": "https://m.media-amazon.com/images/M/MV5BZDgwYTM2NzQtY2JkMi00MzE0LWE2ZjItNzliZTY2OTc2YzVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  "Mamma Mia": "https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_.jpg",
  "Wicked": "https://cdn.britannica.com/09/251609-050-C7714B50/Broadway-musical-Wicked-performance-Sydney-2009.jpg",
  "Chicago": "https://th.bing.com/th/id/R.b168cb506f690e8d6e005a6f624674dc?rik=jbpFy%2bXy%2bYVZCw&riu=http%3a%2f%2fdata.logograph.com%2fresize%2fEKUCenter%2fmultimedia%2fImage%2f5071%2fchicago-the-musical-event-page.jpg%3fwidth%3d1500&ehk=dnKifudO4eTjzaeL5Y7GHxU8n4F0%2b1tYJDRQMRYVXjA%3d&risl=&pid=ImgRaw&r=0",
  "Cats": "https://th.bing.com/th/id/R.4c7d202276865cc4da3f260b85677eae?rik=k0o2GQodk1NVKQ&pid=ImgRaw&r=0",
  "Hamilton": "https://th.bing.com/th/id/R.f087d1d89890ece9126c2e07875f924d?rik=QVEMFYPEF62iuA&pid=ImgRaw&r=0"
};

// OYUN İSİMLERİ VE LİSTE ÜRETİMİ (DATA MATCHING)
const PLAY_TITLES = Object.keys(POSTER_MAP);
const GENRES = ["Dram", "Komedi", "Müzikal", "Trajedi", "Tirad", "Absürt", "Çocuk Oyunu", "Gerilim"];
const DISTRICTS = [ "Kadıköy", "Beyoğlu", "Şişli", "Üsküdar", "Beşiktaş", "Ataşehir", "Sancaktepe", "Kartal", "Pendik", "Fatih", "Bahçelievler", "Bakırköy" ];

// TAM LİSTEYİ BURADA DA OLUŞTURUYORUZ Kİ DETAY SAYFASI BULABİLSİN
const FULL_PLAY_LIST = PLAY_TITLES.map((title, index) => {
  return {
    id: index + 1,
    t: title,
    g: GENRES[index % GENRES.length],
    img: POSTER_MAP[title],
    stage: `${DISTRICTS[index % DISTRICTS.length]} Kültür Merkezi`,
    district: DISTRICTS[index % DISTRICTS.length],
    time: "20:30"
  };
});

// --- SAHNELER ---
const STAGES = [
  { id: 0, name: "Ana Sahne (Büyük Salon)", rows: 4, cols: 8, sections: ['Protokol', 'Salon', 'Balkon'] },
  { id: 1, name: "Stüdyo Sahne (Salon 2)", rows: 3, cols: 6, sections: ['Salon'] }
];

const CATEGORY_PRICES = { 'Protokol': 500, 'Salon': 350, 'Balkon': 200 };
const CATEGORY_COLORS = { 'Protokol': 'red.600', 'Salon': 'orange.500', 'Balkon': 'purple.500' };

const TheaterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // --- ÖNEMLİ: URL'DEN GELEN ID İLE OYUNU BUL ---
  const activePlay = useMemo(() => {
    return FULL_PLAY_LIST.find(p => p.id === parseInt(id)) || FULL_PLAY_LIST[0];
  }, [id]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // --- STATE ---
  const [currentStageIdx, setCurrentStageIdx] = useState(0); 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  const [userBalance, setUserBalance] = useState(0);

  const currentStage = STAGES[currentStageIdx];

  // --- VERİLERİ YÜKLE ---
  useEffect(() => {
    const balance = parseFloat(localStorage.getItem('userBalance') || "0");
    setUserBalance(balance);
    loadOccupancy(currentStageIdx);
  }, [id, currentStageIdx]);

  const loadOccupancy = (stageIndex) => {
    const key = `theater_occ_${id}_stage_${stageIndex}`;
    let savedData = JSON.parse(localStorage.getItem(key) || "null");

    if (!savedData) {
      savedData = [];
      const totalSeats = STAGES[stageIndex].rows * STAGES[stageIndex].cols * 3; 
      const randomCount = Math.floor(totalSeats * 0.3); 
      for(let i=0; i<randomCount; i++) {
        const sec = STAGES[stageIndex].sections[Math.floor(Math.random() * STAGES[stageIndex].sections.length)];
        const r = Math.floor(Math.random() * STAGES[stageIndex].rows);
        const c = Math.floor(Math.random() * STAGES[stageIndex].cols);
        const seatId = `${sec}-${r}-${c}`;
        if(!savedData.includes(seatId)) savedData.push(seatId);
      }
      localStorage.setItem(key, JSON.stringify(savedData));
    }
    setOccupiedSeats(savedData);
    setSelectedSeats([]); 
  };

  const simulateLiveSales = () => {
    const newOccupied = [...occupiedSeats];
    let added = 0;
    for(let i=0; i<2; i++){
        const sec = currentStage.sections[Math.floor(Math.random() * currentStage.sections.length)];
        const r = Math.floor(Math.random() * currentStage.rows);
        const c = Math.floor(Math.random() * currentStage.cols);
        const seatId = `${sec}-${r}-${c}`;
        if(!newOccupied.includes(seatId) && !selectedSeats.find(s=>s.id === seatId)) {
            newOccupied.push(seatId);
            added++;
        }
    }
    if(added > 0) {
        setOccupiedSeats(newOccupied);
        const key = `theater_occ_${id}_stage_${currentStageIdx}`;
        localStorage.setItem(key, JSON.stringify(newOccupied));
        toast({ title: "Canlı Veri Güncellendi", description: `${added} bilet daha satıldı!`, status: "warning", duration: 2000, position: "top-right" });
    }
  };

  const toggleSeat = (seatId, category) => {
    if (occupiedSeats.includes(seatId)) return;
    const price = CATEGORY_PRICES[category];
    const exists = selectedSeats.find(s => s.id === seatId);
    if (exists) setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
    else setSelectedSeats(prev => [...prev, { id: seatId, price, category }]);
  };

  const calculateTotal = () => selectedSeats.reduce((acc, s) => acc + s.price, 0);

  const handlePayment = () => {
    const total = calculateTotal();
    if (total > userBalance) {
        toast({ title: "Yetersiz Bakiye!", description: `Bakiyeniz: ${userBalance} TL`, status: "error", duration: 4000, position: "top" });
        return;
    }
    const newBalance = userBalance - total;
    localStorage.setItem('userBalance', newBalance);
    setUserBalance(newBalance);

    const newOccupiedList = [...occupiedSeats, ...selectedSeats.map(s => s.id)];
    setOccupiedSeats(newOccupiedList);
    const key = `theater_occ_${id}_stage_${currentStageIdx}`;
    localStorage.setItem(key, JSON.stringify(newOccupiedList));

    const ticket = {
        id: Date.now(),
        type: 'theater',
        title: activePlay.t, // ARTIK DOĞRU İSİM ALINIYOR
        img: activePlay.img, // FOTOĞRAF EKLENDİ
        stage: currentStage.name,
        seats: selectedSeats.map(s => s.id),
        totalPrice: total,
        date: new Date().toLocaleDateString()
    };
    const myTickets = JSON.parse(localStorage.getItem('myTickets') || "[]");
    localStorage.setItem('myTickets', JSON.stringify([...myTickets, ticket]));

    toast({ title: "Biletleriniz Hazır!", description: "İyi seyirler.", status: "success", duration: 3000, position: "top" });
    setSelectedSeats([]);
  };

  const renderSection = (rows, cols, label) => (
    <Box mb={6} textAlign="center">
        <Text fontSize="xs" color="gray.500" mb={1} letterSpacing="widest" textTransform="uppercase">{label} - {CATEGORY_PRICES[label]} TL</Text>
        <VStack spacing={1}>
            {Array.from({ length: rows }).map((_, r) => (
                <HStack key={r} spacing={2} justify="center">
                    {Array.from({ length: cols }).map((_, c) => {
                        const seatId = `${label}-${r}-${c}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.find(s => s.id === seatId);
                        const color = CATEGORY_COLORS[label];
                        return (
                            <Tooltip label={`${label} | S:${r+1} K:${c+1}`} key={seatId} openDelay={500}>
                                <Box 
                                    w={label === 'Protokol' ? "32px" : "24px"} h={label === 'Protokol' ? "32px" : "24px"} 
                                    bg={isOccupied ? "gray.700" : isSelected ? "green.400" : color}
                                    borderRadius="t-lg" cursor={isOccupied ? "not-allowed" : "pointer"}
                                    opacity={isOccupied ? 0.4 : 1}
                                    onClick={() => toggleSeat(seatId, label)}
                                    boxShadow={isSelected ? "0 0 15px #48BB78" : "none"}
                                    transition="all 0.2s"
                                    _hover={{ transform: !isOccupied && "scale(1.2)", zIndex: 10 }}
                                >
                                    {isSelected && <Icon as={FaCheckCircle} w="full" h="full" p={1} color="whiteAlpha.900"/>}
                                </Box>
                            </Tooltip>
                        )
                    })}
                </HStack>
            ))}
        </VStack>
    </Box>
  );

  return (
    <Box bg="#0a0a0a" minH="100vh" color="gray.200" fontFamily="'Georgia', serif" pb={20}>
      
      {/* HERO SECTION */}
      <Box h="70vh" position="relative" bgImage={`url(${activePlay.img})`} bgSize="cover" bgPosition="top" bgAttachment="fixed">
        <Box position="absolute" inset={0} bgGradient="linear(to-t, #0a0a0a, rgba(0,0,0,0.6))" />
        <Container maxW="1300px" h="100%" position="relative" zIndex={2} display="flex" flexDirection="column" justifyContent="flex-end" pb={16}>
            <Button position="absolute" top={10} left={0} leftIcon={<FaArrowLeft />} variant="ghost" color="white" onClick={() => navigate(-1)} _hover={{ bg: "whiteAlpha.200" }}>Geri Dön</Button>
            <Badge bg="red.600" color="white" alignSelf="start" fontSize="md" px={3} py={1} mb={4} borderRadius="md">TİYATRO</Badge>
            <Heading size="4xl" fontFamily="'Playfair Display', serif" color="white" textShadow="0 4px 15px black" mb={4}>{activePlay.t}</Heading>
            <HStack spacing={6} fontSize="xl" color="gray.300">
                <Flex align="center"><Icon as={FaClock} mr={2} color="red.500"/> 120 Dk / 2 Perde</Flex>
                <Flex align="center"><Icon as={FaMapMarkerAlt} mr={2} color="red.500"/> {activePlay.stage}</Flex>
                <Flex align="center"><Icon as={FaStar} mr={2} color="yellow.500"/> 9.8/10</Flex>
            </HStack>
        </Container>
      </Box>

      {/* ANA İÇERİK */}
      <Container maxW="1300px" mt={-10} position="relative" zIndex={3}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={12}>
            
            {/* SOL TARAF */}
            <GridItem>
                <Box bg="#1a1a1a" p={8} borderRadius="xl" border="1px solid #333" mb={8} boxShadow="xl">
                    <Heading size="lg" mb={6} fontFamily="'Playfair Display', serif" color="red.400" borderBottom="1px solid #333" pb={4}>Oyun Hakkında</Heading>
                    <Text fontSize="lg" lineHeight="1.8" color="gray.400" textAlign="justify">
                        Bu eşsiz eser, {activePlay.t} adıyla sahneye konuluyor ve seyirciyi derin bir yolculuğa çıkarıyor. {activePlay.g} türündeki bu yapım, sahne tasarımı, ışık oyunları ve usta oyuncu kadrosuyla unutulmaz bir deneyim vaat ediyor. Sanatın iyileştirici gücünü ve sahnenin büyüsünü hissetmek için yerinizi şimdiden ayırtın.
                    </Text>
                </Box>

                <Box mb={8}>
                    <Heading size="md" mb={4} color="white">Önemli Bilgiler</Heading>
                    <Accordion allowToggle defaultIndex={[0]}>
                        <AccordionItem border="none" bg="#1a1a1a" borderRadius="md" mb={2}>
                            <AccordionButton>
                                <Box flex="1" textAlign="left" fontWeight="bold"><Icon as={FaTheaterMasks} mr={2}/> Kurallar</Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4} color="gray.400">
                                <List spacing={2}>
                                    <ListItem><ListIcon as={FaCheckCircle} color="red.500" />Oyun başladıktan sonra salona alım yapılmaz.</ListItem>
                                    <ListItem><ListIcon as={FaCheckCircle} color="red.500" />13 yaş sınırı vardır.</ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>
            </GridItem>

            {/* SAĞ TARAF: BİLET */}
            <GridItem>
                <Box position="sticky" top="100px" bg="#151515" p={6} borderRadius="xl" border="1px solid #C53030" boxShadow="0 0 20px rgba(197, 48, 48, 0.2)">
                    
                    <Flex justify="space-between" align="center" mb={6} bg="#222" p={2} borderRadius="lg">
                        <IconButton icon={<FaChevronLeft />} size="sm" variant="ghost" colorScheme="red" isDisabled={currentStageIdx === 0} onClick={() => setCurrentStageIdx(0)}/>
                        <VStack spacing={0}>
                            <Text fontSize="xs" color="gray.500">SAHNE SEÇİMİ</Text>
                            <Text fontWeight="bold" color="white">{currentStage.name}</Text>
                        </VStack>
                        <IconButton icon={<FaChevronRight />} size="sm" variant="ghost" colorScheme="red" isDisabled={currentStageIdx === STAGES.length - 1} onClick={() => setCurrentStageIdx(1)}/>
                    </Flex>

                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontSize="xs" color="red.300" fontWeight="bold">● CANLI</Text>
                        <Button size="xs" leftIcon={<FaSyncAlt/>} variant="outline" colorScheme="red" onClick={simulateLiveSales}>Yenile</Button>
                    </Flex>

                    <Box w="80%" h="15px" bg="linear-gradient(to bottom, #C53030, #742A2A)" mx="auto" mb={6} borderRadius="0 0 50px 50px" boxShadow="0 5px 20px rgba(197, 48, 48, 0.4)">
                        <Text textAlign="center" fontSize="xs" color="white" fontWeight="bold" pt={0}>PERDE</Text>
                    </Box>

                    <Box maxH="400px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#555' } }}>
                        {currentStage.sections.map(sec => renderSection(currentStage.rows, currentStage.cols, sec))}
                    </Box>

                    <Divider my={6} borderColor="gray.700"/>

                    <VStack align="stretch" spacing={3} mb={6}>
                        {selectedSeats.length === 0 ? (
                            <Text textAlign="center" color="gray.500" fontSize="sm">Lütfen koltuk seçiniz.</Text>
                        ) : (
                            selectedSeats.map((seat, i) => (
                                <Flex key={i} justify="space-between" bg="#222" p={2} borderRadius="md" fontSize="sm">
                                    <Text>{seat.category} | {seat.id.split('-').slice(1).join('-')}</Text>
                                    <Text fontWeight="bold" color="red.300">{seat.price} TL</Text>
                                </Flex>
                            ))
                        )}
                    </VStack>

                    <Flex justify="space-between" align="center" mb={2}>
                        <Text color="gray.400">Toplam:</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="white">{calculateTotal()} TL</Text>
                    </Flex>
                    
                    <Flex justify="space-between" align="center" mb={4} fontSize="xs" color={calculateTotal() > userBalance ? "red.500" : "green.400"}>
                        <Text>Cüzdan:</Text>
                        <Text>{userBalance} TL</Text>
                    </Flex>

                    <Button w="full" colorScheme="red" size="lg" isDisabled={selectedSeats.length === 0} onClick={handlePayment} leftIcon={<FaTicketAlt />} _hover={{ transform: "translateY(-2px)", boxShadow: "0 5px 15px rgba(197, 48, 48, 0.4)" }}>
                        ÖDEMEYİ TAMAMLA
                    </Button>
                </Box>
            </GridItem>

        </Grid>
      </Container>

    </Box>
  );
};

export default TheaterDetailPage;