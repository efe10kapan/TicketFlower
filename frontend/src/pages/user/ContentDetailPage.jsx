import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Flex, Heading, Text, Button, Image, Icon, 
  SimpleGrid, Badge, VStack, HStack, Divider, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalHeader,
  Tabs, TabList, Tab, TabPanels, TabPanel, Input, Radio, RadioGroup, Stack, useToast,
  Avatar, Tooltip, Textarea, Checkbox, Select, IconButton
} from '@chakra-ui/react';
import { 
  FaPlay, FaTicketAlt, FaStar, FaArrowLeft, FaClock, 
  FaMapMarkerAlt, FaChair, FaLock, FaCheckCircle, FaHamburger, FaSyncAlt, FaBan
} from 'react-icons/fa';

// --- 1. SABİT FİLM VERİTABANI (20 FİLM - URL DÜZELTİLMİŞ HALİ) ---
const MOVIE_DB = [
  { id: 1, title: "Oppenheimer", desc: "Manhattan Projesi'nin lideri J. Robert Oppenheimer'ın atom bombasını geliştirilme sürecini konu alan biyografik başyapıt.", trailer: "uYPbbksJxIg", img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop: "https://image.tmdb.org/t/p/original/rLb2cs785xa3A2juy652AeFO_y6.jpg", rating: 8.9, duration: "180 dk", genre: "Biyografi/Dram" },
  { id: 2, title: "Barbie", desc: "Barbie diyarında yaşayan bir bebek, yeterince mükemmel olmadığı için kovulur ve gerçek dünyada macera arar.", trailer: "pBk4NYhWNMM", img: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", backdrop: "https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg", rating: 7.2, duration: "114 dk", genre: "Komedi" },
  { id: 3, title: "John Wick 4", desc: "John Wick, Yüksek Şura'yı yenmenin yolunu ararken, eski dostlarını düşmana çeviren yeni bir tehditle yüzleşir.", trailer: "yjRHZEUamCc", img: "https://tse1.mm.bing.net/th/id/OIP.z4ODeP4zFI4k6jahRWm2gwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3", backdrop: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg", rating: 8.0, duration: "169 dk", genre: "Aksiyon" },
  { id: 4, title: "Avatar: Suyun Yolu", desc: "Jake Sully ve Neytiri, ailelerini korumak için Pandora'nın su altı bölgelerine göç etmek zorunda kalır.", trailer: "d9MyqW3xTuE", img: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg", rating: 7.8, duration: "192 dk", genre: "Bilim Kurgu" },
  { id: 5, title: "Top Gun: Maverick", desc: "Otuz yılın ardından Maverick, sınırları zorlayan bir test pilotu olarak geri döner ve geçmişiyle yüzleşir.", trailer: "qSqVVswa420", img: "https://wallpapers.com/images/hd/top-gun-maverick-poster-v145qr6pv3y04efi.jpg", backdrop: "https://image.tmdb.org/t/p/original/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg", rating: 8.3, duration: "130 dk", genre: "Aksiyon" },
  { id: 6, title: "Joker", desc: "Toplum tarafından dışlanan Arthur Fleck'in, suçun palyaçosu Joker'e dönüşümünün psikolojik hikayesi.", trailer: "zAGVQLHvwOY", img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", backdrop: "https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg", rating: 8.4, duration: "122 dk", genre: "Suç/Dram" },
  { id: 7, title: "Örümcek-Adam: Evrene Geçiş", desc: "Miles Morales, çoklu evrenin diğer Örümcek-Adamlarıyla bir araya gelerek yeni bir tehdide karşı savaşır.", trailer: "cqGjhVJWtEg", img: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", backdrop: "https://image.tmdb.org/t/p/original/4HodWWpOB4U50BWxGkHQln8o4NY.jpg", rating: 8.7, duration: "140 dk", genre: "Animasyon" },
  { id: 8, title: "The Batman", desc: "Batman, Gotham'ın yozlaşmış dünyasında seri katil Riddler'ın peşine düşerken kendi geçmişiyle de yüzleşir.", trailer: "mqqft2x_Aa4", img: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", backdrop: "https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg", rating: 7.9, duration: "176 dk", genre: "Suç" },
  { id: 9, title: "Yıldızlararası", desc: "Bir grup astronot, insanlığın devamı için yaşanabilir yeni bir gezegen bulmak amacıyla solucan deliğinden geçer.", trailer: "zSWdZVtXT7E", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", rating: 8.6, duration: "169 dk", genre: "Bilim Kurgu" },
  { id: 10, title: "Başlangıç (Inception)", desc: "Rüya hırsızı Cobb, bu sefer bir fikri çalmak yerine, bir fikri zihne yerleştirmek (inception) zorundadır.", trailer: "YoHD9XEInc0", img: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", backdrop: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", rating: 8.8, duration: "148 dk", genre: "Bilim Kurgu" },
  { id: 11, title: "Hızlı ve Öfkeli 10", desc: "Dom Toretto ve ailesi, geçmişten gelen ve intikam yemini etmiş tehlikeli bir düşmanla karşı karşıyadır.", trailer: "eoOaKN4qCKw", img: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", backdrop: "https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4hDB5.jpg", rating: 6.8, duration: "141 dk", genre: "Aksiyon" },
  { id: 12, title: "Avengers: Endgame", desc: "Thanos'un evrenin yarısını yok etmesinin ardından kalan Avengers üyeleri, her şeyi geri getirmek için son bir şans dener.", trailer: "TcMBFSGVi1c", img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg", rating: 8.4, duration: "181 dk", genre: "Süper Kahraman" },
  { id: 13, title: "Para Avcısı", desc: "Jordan Belfort'un Wall Street'teki yükselişi ve çöküşünü, lüks, uyuşturucu ve dolandırıcılık dolu hayatını anlatır.", trailer: "iszwuX1AK6A", img: "https://tr.web.img4.acsta.net/pictures/14/01/24/10/55/409246.jpg", backdrop: "https://image.tmdb.org/t/p/original/cWUOv3H7YFwvKeaQhoAQTLLpoKB.jpg", rating: 8.2, duration: "180 dk", genre: "Biyografi" },
  { id: 14, title: "Dune: Çöl Gezegeni", desc: "Paul Atreides, evrenin en değerli kaynağına sahip olan tehlikeli Arrakis gezegenine gitmek ve kaderini gerçekleştirmek zorundadır.", trailer: "n9xhJrPXop4", img: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyLXEnNcneWdlGufw.jpg", backdrop: "https://image.tmdb.org/t/p/original/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg", rating: 8.1, duration: "155 dk", genre: "Bilim Kurgu" },
  { id: 15, title: "Matrix", desc: "Bir bilgisayar korsanı, yaşadığı dünyanın aslında bir simülasyon olduğunu keşfeder ve insanlığı kurtarmak için savaşa katılır.", trailer: "vKQi3bBA1y8", img: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdrop: "https://image.tmdb.org/t/p/original/l4QHerTSbMI7qgvasqxP36m0Tm1.jpg", rating: 8.7, duration: "136 dk", genre: "Bilim Kurgu" },
  { id: 16, title: "Deadpool 3", desc: "Deadpool ve Wolverine, çoklu evrenin sınırlarını zorlayan çılgın bir macerada bir araya geliyor.", trailer: "uJMCNJP2ipI", img: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg", backdrop: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg", rating: null, duration: "Yakında", genre: "Aksiyon/Komedi" },
  { id: 17, title: "Gladiator 2", desc: "Maximus'un ölümünden yıllar sonra, Lucius'un hikayesi ve Roma İmparatorluğu'ndaki mücadelesi anlatılıyor.", trailer: "4rgYUipGJNo", img: "https://i.ytimg.com/vi/2Hb4LvHd8To/maxresdefault.jpg", backdrop: "https://image.tmdb.org/t/p/original/Ar2h871rHiwIvZeWGGK9c18eGvfe.jpg", rating: null, duration: "Yakında", genre: "Tarih/Aksiyon" },
  { id: 18, title: "Mufasa: Aslan Kral", desc: "Simba'nın babası Mufasa'nın geçmişi ve Scar ile olan ilişkisinin kökenleri bu destansı filmde anlatılıyor.", trailer: "o17MF9vnabg", img: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", backdrop: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", rating: null, duration: "Yakında", genre: "Animasyon" },
  { id: 19, title: "Joker: İkili Delilik", desc: "Arthur Fleck, Arkham Akıl Hastanesi'nde Harley Quinn ile tanışır ve ikili tehlikeli bir yolculuğa çıkar.", trailer: "_OKAwz2MsJs", img: "https://images.justwatch.com/poster/321433801/s718/joker-2.jpg", backdrop: "https://image.tmdb.org/t/p/original/b9UCfDzwiWw7mIFsIQR9ZJU33CP.jpg", rating: null, duration: "Yakında", genre: "Dram/Müzikal" },
  { id: 20, title: "Mission Impossible 8", desc: "Ethan Hunt ve ekibi, dünyayı tehdit eden yeni ve korkunç bir silahın peşindeki son görevlerine çıkıyor.", trailer: "NOhDyUmT9z0", img: "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg", backdrop: "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg", rating: null, duration: "Yakında", genre: "Aksiyon" }
];

// SİNEMA VE SAAT HAVUZU
const CINEMAS = ["Paribu Cineverse Kanyon", "Akasya IMAX", "Zorlu PSM", "Cevahir", "City's Nişantaşı", "Torun Center", "Atlas 1948", "Capitol", "Emaar Square", "Marmara Forum", "Optimum", "Hilltown", "Palladium", "Watergarden", "Vadi İstanbul", "İstinyePark", "Özdilek", "Trump Towers", "Profilo", "Grand Pera"];
const TIMES = ["11:00", "13:30", "16:15", "19:00", "21:45", "23:00"];

// SALON TİPLERİ
const SALON_TYPES = [
  { id: 'salon1', name: 'SALON 1 (Gold)', cap: 80, price: 250, student: 125, gazi: 0, desc: 'Geniş Koltuk, Orta Salon' },
  { id: 'salon2', name: 'SALON 2 (Halk)', cap: 120, price: 150, student: 75, gazi: 0, desc: 'Ekonomik, Büyük Salon' },
  { id: 'salon3', name: 'SALON 3 (VIP)', cap: 40, price: 500, student: 250, gazi: 500, desc: 'Lüks Deri Koltuk & Love Seat' },
];

// --- HASH FONKSİYONU (SABİT RASTGELELİK İÇİN) ---
const stringToHash = (string) => {
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const ContentDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const activeMovie = useMemo(() => MOVIE_DB.find(m => m.id === parseInt(id)) || MOVIE_DB[0], [id]);
  const isMovie = type === 'movie'; 

  // --- STATE ---
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const { isOpen: isTrailerOpen, onOpen: onTrailerOpen, onClose: onTrailerClose } = useDisclosure(); 
  const { isOpen: isPassOpen, onOpen: onOpenPass, onClose: onClosePass } = useDisclosure(); 

  const [step, setStep] = useState(1);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  const [activeSalon, setActiveSalon] = useState(SALON_TYPES[0]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]); 
  
  const [ticketType, setTicketType] = useState("tam");
  const [addMenu, setAddMenu] = useState(false); 
  const [password, setPassword] = useState("");
  const [userBalance, setUserBalance] = useState(0); // Bakiye State'i

  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([
    { user: "Ahmet Y.", text: "Son sahne inanılmazdı!" },
    { user: "Merve K.", text: "Beklediğimden daha iyiydi." },
    { user: "Canan T.", text: "Görsel efektler harika." },
    { user: "Mehmet S.", text: "Oyunculuklar çok başarılı." }
  ]);

  // Sayfa açılışında bakiyeyi çek
  useEffect(() => {
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || "0");
    setUserBalance(currentBalance);
  }, []);

  // --- TÜKENDİ KONTROLÜ (BUGÜNE ÖZEL SABİT) ---
  const isCinemaSoldOut = (cinemaName) => {
      const todayStr = new Date().toDateString();
      const seed = todayStr + activeMovie.id + cinemaName;
      const hash = stringToHash(seed);
      return (hash % 100) < 15; 
  };

  // --- 1. ADIM: KOLTUK SİMÜLASYONU (SABİT RASTGELE) ---
  useEffect(() => {
    if (step === 1 && selectedCinema && selectedTime) {
      const key = `occ_${activeMovie.id}_${selectedCinema}_${activeSalon.id}_${selectedTime}`;
      let savedOccupied = JSON.parse(localStorage.getItem(key) || "[]");

      if (savedOccupied.length === 0) {
          const todayStr = new Date().toDateString();
          const seedBase = todayStr + activeMovie.id + selectedCinema + activeSalon.id + selectedTime;
          
          const rows = activeSalon.id === 'salon3' ? 5 : 8;
          const cols = activeSalon.id === 'salon2' ? 12 : 10;
          
          for(let r=0; r<rows; r++) {
              for(let c=0; c<cols; c++) {
                  const seatSeed = seedBase + `r${r}c${c}`;
                  const hash = stringToHash(seatSeed);
                  if ((hash % 100) < 40) {
                      savedOccupied.push(`${r}-${c}`);
                  }
              }
          }
      }
      setOccupiedSeats(savedOccupied);
    }
  }, [step, activeSalon, selectedCinema, selectedTime, activeMovie.id]);

  const refreshSeats = () => {
      toast({ title: "Veriler güncel.", status: "info", duration: 1000 });
  };

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  // --- HESAPLAMA ---
  const calculateTotal = () => {
    let price = activeSalon.price;
    if (ticketType === 'ogrenci') price = activeSalon.student;
    if (ticketType === 'gazi' && activeSalon.id !== 'salon3') price = activeSalon.gazi;

    let total = price * selectedSeats.length;
    if (addMenu) total += 75; 
    return total;
  };

  // --- ÖDEME FONKSİYONU (DÜZELTİLDİ) ---
  const handlePayment = () => {
    // 1. Şifre Kontrolü
    if (password !== "123456") {
      toast({ title: "Hatalı Şifre!", status: "error", position: "top" });
      return;
    }

    // 2. Bakiye Yeterlilik Kontrolü (YENİ)
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || "0");
    const totalAmount = calculateTotal();

    if (totalAmount > currentBalance) {
        toast({ 
            title: "Yetersiz Bakiye!", 
            description: `İşlem tutarı: ${totalAmount} TL, Mevcut Bakiye: ${currentBalance} TL`, 
            status: "error", 
            duration: 5000, 
            position: "top",
            isClosable: true
        });
        onClosePass(); // Şifre penceresini kapat
        return; // İşlemi durdur
    }
    
    // 3. İşlem Başarılı
    const ticket = {
      id: Date.now(),
      type: 'movie',
      movie: activeMovie.title,
      cinema: selectedCinema,
      salon: activeSalon.name,
      session: selectedTime,
      seats: selectedSeats,
      totalPrice: totalAmount,
      date: new Date().toLocaleDateString(),
      menu: addMenu
    };
    
    // Satın alınan koltukları kaydet
    const key = `occ_${activeMovie.id}_${selectedCinema}_${activeSalon.id}_${selectedTime}`;
    const newOccupied = [...occupiedSeats, ...selectedSeats];
    localStorage.setItem(key, JSON.stringify(newOccupied));

    // Bileti Profilime Ekle
    const oldTickets = JSON.parse(localStorage.getItem('myTickets') || "[]");
    localStorage.setItem('myTickets', JSON.stringify([...oldTickets, ticket]));
    
    // 4. Bakiyeyi Düş ve Güncelle
    const newBalance = currentBalance - totalAmount;
    localStorage.setItem('userBalance', newBalance);
    setUserBalance(newBalance);

    toast({ title: "Bilet Alındı!", description: `Kalan Bakiye: ${newBalance} TL`, status: "success", position: "top" });
    onClosePass();
    onClose();
    setStep(1);
    setSelectedSeats([]);
  };

  return (
    <Box bg="#050505" minH="100vh" color="white" fontFamily="'Segoe UI', sans-serif" pb={20}>
      
      {/* HERO SECTION */}
      <Box h="500px" position="relative" bgImage={`url(${activeMovie.backdrop})`} bgSize="cover" bgPosition="center">
        <Box position="absolute" top={0} left={0} w="100%" h="100%" bgGradient="linear(to-t, #050505, transparent)" />
        <Container maxW="1200px" h="100%" position="relative" zIndex={2} pt={20}>
            <Button leftIcon={<FaArrowLeft />} bg="whiteAlpha.300" color="white" onClick={() => navigate(-1)} _hover={{ bg: "whiteAlpha.500" }} mb={4}>
                Geri Dön
            </Button>

            <Flex mt={5} gap={8} align="flex-end" direction={{ base: 'column', md: 'row' }}>
                <Image src={activeMovie.img} w="220px" borderRadius="xl" boxShadow="0 0 50px rgba(0,0,255,0.3)" border="2px solid #3182ce"/>
                <Box mb={4}>
                    <Heading size="4xl" textShadow="0 0 20px black">{activeMovie.title}</Heading>
                    <HStack mt={4} spacing={4}>
                        <Badge colorScheme="blue" fontSize="lg">{activeMovie.genre}</Badge>
                        <Flex align="center"><Icon as={FaStar} color="yellow.400" mr={2}/> {activeMovie.rating}</Flex>
                        <Flex align="center"><Icon as={FaClock} mr={2}/> {activeMovie.duration}</Flex>
                    </HStack>
                    
                    <HStack mt={6} spacing={4}>
                        <Button size="lg" colorScheme="blue" leftIcon={<FaTicketAlt />} onClick={onOpen} boxShadow="0 0 20px rgba(49, 130, 206, 0.6)" isDisabled={activeMovie.duration === "Yakında"}>
                            {activeMovie.duration === "Yakında" ? "YAKINDA" : "BİLET AL"}
                        </Button>
                        <Button size="lg" variant="outline" colorScheme="blue" leftIcon={<FaPlay />} onClick={onTrailerOpen}>
                            FRAGMAN
                        </Button>
                    </HStack>
                </Box>
            </Flex>
        </Container>
      </Box>

      {/* İÇERİK */}
      <Container maxW="1200px" mt={10}>
          <Flex direction={{ base: "column", lg: "row" }} gap={10}>
              
              <Box flex="2">
                  <Heading size="md" mb={4} borderLeft="4px solid blue" pl={3} color="gray.200">Film Özeti</Heading>
                  <Text color="gray.400" fontSize="lg" lineHeight="1.8">{activeMovie.desc}</Text>

                  {/* Oyuncu Kadrosu */}
                  <Box mt={10}>
                      <Heading size="md" mb={4} color="gray.300">Oyuncu Kadrosu</Heading>
                      <HStack spacing={4} overflowX="auto" pb={2}>
                          {[1,2,3,4,5].map(i => (
                              <VStack key={i} bg="#1a1a1a" p={3} borderRadius="lg" minW="100px">
                                  <Avatar size="lg" name={`Oyuncu ${i}`} src={`https://i.pravatar.cc/150?img=${i + activeMovie.id}`} />
                                  <Text fontSize="sm" fontWeight="bold">Oyuncu {i}</Text>
                              </VStack>
                          ))}
                      </HStack>
                  </Box>
                  
                  {/* YORUMLAR */}
                  <Box mt={10} bg="#1a1a1a" p={6} borderRadius="xl">
                      <Heading size="md" mb={4}>Yorumlar</Heading>
                      <VStack align="stretch" spacing={3}>
                          {commentsList.map((c, i) => (
                              <Box key={i} p={3} bg="#222" borderRadius="md">
                                  <Text fontWeight="bold" fontSize="sm" color="blue.300">{c.user}</Text>
                                  <Text fontSize="sm" color="gray.400">{c.text}</Text>
                              </Box>
                          ))}
                          <Divider my={3}/>
                          <Textarea placeholder="Yorum yap..." bg="#111" border="none" value={comment} onChange={(e) => setComment(e.target.value)} />
                          <Button size="sm" colorScheme="blue" alignSelf="flex-end" onClick={() => {if(comment) {setCommentsList([...commentsList, {user:"Siz", text:comment}]); setComment("")}}}>Gönder</Button>
                      </VStack>
                  </Box>
              </Box>

              {/* Sağ: Aksiyon Kartı */}
              <Box flex="1">
                  <Box bg="#121212" p={6} borderRadius="xl" border="1px solid #333" position="sticky" top="100px">
                      <Heading size="md" mb={6} color="white">Bilet İşlemleri</Heading>
                      <VStack spacing={4}>
                          <Button w="full" h="60px" fontSize="xl" colorScheme="blue" leftIcon={<FaTicketAlt />} onClick={onOpen} isDisabled={activeMovie.duration === "Yakında"}>Bilet Al</Button>
                          <Button w="full" h="50px" variant="outline" colorScheme="blue" leftIcon={<FaPlay />} onClick={onTrailerOpen}>Fragmanı İzle</Button>
                      </VStack>
                      <Divider my={6} borderColor="gray.700" />
                      <VStack align="start" spacing={3} color="gray.400" fontSize="sm">
                          <Flex align="center"><Icon as={FaCheckCircle} color="green.500" mr={2}/> İptal Edilebilir</Flex>
                          <Flex align="center"><Icon as={FaCheckCircle} color="green.500" mr={2}/> Güvenli Ödeme</Flex>
                          <Flex align="center"><Icon as={FaCheckCircle} color="green.500" mr={2}/> QR Kod Giriş</Flex>
                      </VStack>
                  </Box>
              </Box>
          </Flex>
      </Container>

      {/* --- FRAGMAN MODAL --- */}
      <Modal isOpen={isTrailerOpen} onClose={onTrailerClose} size="5xl" isCentered>
        <ModalOverlay bg="blackAlpha.900"/>
        <ModalContent bg="black">
            <ModalCloseButton color="white" zIndex={99}/>
            <ModalBody p={0}>
                <Box position="relative" pb="56.25%" h="0">
                    <iframe style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} src={`https://www.youtube.com/embed/${activeMovie.trailer}?autoplay=1`} title="Trailer" allowFullScreen frameBorder="0"/>
                </Box>
            </ModalBody>
        </ModalContent>
      </Modal>

      {/* --- YENİ BİLET ALMA SİSTEMİ (BOMBASTİK) --- */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="#151515" color="white" border="1px solid #2B6CB0">
            <ModalHeader bg="blue.900" borderBottom="1px solid #333">
                {step === 1 && "Adım 1: Salon, Sinema ve Koltuk Seçimi"}
                {step === 2 && "Adım 2: Ödeme ve Menü"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
                
                {/* ADIM 1: HER ŞEY TEK EKRANDA */}
                {step === 1 && (
                    <Box>
                        {/* 1. Sekmeler (Salonlar) */}
                        <Tabs variant="soft-rounded" colorScheme="blue" onChange={(idx) => { setActiveSalon(SALON_TYPES[idx]); setSelectedSeats([]); }}>
                            <TabList mb={6} justifyContent="center" bg="#111" p={2} borderRadius="full">
                                {SALON_TYPES.map(salon => (
                                    <Tab key={salon.id} color="gray.400" _selected={{ color: 'white', bg: 'blue.600' }} px={6}>
                                        {salon.name}
                                    </Tab>
                                ))}
                            </TabList>

                            {/* 2. Filtreler (Mavi) */}
                            <Flex gap={4} mb={8} justify="center">
                                <Select placeholder="Sinema Seçiniz" w="300px" bg="blue.900" borderColor="blue.500" onChange={(e) => setSelectedCinema(e.target.value)}>
                                    {CINEMAS.map(c => {
                                        const soldOut = isCinemaSoldOut(c);
                                        return <option key={c} value={c} disabled={soldOut} style={{color: soldOut ? 'red' : 'black'}}>{c} {soldOut ? '(TÜKENDİ)' : ''}</option>
                                    })}
                                </Select>
                                <Select placeholder="Seans Saati" w="200px" bg="blue.900" borderColor="blue.500" onChange={(e) => setSelectedTime(e.target.value)}>
                                    {TIMES.map(t => <option key={t} value={t} style={{color:'black'}}>{t}</option>)}
                                </Select>
                            </Flex>

                            {/* 3. Koltuk Alanı */}
                            <TabPanels>
                                {SALON_TYPES.map(salon => (
                                    <TabPanel key={salon.id} p={0}>
                                        {(!selectedCinema || !selectedTime) ? (
                                            <Box h="300px" display="flex" alignItems="center" justifyContent="center" border="2px dashed gray" borderRadius="xl">
                                                <Text color="gray.500">Lütfen önce Sinema ve Saat seçiniz.</Text>
                                            </Box>
                                        ) : (
                                            <Box position="relative">
                                                <Tooltip label="Verileri Güncelle">
                                                    <IconButton icon={<FaSyncAlt/>} position="absolute" right={0} top={0} onClick={refreshSeats} colorScheme="blue" size="sm" variant="ghost"/>
                                                </Tooltip>

                                                <Text textAlign="center" mb={4} color="blue.300">{salon.desc}</Text>
                                                <Box w="70%" h="10px" bg="white" mx="auto" mb={10} borderRadius="full" boxShadow="0 0 20px white"/>
                                                
                                                {/* Koltuk Grid */}
                                                <VStack spacing={2}>
                                                    {Array.from({ length: salon.id === 'salon3' ? 5 : 8 }).map((_, r) => (
                                                        <HStack key={r} spacing={2} justify="center">
                                                            {Array.from({ length: salon.id === 'salon2' ? 12 : 10 }).map((_, c) => {
                                                                const seatId = `${r}-${c}`;
                                                                const isOccupied = occupiedSeats.includes(seatId);
                                                                const isSelected = selectedSeats.includes(seatId);
                                                                return (
                                                                    <Box 
                                                                        key={seatId} w="35px" h="35px" borderRadius="md"
                                                                        bg={isOccupied ? "red.600" : isSelected ? "green.500" : "gray.700"}
                                                                        cursor={isOccupied ? "not-allowed" : "pointer"}
                                                                        onClick={() => toggleSeat(seatId)}
                                                                        _hover={{ transform: !isOccupied && "scale(1.1)" }}
                                                                    >
                                                                        <Icon as={FaChair} w="full" h="full" p={1} color="blackAlpha.400"/>
                                                                    </Box>
                                                                )
                                                            })}
                                                        </HStack>
                                                    ))}
                                                </VStack>
                                            </Box>
                                        )}
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </Tabs>

                        <Flex justify="space-between" mt={8} align="center">
                            <Text>Seçilen: {selectedSeats.length} Adet</Text>
                            <Button isDisabled={selectedSeats.length === 0} colorScheme="green" onClick={() => setStep(2)}>Ödemeye Geç</Button>
                        </Flex>
                    </Box>
                )}

                {/* ADIM 2: ÖDEME VE MENÜ */}
                {step === 2 && (
                    <Box>
                        <SimpleGrid columns={2} spacing={10}>
                            <Box>
                                <Heading size="md" mb={4} color="blue.400">Bilet Detayları</Heading>
                                <VStack align="start" spacing={3}>
                                    <Text><Icon as={FaMapMarkerAlt} mr={2}/> {selectedCinema}</Text>
                                    <Text><Icon as={FaClock} mr={2}/> {selectedTime} - {activeSalon.name}</Text>
                                    <Text><Icon as={FaChair} mr={2}/> Koltuklar: {selectedSeats.join(", ")}</Text>
                                </VStack>
                                <Divider my={6} />
                                <RadioGroup onChange={setTicketType} value={ticketType}>
                                    <Stack direction="column">
                                        <Radio value="tam">Tam ({activeSalon.price} TL)</Radio>
                                        <Radio value="ogrenci">Öğrenci ({activeSalon.student} TL)</Radio>
                                        {activeSalon.id !== 'salon3' && <Radio value="gazi">Gazi / Emekli (Ücretsiz)</Radio>}
                                    </Stack>
                                </RadioGroup>
                            </Box>

                            <Box bg="#222" p={6} borderRadius="xl">
                                <Heading size="md" mb={4} color="orange.300">Ekstralar</Heading>
                                <Box bg="#1a1a1a" p={4} borderRadius="lg" border="1px solid" borderColor="orange.500" mb={6}>
                                    <Flex justify="space-between" align="center">
                                        <HStack>
                                            <Icon as={FaHamburger} color="orange.400" boxSize={6}/>
                                            <Box>
                                                <Text fontWeight="bold">🍿🥤 Sinema Keyfi Menüsü</Text>
                                                <Text fontSize="xs" color="gray.400">Büyük Mısır + 2 İçecek</Text>
                                            </Box>
                                        </HStack>
                                        <Checkbox colorScheme="orange" isChecked={addMenu} onChange={(e) => setAddMenu(e.target.checked)}>+75 TL</Checkbox>
                                    </Flex>
                                </Box>

                                <Flex justify="space-between" fontSize="2xl" fontWeight="bold" mt={10}>
                                    <Text>TOPLAM</Text>
                                    <Text color="green.400">{calculateTotal()} TL</Text>
                                </Flex>
                                <Button w="full" colorScheme="green" size="lg" mt={6} onClick={onOpenPass}>ÖDEMEYİ TAMAMLA</Button>
                            </Box>
                        </SimpleGrid>
                        <Button variant="ghost" mt={4} onClick={() => setStep(1)}>Geri</Button>
                    </Box>
                )}
            </ModalBody>
        </ModalContent>
      </Modal>

      {/* ŞİFRE MODALI */}
      <Modal isOpen={isPassOpen} onClose={onClosePass} isCentered size="sm">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="#222" color="white" border="1px solid gray">
            <ModalHeader textAlign="center">Güvenlik Onayı</ModalHeader>
            <ModalBody p={6} textAlign="center">
                <Icon as={FaLock} boxSize={10} color="blue.400" mb={4} />
                <Text mb={4} color="gray.400">Hesabınızdan <b>{calculateTotal()} TL</b> çekilecektir. Onaylamak için şifrenizi (123456) girin.</Text>
                <Input type="password" placeholder="Şifre" textAlign="center" mb={4} value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button w="full" colorScheme="green" onClick={handlePayment}>ONAYLA</Button>
            </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default ContentDetailPage;   