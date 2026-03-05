import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Flex, Heading, Text, Button, Image, Icon, 
  SimpleGrid, Badge, VStack, Select, Tooltip,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, 
  useDisclosure, HStack, Avatar, Divider, Card, CardBody, IconButton
} from '@chakra-ui/react';
import { 
  FaMapMarkerAlt, FaSearchLocation, 
  FaTheaterMasks, FaSearchPlus, FaUsers, FaHistory, FaStar
} from 'react-icons/fa';

// --- 1. SABİT VERİLER ---

const DISTRICTS = [
  "Kadıköy", "Beyoğlu", "Şişli", "Üsküdar", "Beşiktaş", "Ataşehir",
  "Sancaktepe", "Kartal", "Pendik", "Fatih", "Bahçelievler", "Bakırköy"
];

const GENRES = ["Dram", "Komedi", "Müzikal", "Trajedi", "Tirad", "Absürt", "Çocuk Oyunu", "Gerilim"];

// --- SENİN ÖZEL POSTER LİSTEN (KORUNDU) ---
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

// OYUN İSİMLERİ (SABİT)
const PLAY_TITLES = Object.keys(POSTER_MAP);

// --- OYUNCU HAVUZU (HOCALAR - KARIŞIK FOTOLAR) ---
// Senin istediğin gibi rastgele/doğal fotoğraflar
const ACTOR_POOL = [
  { name: "Haluk Bilginer", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Haluk_Bilginer_2014_%28cropped%29.jpg/220px-Haluk_Bilginer_2014_%28cropped%29.jpg" },
  { name: "Zerrin Tekindor", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Zerrin_Tekindor_2013.jpg/220px-Zerrin_Tekindor_2013.jpg" },
  { name: "Şener Şen", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/%C5%9Eener_%C5%9Een.jpg/220px-%C5%9Eener_%C5%9Een.jpg" },
  { name: "Genco Erkal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Genco_Erkal.jpg/220px-Genco_Erkal.jpg" },
  { name: "Demet Akbağ", img: "https://im.haberturk.com/2020/02/07/ver1581075530/2576288_810x458.jpg" },
  { name: "Rasim Öztekin", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Rasim_%C3%96ztekin.jpg/220px-Rasim_%C3%96ztekin.jpg" },
  { name: "Çolpan İlhan", img: "https://upload.wikimedia.org/wikipedia/tr/6/69/%C3%87olpan_%C4%B0lhan.jpg" },
  { name: "Münir Özkul", img: "https://upload.wikimedia.org/wikipedia/tr/a/a9/M%C3%BCnir_%C3%96zkul.jpg" },
  { name: "Adile Naşit", img: "https://upload.wikimedia.org/wikipedia/tr/0/0d/Adile_Na%C5%9Fit.jpg" },
  { name: "Ferhan Şensoy", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Ferhan_%C5%9Eensoy.jpg/220px-Ferhan_%C5%9Eensoy.jpg" }
];

// GEÇMİŞ OYUN İSİMLERİ (SABİT RANDOM İÇİN)
const HISTORY_POOL = [
  "Lüküs Hayat", "Cibali Karakolu", "Hisseli Harikalar", "Yedi Kocalı Hürmüz", 
  "Kanlı Nigar", "Keşanlı Ali", "Sersem Kocanın Kurnaz Karısı", "Rumuz Goncagül",
  "Fehim Paşa Konağı", "Paydos", "Buzlar Çözülmeden", "Vatan Kurtaran Şaban"
];

// --- YARDIMCI FONKSİYONLAR (SABİT RANDOM) ---
// Bu fonksiyonlar her çağrıldığında aynı ID için aynı sonucu üretir.
const getStableRandom = (seed, max) => {
  let hash = 0;
  const str = seed.toString();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash) % max;
};

// Oyun ID'sine göre sabit bir oyuncu kadrosu üretir
const getCastForPlay = (playId) => {
  const seed = playId * 1234;
  const actor1Idx = getStableRandom(seed, ACTOR_POOL.length);
  const actor2Idx = getStableRandom(seed + 1, ACTOR_POOL.length);
  const actor3Idx = getStableRandom(seed + 2, ACTOR_POOL.length);
  
  // Aynı kişi üst üste gelmesin diye basit kontrol
  const actors = [ACTOR_POOL[actor1Idx]];
  if(actor2Idx !== actor1Idx) actors.push(ACTOR_POOL[actor2Idx]);
  if(actor3Idx !== actor1Idx && actor3Idx !== actor2Idx) actors.push(ACTOR_POOL[actor3Idx]);
  
  return actors;
};

// Oyuncu ismine göre sabit bir geçmiş üretir
const getHistoryForActor = (actorName) => {
  const seed = actorName.length * 99;
  const play1 = HISTORY_POOL[getStableRandom(seed, HISTORY_POOL.length)];
  const play2 = HISTORY_POOL[getStableRandom(seed + 5, HISTORY_POOL.length)];
  return [play1, play2];
};

// LİSTE OLUŞTURMA
const FULL_PLAY_LIST = PLAY_TITLES.map((title, index) => {
  const customImg = POSTER_MAP[title];
  // Yedek resim dizisine gerek yok, hepsi POSTER_MAP içinde var.
  const imgUrl = customImg || "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=500&q=80";

  return {
    id: index + 1,
    t: title,
    g: GENRES[index % GENRES.length],
    img: imgUrl,
    stage: `${DISTRICTS[index % DISTRICTS.length]} Kültür Merkezi`,
    district: DISTRICTS[index % DISTRICTS.length],
    time: "20:30"
  };
});

const TheaterPage = () => {
  const navigate = useNavigate(); 
  const [selectedDateObj, setSelectedDateObj] = useState(new Date()); 
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  
  const [occupancyData, setOccupancyData] = useState({});
  const [selectedCastPlay, setSelectedCastPlay] = useState(null); // Modalı açılacak oyun

  const { isOpen: isRepertoireOpen, onOpen: onRepertoireOpen, onClose: onRepertoireClose } = useDisclosure();
  const { isOpen: isCastOpen, onOpen: onCastOpen, onClose: onCastClose } = useDisclosure();

  // 1. BAŞLANGIÇ: DOLULUK VERİSİ
  useEffect(() => {
    const savedData = localStorage.getItem('theaterOccupancyFINAL');
    if (savedData) {
      try { setOccupancyData(JSON.parse(savedData)); } catch (e) {}
    } else {
      const initialData = {};
      FULL_PLAY_LIST.forEach(play => {
        const rand = Math.random();
        let val;
        if(rand < 0.15) val = Math.floor(Math.random() * 10) + 90;
        else if(rand < 0.75) val = Math.floor(Math.random() * 40) + 50;
        else val = Math.floor(Math.random() * 40) + 10;
        initialData[play.id] = val;
      });
      setOccupancyData(initialData);
      localStorage.setItem('theaterOccupancyFINAL', JSON.stringify(initialData));
    }
  }, []);

  // 2. TAKVİM
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        fullDate: d,
        dayName: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('tr-TR', { month: 'short' }),
      });
    }
    return days;
  }, []);

  // 3. GÜNLÜK KÜRASYON
  const dailyPlays = useMemo(() => {
    let pool = FULL_PLAY_LIST;
    if (selectedDistrict) pool = pool.filter(p => p.district === selectedDistrict);
    if (selectedGenre) pool = pool.filter(p => p.g === selectedGenre);

    const dayNum = selectedDateObj.getDate();
    if (pool.length <= 8) return pool;

    const selection = [];
    const fixedGenres = [...GENRES]; 

    fixedGenres.forEach((genre, index) => {
      const genrePlays = pool.filter(p => p.g === genre);
      if (genrePlays.length > 0) {
        const pickIndex = (dayNum + index) % genrePlays.length;
        selection.push(genrePlays[pickIndex]);
      }
    });

    if (!selectedGenre && selection.length < 8) {
       const remaining = pool.filter(p => !selection.includes(p));
       for(let i=0; i < (8 - selection.length); i++) {
          if(remaining[i]) selection.push(remaining[i]);
       }
    }
    return selection;
  }, [selectedDateObj, selectedDistrict, selectedGenre]);

  const getProgressColor = (val) => {
    if (val >= 90) return "red";
    if (val >= 50) return "yellow";
    return "green";
  };

  const handleDetailClick = (id) => {
      navigate(`/app/content/theater/detail/${id}`);
  };

  const handleOpenCast = (play) => {
      setSelectedCastPlay(play);
      onCastOpen();
  };

  return (
    <Box bg="#050505" minH="100vh" color="gray.200" fontFamily="'Segoe UI', sans-serif" pb={20}>
      
      {/* HERO */}
      <Box 
        h={{ base: "300px", md: "450px" }} position="relative"
        bgImage="url('https://images.unsplash.com/photo-1507924538820-ede94a04019d?q=80&w=2070&auto=format&fit=crop')"
        bgSize="cover" bgPosition="center"
        display="flex" alignItems="center" justifyContent="center"
        _before={{ content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgGradient: 'linear(to-t, #050505, rgba(0,0,0,0.4))' }}
      >
        <Container maxW="1200px" position="relative" zIndex={2} textAlign="center">
          <Badge bg="red.600" color="white" mb={4} fontSize="lg" px={4} py={1} borderRadius="full">TİYATRO & SAHNE</Badge>
          <Heading size="4xl" textShadow="0 4px 20px black" mb={4} color="white" fontWeight="800">VİZYONDAKİ OYUNLAR</Heading>
          <Text fontSize="xl" color="gray.200" maxW="700px" mx="auto" textShadow="0 2px 5px black">Şehrin en seçkin sahnelerinde, her gün farklı bir hikaye sizi bekliyor.</Text>
        </Container>
      </Box>

      <Container maxW="1200px" mt={-16} position="relative" zIndex={3}>
        
        {/* TAKVİM ve FİLTRELER */}
        <Box bg="#121212" p={6} borderRadius="xl" boxShadow="0 -10px 40px rgba(0,0,0,0.8)" border="1px solid #333">
          <Heading size="sm" mb={3} color="gray.500">Seans Tarihleri</Heading>
          <Flex overflowX="auto" pb={4} mb={6} css={{ '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { background: '#9B2C2C' } }}>
            {calendarDays.map((item, index) => {
              const isSelected = selectedDateObj.getDate() === item.dayNumber && selectedDateObj.getMonth() === item.fullDate.getMonth();
              return (
                <Button
                  key={index} minW="70px" h="85px" mr={2} flexDirection="column" borderRadius="xl"
                  bg={isSelected ? "red.600" : "#222"} color="white"
                  border="1px solid" borderColor={isSelected ? "red.400" : "#444"}
                  _hover={{ bg: isSelected ? "red.500" : "#333", transform: "translateY(-2px)" }}
                  onClick={() => setSelectedDateObj(item.fullDate)}
                >
                  <Text fontSize="xs" opacity={0.8} mb={0}>{item.dayName}</Text>
                  <Text fontSize="2xl" fontWeight="bold" lineHeight="1">{item.dayNumber}</Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>{item.monthName}</Text>
                </Button>
              )
            })}
          </Flex>

          <Flex gap={4} direction={{ base: "column", md: "row" }} align="center" wrap="wrap">
            <Select flex="1" minW="200px" bg="red.800" color="white" borderColor="red.900" h="50px" icon={<FaMapMarkerAlt />} value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} cursor="pointer" _hover={{ bg: "red.700" }} sx={{ '> option': { bg: '#222', color: 'white' } }}>
              <option value="">Tüm Sahneler (İstanbul)</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select flex="1" minW="200px" bg="red.800" color="white" borderColor="red.900" h="50px" icon={<FaTheaterMasks />} value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} cursor="pointer" _hover={{ bg: "red.700" }} sx={{ '> option': { bg: '#222', color: 'white' } }}>
              <option value="">Tüm Türler</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
            <Button flex="1" minW="200px" h="50px" bg="gray.700" color="white" _hover={{ bg: "gray.600" }} leftIcon={<FaSearchLocation />} onClick={onRepertoireOpen} border="1px solid #555">
              Tüm Repertuvarı Gör
            </Button>
          </Flex>
        </Box>

        {/* LİSTELEME */}
        <Box mt={10}>
          <Heading size="lg" mb={2} color="white" fontFamily="'Playfair Display', serif" fontStyle="italic">Sahne Perdesi: Günün Seçkisi</Heading>
          <Text color="gray.400" mb={8} fontSize="sm">{selectedDateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })} programı</Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {dailyPlays.map((play) => {
              const occupancy = occupancyData[play.id] || 50; 
              const barColor = getProgressColor(occupancy);

              return (
                <Box key={play.id} bg="#1a1a1a" borderRadius="2xl" overflow="hidden" border="1px solid #333" position="relative" transition="all 0.3s" _hover={{ transform: "translateY(-10px)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", borderColor: "red.800" }}>
                  <Tooltip label={`Doluluk: %${occupancy}`} hasArrow bg={barColor + ".600"}>
                    <Box w="100%" h="6px" bg="gray.800">
                        <Box w={`${occupancy}%`} h="100%" bg={`${barColor}.500`} transition="width 1s"/>
                    </Box>
                  </Tooltip>
                  <Image src={play.img} w="100%" h="350px" objectFit="cover" objectPosition="top" filter="brightness(0.9)" />
                  <Badge position="absolute" top={4} right={4} bg="red.600" color="white" px={3} py={1} borderRadius="md">{play.g}</Badge>
                  <Box p={5}>
                    <Heading size="md" mb={2} color="white" noOfLines={1}>{play.t}</Heading>
                    <VStack align="flex-start" spacing={1} mb={4} color="gray.400" fontSize="sm">
                      <Flex align="center" gap={2}><Icon as={FaMapMarkerAlt} color="red.500"/><Text noOfLines={1}>{play.stage}</Text></Flex>
                      <Flex align="center" gap={2}><Icon as={FaSearchLocation} color="gray.500"/><Text>{play.district}</Text></Flex>
                    </VStack>
                    
                    <HStack spacing={2}>
                        {/* 1. BİLET AL BUTONU (Doğru Yönlendirme) */}
                        <Button flex="1" colorScheme="red" variant="outline" _hover={{ bg: "red.600", color: "white" }} onClick={() => handleDetailClick(play.id)}>
                            Bilet Al
                        </Button>
                        
                        {/* 2. KADRO PENCERESİ BUTONU (Senin İstediğin) */}
                        <Tooltip label="Kadro ve Künye">
                            <IconButton icon={<FaUsers />} colorScheme="gray" variant="outline" onClick={() => handleOpenCast(play)} />
                        </Tooltip>
                    </HStack>

                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>

        {/* --- MODAL 1: TÜM REPERTUVAR (GELİŞMİŞ) --- */}
        <Modal isOpen={isRepertoireOpen} onClose={onRepertoireClose} size="full" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.800"/>
          <ModalContent bg="#151515" color="white">
            <ModalHeader borderBottom="1px solid #333" bg="#1a1a1a" py={6} px={10}>
              <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="lg" color="red.500">Tüm Tiyatro Repertuvarı</Heading>
                    <Text fontSize="sm" color="gray.400">Toplam {FULL_PLAY_LIST.length} Oyun Listeleniyor</Text>
                  </Box>
                  <ModalCloseButton position="static" color="white" size="lg"/>
              </Flex>
            </ModalHeader>
            <ModalBody p={10}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                {FULL_PLAY_LIST.map((play) => (
                  <Card key={play.id} bg="#222" borderRadius="xl" overflow="hidden" border="1px solid #333" _hover={{ borderColor: "red.600", transform: "translateY(-5px)" }} transition="all 0.2s">
                    <Image src={play.img} w="100%" h="200px" objectFit="cover" />
                    <CardBody p={4}>
                      <Badge colorScheme="red" mb={2}>{play.g}</Badge>
                      <Heading size="md" mb={2} color="white" noOfLines={1}>{play.t}</Heading>
                      <Text fontSize="sm" color="gray.400" mb={4}>{play.stage}</Text>
                      
                      <HStack>
                          {/* BELİRGİN KIRMIZI İNCELE BUTONU (Yönlendirme) */}
                          <Button flex="1" colorScheme="red" onClick={() => handleDetailClick(play.id)} leftIcon={<FaSearchPlus />}>
                              İNCELE
                          </Button>
                          {/* MİNİ KADRO BUTONU (Pencere) */}
                          <IconButton icon={<FaUsers />} variant="ghost" color="gray.400" onClick={() => handleOpenCast(play)} />
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* --- MODAL 2: KADRO & KÜNYE (SENİN İSTEDİĞİN PENCERE) --- */}
        <Modal isOpen={isCastOpen} onClose={onCastClose} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent bg="#1a1a1a" color="white" border="1px solid #444">
                <ModalHeader borderBottom="1px solid #333">
                    <Heading size="md" color="red.400">{selectedCastPlay?.t} - Kadro</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody p={6}>
                    <VStack spacing={4} align="stretch">
                        {/* SABİT RANDOM KADRO LİSTELEME */}
                        {selectedCastPlay && getCastForPlay(selectedCastPlay.id).map((actor, i) => (
                            <Flex key={i} bg="#222" p={3} borderRadius="lg" align="center" gap={4} border="1px solid #333">
                                {/* OYUNCU FOTOSU */}
                                <Avatar size="lg" src={actor.img} name={actor.name} border="2px solid #C53030" />
                                
                                <Box flex="1">
                                    <Text fontWeight="bold" fontSize="lg">{actor.name}</Text>
                                    <Text fontSize="xs" color="gray.500" mb={1}><Icon as={FaStar} color="yellow.500" mr={1}/> Oyuncu</Text>
                                    
                                    <Divider my={1} borderColor="#444" />
                                    
                                    {/* SABİT RANDOM GEÇMİŞ OYUNLAR */}
                                    <Text fontSize="xs" color="gray.400" display="flex" alignItems="center">
                                        <Icon as={FaHistory} mr={1} color="red.300"/> 
                                        Geçmiş: {getHistoryForActor(actor.name).join(", ")}
                                    </Text>
                                </Box>
                            </Flex>
                        ))}
                    </VStack>
                    
                    {/* BİLET AL BUTONU (MODAL İÇİNDEN YÖNLENDİRME) */}
                    <Button w="full" mt={6} colorScheme="red" variant="outline" onClick={() => handleDetailClick(selectedCastPlay.id)}>
                        Bu Oyunun Biletlerine Git
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
};

export default TheaterPage;