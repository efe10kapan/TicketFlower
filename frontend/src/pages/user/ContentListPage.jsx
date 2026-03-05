import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Heading, Text, Button, Image, Flex, Grid, Badge, HStack, Icon, 
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure, AspectRatio, Tabs, TabList, Tab, TabPanels, TabPanel 
} from '@chakra-ui/react';
import { FaCalendarAlt, FaCommentDots, FaPlay, FaTicketAlt, FaFilter, FaBan } from 'react-icons/fa';

// --- SABİT FİLM VERİTABANI (RESİMLER GÜNCELLENDİ) ---
const MOVIE_DB = [
  // 15 VİZYONDAKİLER (Active)
  { id: 1, type: 'movie', status: 'active', title: "Oppenheimer", genre: "Biyografi", rating: 8.9, duration: "180 dk", image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", age: "13+", tags: ["IMAX", "Altyazı"], comments: 1420, trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg" },
  { id: 2, type: 'movie', status: 'active', title: "Barbie", genre: "Komedi", rating: 7.2, duration: "114 dk", image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", age: "Genel", tags: ["Dublaj", "2D"], comments: 980, trailerUrl: "https://www.youtube.com/embed/pBk4NYhWNMM" },
  
  // RESMİ DÜZELTİLDİ: John Wick 4
  { id: 3, type: 'movie', status: 'active', title: "John Wick 4", genre: "Aksiyon", rating: 8.0, duration: "169 dk", image: "https://tse1.mm.bing.net/th/id/OIP.z4ODeP4zFI4k6jahRWm2gwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3", age: "18+", tags: ["4DX", "Altyazı"], comments: 2100, trailerUrl: "https://www.youtube.com/embed/yjRHZEUamCc" },
  
  { id: 4, type: 'movie', status: 'active', title: "Avatar: Suyun Yolu", genre: "Bilim Kurgu", rating: 7.8, duration: "192 dk", image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", age: "Genel", tags: ["3D", "IMAX"], comments: 3400, trailerUrl: "https://www.youtube.com/embed/d9MyqW3xTuE" },
  
  // RESMİ DÜZELTİLDİ: Top Gun Maverick
  { id: 5, type: 'movie', status: 'active', title: "Top Gun: Maverick", genre: "Aksiyon", rating: 8.3, duration: "130 dk", image: "https://wallpapers.com/images/hd/top-gun-maverick-poster-v145qr6pv3y04efi.jpg", age: "13+", tags: ["IMAX", "Dublaj"], comments: 1250, trailerUrl: "https://www.youtube.com/embed/qSqVVswa420" },
  
  { id: 6, type: 'movie', status: 'active', title: "Joker", genre: "Suç/Dram", rating: 8.4, duration: "122 dk", image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", age: "18+", tags: ["2D", "Altyazı"], comments: 1800, trailerUrl: "https://www.youtube.com/embed/zAGVQLHvwOY" },
  { id: 7, type: 'movie', status: 'active', title: "Örümcek-Adam: Evrene Geçiş", genre: "Animasyon", rating: 8.7, duration: "140 dk", image: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", age: "Genel", tags: ["Dublaj", "3D"], comments: 950, trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg" },
  { id: 8, type: 'movie', status: 'active', title: "The Batman", genre: "Suç", rating: 7.9, duration: "176 dk", image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", age: "13+", tags: ["ATMOS", "Altyazı"], comments: 1100, trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4" },
  { id: 9, type: 'movie', status: 'active', title: "Yıldızlararası", genre: "Bilim Kurgu", rating: 8.6, duration: "169 dk", image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", age: "Genel", tags: ["IMAX", "Altyazı"], comments: 4500, trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E" },
  { id: 10, type: 'movie', status: 'active', title: "Başlangıç (Inception)", genre: "Bilim Kurgu", rating: 8.8, duration: "148 dk", image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", age: "13+", tags: ["2D", "Altyazı"], comments: 3200, trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0" },
  { id: 11, type: 'movie', status: 'active', title: "Hızlı ve Öfkeli 10", genre: "Aksiyon", rating: 6.8, duration: "141 dk", image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", age: "13+", tags: ["4DX", "Dublaj"], comments: 800, trailerUrl: "https://www.youtube.com/embed/eoOaKN4qCKw" },
  { id: 12, type: 'movie', status: 'active', title: "Avengers: Endgame", genre: "Süper Kahraman", rating: 8.4, duration: "181 dk", image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", age: "Genel", tags: ["IMAX", "3D"], comments: 5000, trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c" },
  
  // RESMİ DÜZELTİLDİ: Para Avcısı
  { id: 13, type: 'movie', status: 'active', title: "Para Avcısı", genre: "Biyografi", rating: 8.2, duration: "180 dk", image: "https://tr.web.img4.acsta.net/pictures/14/01/24/10/55/409246.jpg", age: "18+", tags: ["2D", "Altyazı"], comments: 1600, trailerUrl: "https://www.youtube.com/embed/iszwuX1AK6A" },
  
  // RESMİ DÜZELTİLDİ: Dune
  { id: 14, type: 'movie', status: 'active', title: "Dune: Çöl Gezegeni", genre: "Bilim Kurgu", rating: 8.1, duration: "155 dk", image: "https://preview.redd.it/dune-part-2-fan-art-poster-by-beenum-editz-v0-5r4cp9ehtkob1.jpg?auto=webp&s=6d62ef8fe13a644d9681779d95a43e8fef15e071", age: "13+", tags: ["IMAX", "Altyazı"], comments: 1400, trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4" },
  
  { id: 15, type: 'movie', status: 'active', title: "Matrix", genre: "Bilim Kurgu", rating: 8.7, duration: "136 dk", image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", age: "13+", tags: ["2D", "Altyazı"], comments: 4100, trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8" },

  // 5 YAKINDA GELECEKLER
  { id: 16, type: 'movie', status: 'coming', title: "Deadpool 3", genre: "Aksiyon/Komedi", rating: null, duration: "Yakında", image: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg", age: "18+", tags: ["Yakında"], comments: 0, trailerUrl: "https://www.youtube.com/embed/uJMCNJP2ipI" },
  { id: 17, type: 'movie', status: 'coming', title: "Gladiator 2", genre: "Tarih/Aksiyon", rating: null, duration: "Yakında", image: "https://i.ytimg.com/vi/2Hb4LvHd8To/maxresdefault.jpg", age: "16+", tags: ["Yakında"], comments: 0, trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo" },
  { id: 18, type: 'movie', status: 'coming', title: "Mufasa: Aslan Kral", genre: "Animasyon", rating: null, duration: "Yakında", image: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", age: "Genel", tags: ["Yakında"], comments: 0, trailerUrl: "https://www.youtube.com/embed/o17MF9vnabg" },
  { id: 19, type: 'movie', status: 'coming', title: "Joker: İkili Delilik", genre: "Dram/Müzikal", rating: null, duration: "Yakında", image: "https://images.justwatch.com/poster/321433801/s718/joker-2.jpg", age: "18+", tags: ["Yakında"], comments: 0, trailerUrl: "https://www.youtube.com/embed/_OKAwz2MsJs" },
  { id: 20, type: 'movie', status: 'coming', title: "Mission Impossible 8", genre: "Aksiyon", rating: null, duration: "Yakında", image: "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg", age: "13+", tags: ["Yakında"], comments: 0, trailerUrl: "https://www.youtube.com/embed/NOhDyUmT9z0" },
];

const ContentListPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const activeType = type || 'movie';
  const isTheater = activeType === 'theater';
  const themeColor = isTheater ? 'red' : 'blue';
  const pageTitle = isTheater ? 'Sahnedeki Oyunlar' : 'Vizyondaki Filmler';
  
  const heroImage = isTheater 
    ? "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=80" 
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";

  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedGenre, setSelectedGenre] = useState('Hepsi');
  const [dates, setDates] = useState([]);
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const [soldOutMovieId, setSoldOutMovieId] = useState(null); // HER GÜN 1 FİLM TÜKENSİN
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- 1. AKILLI TAKVİM OLUŞTURUCU ---
  useEffect(() => {
    const tempDates = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      tempDates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        dayNumber: i
      });
    }
    setDates(tempDates);

    // --- RANDOM TÜKENDİ MANTIĞI (BUGÜNE ÖZEL SABİT) ---
    if (!isTheater) {
       // Sadece Sinema Filmlerinde (Active olanlar)
       const activeMovies = MOVIE_DB.filter(m => m.status === 'active');
       const dateString = today.toDateString(); // Örn: "Fri Dec 26 2025" (Gün boyunca değişmez)
       
       // String'i sayıya çevir (Hashleme)
       let totalCharCodes = 0;
       for (let i = 0; i < dateString.length; i++) {
          totalCharCodes += dateString.charCodeAt(i);
       }
       
       // Mod alarak o güne özel bir index belirle
       const dailyIndex = totalCharCodes % activeMovies.length;
       setSoldOutMovieId(activeMovies[dailyIndex].id);
    }

    setTimeout(() => {
      const activeEl = document.getElementById(`date-${today.getDate()}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }, [isTheater]);

  // --- 2. FİLTRELEME (TAB'A GÖRE) ---
  const getContentByTab = (status) => {
    if (isTheater) {
      return [
        { id: 101, type: 'theater', title: "Hamlet", genre: "Trajedi", rating: 9.5, duration: "150 dk", image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Hamlet_poster.jpg", age: "13+", tags: ["Tek Perde"], comments: 340, trailerUrl: "https://www.youtube.com/embed/S70t22Z22hM" },
        { id: 102, type: 'theater', title: "Amadeus", genre: "Dram", rating: 9.8, duration: "160 dk", image: "https://upload.wikimedia.org/wikipedia/en/2/23/Amadeus_film.jpg", age: "Genel", tags: ["Müzikal"], comments: 1200, trailerUrl: "https://www.youtube.com/embed/yI4Jt6yT3KQ" },
        { id: 103, type: 'theater', title: "Cimri", genre: "Komedi", rating: 9.0, duration: "130 dk", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Moliere_-_L%27Avare_-_1669.jpg/300px-Moliere_-_L%27Avare_-_1669.jpg", age: "Genel", tags: ["Klasik"], comments: 800, trailerUrl: "" }
      ].filter(item => selectedGenre === 'Hepsi' || item.genre === selectedGenre);
    } 
    
    return MOVIE_DB.filter(item => {
      const statusMatch = item.status === status; // active veya coming
      const genreMatch = selectedGenre === 'Hepsi' || item.genre.includes(selectedGenre);
      return statusMatch && genreMatch;
    });
  };

  const handleOpenTrailer = (url) => {
    setSelectedTrailer(url);
    onOpen();
  };

  return (
    <Box minH="100vh" bg="#121212" color="white" pb={10}>
      
      {/* HERO BANNER */}
      <Box 
        h="250px"
        bgImage={`linear-gradient(to bottom, rgba(18,18,18,0.3), #121212), url(${heroImage})`}
        bgSize="cover" bgPosition="center"
        display="flex" alignItems="flex-end" pb={6} px={{ base: 4, md: 8 }} mb={6}
      >
        <Box>
          <Badge colorScheme={themeColor} fontSize="md" mb={2} px={2} borderRadius="md">
            {isTheater ? 'TİYATRO & SAHNE' : 'SİNEMA & VİZYON'}
          </Badge>
          <Heading size="2xl" textShadow="0 4px 10px black">{pageTitle}</Heading>
        </Box>
      </Box>

      <Box px={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
        
        {/* FİLTRELER */}
        <Flex direction={{ base: "column", md: "row" }} gap={6} mb={10}>
          {/* Tarih Şeridi */}
          <Box flex="1" bg="#1a1a1a" p={3} borderRadius="xl" boxShadow="dark-lg" overflow="hidden">
            <Text fontSize="sm" color="gray.400" mb={2} display="flex" alignItems="center" gap={2}>
               <Icon as={FaCalendarAlt} /> Seans Tarihi (Bu Ay)
            </Text>
            <HStack spacing={2} overflowX="auto" pb={2} css={{ '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { background: isTheater ? '#E53E3E' : '#3182ce', borderRadius: '4px' } }}>
              {dates.map((date) => (
                <Box
                  key={date.dayNumber}
                  id={`date-${date.dayNumber}`}
                  minW="60px" h="75px"
                  bg={selectedDate === date.dayNumber ? (isTheater ? 'red.600' : 'blue.600') : '#2d2d2d'}
                  borderRadius="lg"
                  display="flex" flexDirection="column" alignItems="center" justifyContent="center"
                  cursor="pointer" transition="all 0.2s"
                  _hover={{ bg: selectedDate === date.dayNumber ? '' : '#3d3d3d', transform: 'translateY(-2px)' }}
                  onClick={() => setSelectedDate(date.dayNumber)}
                >
                  <Text fontSize="xs" color="gray.300">{date.dayName}</Text>
                  <Text fontSize="lg" fontWeight="bold">{date.dayNumber}</Text>
                </Box>
              ))}
            </HStack>
          </Box>

          {/* Tür Seçimi */}
          <Box w={{ base: "100%", md: "300px" }} bg="#1a1a1a" p={3} borderRadius="xl" boxShadow="dark-lg">
            <Text fontSize="sm" color="gray.400" mb={2} display="flex" alignItems="center" gap={2}>
               <Icon as={FaFilter} /> Tür Filtrele
            </Text>
            <Flex wrap="wrap" gap={2}>
              {['Hepsi', 'Aksiyon', 'Dram', 'Komedi', 'Korku'].map(g => (
                <Button
                  key={g} size="xs" borderRadius="full"
                  variant={selectedGenre === g ? 'solid' : 'outline'}
                  colorScheme={themeColor}
                  onClick={() => setSelectedGenre(g)}
                  flexGrow={1}
                >
                  {g}
                </Button>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* --- SEKME YAPISI (VİZYONDAKİLER / YAKINDA) --- */}
        <Tabs variant="soft-rounded" colorScheme={themeColor} isLazy>
            <TabList mb={6} bg="#1a1a1a" p={2} borderRadius="full" display="inline-flex">
                <Tab color="gray.400" _selected={{ color: 'white', bg: isTheater ? 'red.600' : 'blue.600' }} px={6}>
                    {isTheater ? 'SAHNEDEKİLER' : 'VİZYONDAKİLER (15)'}
                </Tab>
                {!isTheater && (
                    <Tab color="gray.400" _selected={{ color: 'white', bg: 'blue.600' }} px={6}>
                        YAKINDA GELECEKLER (5)
                    </Tab>
                )}
            </TabList>

            <TabPanels>
                {/* 1. SEKME: VİZYONDAKİLER (ACTIVE) */}
                <TabPanel p={0}>
                    <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={6}>
                        {getContentByTab('active').map((item) => {
                          // BU FİLM O GÜN TÜKENDİ Mİ?
                          const isSoldOut = item.id === soldOutMovieId;
                          
                          return (
                            <Box 
                              key={item.id} 
                              bg="#1e1e1e" borderRadius="xl" overflow="hidden" 
                              position="relative" transition="all 0.3s"
                              display="flex" flexDirection="column"
                              _hover={{ transform: isSoldOut ? 'none' : 'translateY(-5px)', boxShadow: isSoldOut ? 'none' : '0 15px 25px rgba(0,0,0,0.4)' }}
                              role="group"
                              opacity={isSoldOut ? 0.6 : 1}
                              filter={isSoldOut ? "grayscale(100%)" : "none"}
                            >
                              {/* --- RESİM ALANI --- */}
                              <Box position="relative">
                                  <AspectRatio ratio={2 / 3} w="100%">
                                    <Image src={item.image} alt={item.title} objectFit="cover" />
                                  </AspectRatio>
                                  
                                  {/* TÜKENDİ İŞARETİ */}
                                  {isSoldOut && (
                                    <Flex 
                                      position="absolute" top="0" left="0" w="100%" h="100%" 
                                      bg="rgba(0,0,0,0.7)" zIndex="2" 
                                      justify="center" align="center" direction="column"
                                    >
                                      <Icon as={FaBan} color="red.500" w={16} h={16} mb={2} />
                                      <Text 
                                        color="red.500" fontSize="2xl" fontWeight="bold" 
                                        transform="rotate(-15deg)" border="4px solid" borderColor="red.500" 
                                        p={2} borderRadius="md" letterSpacing="widest"
                                      >
                                        TÜKENDİ
                                      </Text>
                                    </Flex>
                                  )}
                                  
                                  {!isSoldOut && (
                                    <Badge 
                                      position="absolute" top={2} right={2} 
                                      bg={item.age === '18+' ? 'red.600' : (item.age === 'Genel' ? 'green.500' : 'orange.500')} 
                                      color="white" fontSize="xs" borderRadius="md" px={2}
                                      boxShadow="0 2px 5px rgba(0,0,0,0.5)"
                                    >
                                      {item.age}
                                    </Badge>
                                  )}

                                  <HStack 
                                    position="absolute" bottom="0" left="0" 
                                    p={2} w="100%" 
                                    bg="linear-gradient(to top, rgba(0,0,0,0.9), transparent)"
                                  >
                                    {item.tags.map((tag, i) => (
                                      <Badge key={i} colorScheme="whiteAlpha" variant="solid" fontSize="10px" px={1}>
                                        {tag}
                                      </Badge>
                                    ))}
                                  </HStack>
                                  
                                  {/* Fragman Butonu (Tükendiyse gösterme) */}
                                  {!isSoldOut && (
                                    <Flex 
                                      position="absolute" top="0" left="0" w="100%" h="100%"
                                      justify="center" align="center"
                                      opacity={0} transition="0.3s"
                                      bg="rgba(0,0,0,0.4)"
                                      _groupHover={{ opacity: 1 }}
                                      onClick={(e) => { e.stopPropagation(); handleOpenTrailer(item.trailerUrl); }}
                                      cursor="pointer"
                                    >
                                      <Icon as={FaPlay} w={12} h={12} color="white" filter="drop-shadow(0 0 10px rgba(0,0,0,0.5))" />
                                    </Flex>
                                  )}
                              </Box>

                              {/* --- BİLGİ ALANI --- */}
                              <Box p={4} flex="1" display="flex" flexDirection="column">
                                <Heading size="sm" mb={1} noOfLines={1} color="white">{item.title}</Heading>
                                <Text fontSize="xs" color="gray.500" mb={3}>{item.genre} • {item.rating ? `${item.rating}/10` : 'Puan Yok'}</Text>

                                <Flex align="center" gap={2} fontSize="xs" color="gray.400" mb={4}>
                                    <Icon as={FaCommentDots} color={`${themeColor}.500`} /> {item.comments} Yorum
                                </Flex>
                                
                                <Button 
                                  mt="auto" w="100%" size="sm" 
                                  colorScheme={isSoldOut ? 'gray' : themeColor} 
                                  leftIcon={!isSoldOut ? <FaTicketAlt /> : <FaBan />}
                                  onClick={() => !isSoldOut && navigate(`/app/content/${activeType}/detail/${item.id}`)}
                                  _hover={!isSoldOut ? { transform: 'scale(1.02)' } : {}}
                                  isDisabled={isSoldOut}
                                  variant={isSoldOut ? 'outline' : 'solid'}
                                >
                                  {isSoldOut ? 'Biletler Tükendi' : 'Bilet Al'}
                                </Button>
                              </Box>
                            </Box>
                          );
                        })}
                    </Grid>
                </TabPanel>

                {/* 2. SEKME: YAKINDA GELECEKLER (COMING) - Sadece Sinema */}
                {!isTheater && (
                    <TabPanel p={0}>
                        <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={6}>
                            {getContentByTab('coming').map((item) => (
                                <Box 
                                  key={item.id} 
                                  bg="#1e1e1e" borderRadius="xl" overflow="hidden" 
                                  position="relative" transition="all 0.3s" opacity={0.8}
                                  display="flex" flexDirection="column"
                                  _hover={{ transform: 'translateY(-5px)', opacity: 1, boxShadow: '0 15px 25px rgba(0,0,0,0.4)' }}
                                  role="group"
                                >
                                  <Box position="relative">
                                      <AspectRatio ratio={2 / 3} w="100%">
                                        <Image src={item.image} alt={item.title} objectFit="cover" filter="grayscale(80%)" _groupHover={{ filter: "grayscale(0%)" }} transition="0.3s" />
                                      </AspectRatio>
                                      
                                      <Badge position="absolute" top={2} right={2} colorScheme="orange" fontSize="xs" px={2}>YAKINDA</Badge>

                                      <Flex 
                                        position="absolute" top="0" left="0" w="100%" h="100%"
                                        justify="center" align="center"
                                        opacity={0} transition="0.3s"
                                        bg="rgba(0,0,0,0.4)"
                                        _groupHover={{ opacity: 1 }}
                                        onClick={(e) => { e.stopPropagation(); handleOpenTrailer(item.trailerUrl); }}
                                        cursor="pointer"
                                      >
                                        <Icon as={FaPlay} w={12} h={12} color="white" />
                                      </Flex>
                                  </Box>

                                  <Box p={4} flex="1" display="flex" flexDirection="column">
                                    <Heading size="sm" mb={1} noOfLines={1} color="white">{item.title}</Heading>
                                    <Text fontSize="xs" color="gray.500" mb={3}>{item.genre}</Text>
                                    
                                    <Button 
                                      mt="auto" w="100%" size="sm" variant="outline" colorScheme="gray" 
                                      leftIcon={<FaPlay />}
                                      onClick={() => handleOpenTrailer(item.trailerUrl)}
                                    >
                                      Fragman İzle
                                    </Button>
                                  </Box>
                                </Box>
                            ))}
                        </Grid>
                    </TabPanel>
                )}
            </TabPanels>
        </Tabs>

      </Box>

      {/* VIDEO MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0,0,0,0.8)" />
        <ModalContent bg="black">
          <ModalCloseButton zIndex={10} color="white" bg="rgba(0,0,0,0.5)" borderRadius="full" />
          <ModalBody p={0}>
            <AspectRatio ratio={16 / 9}>
              <iframe
                title="trailer"
                src={`${selectedTrailer}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default ContentListPage;