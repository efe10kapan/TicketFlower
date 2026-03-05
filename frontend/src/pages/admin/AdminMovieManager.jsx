import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Heading, SimpleGrid, Image, Text, Button, Flex, Badge, IconButton, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure,
  FormControl, FormLabel, Input, VStack, InputGroup, InputLeftElement, Stat, StatLabel, StatNumber, StatHelpText, Icon, Card, CardBody
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus, FaSearch, FaUndo, FaStar, FaSave, FaFilm, FaChartLine, FaVideo } from 'react-icons/fa';

// --- TAM FİLM LİSTESİ (20 ADET) ---
const INITIAL_MOVIES = [
  { id: 1, title: "Oppenheimer", genre: "Biyografi", img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", rating: 8.9 },
  { id: 2, title: "Barbie", genre: "Komedi", img: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", rating: 7.2 },
  { id: 3, title: "John Wick 4", genre: "Aksiyon", img: "https://tse1.mm.bing.net/th/id/OIP.z4ODeP4zFI4k6jahRWm2gwHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 8.0 },
  { id: 4, title: "Avatar: Suyun Yolu", genre: "Bilim Kurgu", img: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", rating: 7.8 },
  { id: 5, title: "Top Gun: Maverick", genre: "Aksiyon", img: "https://wallpapers.com/images/hd/top-gun-maverick-poster-v145qr6pv3y04efi.jpg", rating: 8.3 },
  { id: 6, title: "Joker", genre: "Suç", img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", rating: 8.4 },
  { id: 7, title: "Örümcek-Adam: Evrene Geçiş", genre: "Animasyon", img: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", rating: 8.7 },
  { id: 8, title: "The Batman", genre: "Suç", img: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", rating: 7.9 },
  { id: 9, title: "Yıldızlararası", genre: "Bilim Kurgu", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6 },
  { id: 10, title: "Başlangıç (Inception)", genre: "Bilim Kurgu", img: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", rating: 8.8 },
  { id: 11, title: "Hızlı ve Öfkeli 10", genre: "Aksiyon", img: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", rating: 6.8 },
  { id: 12, title: "Avengers: Endgame", genre: "Macera", img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.4 },
  { id: 13, title: "Para Avcısı", genre: "Biyografi", img: "https://tr.web.img4.acsta.net/pictures/14/01/24/10/55/409246.jpg", rating: 8.2 },
  { id: 14, title: "Dune: Çöl Gezegeni", genre: "Bilim Kurgu", img: "https://preview.redd.it/dune-part-2-fan-art-poster-by-beenum-editz-v0-5r4cp9ehtkob1.jpg?auto=webp&s=6d62ef8fe13a644d9681779d95a43e8fef15e071", rating: 8.1 },
  { id: 15, title: "Matrix", genre: "Bilim Kurgu", img: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7 },
  { id: 16, title: "Deadpool 3", genre: "Komedi/Aksiyon", img: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg", rating: 0 },
  { id: 17, title: "Gladiator 2", genre: "Tarih", img: "https://i.ytimg.com/vi/2Hb4LvHd8To/maxresdefault.jpg", rating: 0 },
  { id: 18, title: "Mufasa: Aslan Kral", genre: "Animasyon", img: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", rating: 0 },
  { id: 19, title: "Joker: İkili Delilik", genre: "Müzikal", img: "https://images.justwatch.com/poster/321433801/s718/joker-2.jpg", rating: 0 },
  { id: 20, title: "Mission Impossible 8", genre: "Aksiyon", img: "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg", rating: 0 },
];

const AdminMovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  
  // Undo (Geri Al) için özel state
  const [lastDeleted, setLastDeleted] = useState(null); 
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({ title: '', genre: '', img: '', rating: '' });
  
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('admin_movies'));
    // Eğer localStorage boşsa veya çok az veri varsa fulle
    if (saved && saved.length > 5) setMovies(saved);
    else {
      setMovies(INITIAL_MOVIES);
      localStorage.setItem('admin_movies', JSON.stringify(INITIAL_MOVIES));
    }
  }, []);

  // --- İSTATİSTİKLER (ZENGİNLİK) ---
  const stats = {
    total: movies.length,
    avgRating: (movies.reduce((acc, m) => acc + (parseFloat(m.rating) || 0), 0) / (movies.length || 1)).toFixed(1),
    actionCount: movies.filter(m => m.genre.includes("Aksiyon")).length
  };

  // --- SİLME VE GERİ ALMA (DÜZELTİLDİ) ---
  const handleDelete = (id) => {
    const itemToDelete = movies.find(m => m.id === id);
    const filtered = movies.filter(m => m.id !== id);
    
    // State güncelle
    setMovies(filtered);
    localStorage.setItem('admin_movies', JSON.stringify(filtered));
    setLastDeleted(itemToDelete); // Yedeği al

    // Varsa eski toast'u kapat
    if (toastIdRef.current) toast.close(toastIdRef.current);

    // Yeni Toast aç
    toastIdRef.current = toast({
        position: 'bottom-right',
        render: ({ onClose }) => (
            <Box color="white" p={4} bg="red.600" borderRadius="xl" boxShadow="lg" display="flex" alignItems="center" justifyContent="space-between" w="350px">
                <Flex align="center" gap={2}>
                    <Icon as={FaTrash} />
                    <Text fontWeight="bold" fontSize="sm">Film Silindi</Text>
                </Flex>
                <Button size="sm" leftIcon={<FaUndo/>} onClick={() => handleUndo(itemToDelete, onClose)} colorScheme="whiteAlpha" variant="solid">
                    Geri Al
                </Button>
            </Box>
        ),
        duration: 5000,
        isClosable: true,
    });
  };

  const handleUndo = (item, closeToast) => {
    if (item) {
        setMovies(prev => [item, ...prev]); // State'e geri koy
        // LocalStorage güncellemesini useEffect veya anlık yapalım
        const currentList = JSON.parse(localStorage.getItem('admin_movies') || "[]");
        localStorage.setItem('admin_movies', JSON.stringify([item, ...currentList]));
        
        closeToast(); // Toast'u kapat
        toast({ title: "İşlem Geri Alındı", status: "success", duration: 1500, position: "bottom-right" });
    }
  };

  // --- EKLEME / DÜZENLEME ---
  const handleSave = () => {
    if (!currentMovie.title || !currentMovie.img) {
        toast({ title: "Lütfen başlık ve resim girin.", status: "warning" });
        return;
    }

    let updatedList;
    if (isEditing) {
        updatedList = movies.map(m => m.id === currentMovie.id ? currentMovie : m);
        toast({ title: "Güncellendi", status: "success" });
    } else {
        const newMovie = { ...currentMovie, id: Date.now(), rating: currentMovie.rating || 0 };
        updatedList = [newMovie, ...movies];
        toast({ title: "Eklendi", status: "success" });
    }

    setMovies(updatedList);
    localStorage.setItem('admin_movies', JSON.stringify(updatedList));
    onClose();
  };

  const openAdd = () => { setIsEditing(false); setCurrentMovie({ title: '', genre: '', img: '', rating: '' }); onOpen(); };
  const openEdit = (m) => { setIsEditing(true); setCurrentMovie(m); onOpen(); };

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={8} bg="#080808" minH="100vh" color="white" fontFamily="'Segoe UI', sans-serif">
      
      {/* 1. ÜST İSTATİSTİK PANELİ (YENİ) */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg="#111" borderTop="4px solid" borderColor="blue.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaFilm} color="blue.500" w={6} h={6}/><StatLabel color="gray.400">Toplam Film</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.total}</StatNumber>
                    <StatHelpText>Vizyondaki içerik sayısı</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
        <Card bg="#111" borderTop="4px solid" borderColor="yellow.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaStar} color="yellow.500" w={6} h={6}/><StatLabel color="gray.400">Ortalama Puan</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.avgRating}</StatNumber>
                    <StatHelpText>IMDB verilerine göre</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
        <Card bg="#111" borderTop="4px solid" borderColor="red.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaVideo} color="red.500" w={6} h={6}/><StatLabel color="gray.400">Aksiyon Filmleri</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.actionCount}</StatNumber>
                    <StatHelpText>En popüler kategori</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
      </SimpleGrid>

      {/* 2. ARAÇ ÇUBUĞU */}
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={8} gap={4} bg="#111" p={4} borderRadius="xl" border="1px solid #222">
        <Flex align="center" gap={3}>
            <Heading size="lg" color="blue.400">Vizyon Yönetimi</Heading>
            <Badge colorScheme="blue">SİNEMA</Badge>
        </Flex>
        <Flex gap={4} w={{ base: "100%", md: "auto" }}>
            <InputGroup w={{ base: "100%", md: "300px" }}>
                <InputLeftElement pointerEvents="none"><FaSearch color="gray" /></InputLeftElement>
                <Input placeholder="Film Ara..." value={search} onChange={(e) => setSearch(e.target.value)} bg="#000" border="1px solid #333" _focus={{ borderColor: "blue.500" }} />
            </InputGroup>
            <Button leftIcon={<FaPlus />} colorScheme="blue" px={6} onClick={openAdd}>Film Ekle</Button>
        </Flex>
      </Flex>

      {/* 3. FİLM LİSTESİ */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
        {filteredMovies.map((movie) => (
          <Box key={movie.id} bg="#141414" borderRadius="xl" overflow="hidden" border="1px solid #222" transition="all 0.3s" _hover={{ transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderColor: "blue.600" }} role="group">
            <Box position="relative">
                <Image src={movie.img} h="320px" w="100%" objectFit="cover" filter="brightness(0.9)" />
                <Badge position="absolute" top={3} right={3} colorScheme="blue" fontSize="xs">{movie.genre}</Badge>
                <Flex position="absolute" bottom={3} left={3} bg="rgba(0,0,0,0.7)" px={2} py={1} borderRadius="md" align="center" gap={1} backdropFilter="blur(5px)">
                    <FaStar color="gold" size="12px" />
                    <Text fontSize="xs" fontWeight="bold">{movie.rating}</Text>
                </Flex>
            </Box>
            <Box p={4}>
                <Heading size="sm" mb={1} noOfLines={1} color="white">{movie.title}</Heading>
                <Flex gap={2} mt={4}>
                    <Button flex="1" size="sm" variant="outline" colorScheme="gray" leftIcon={<FaEdit />} onClick={() => openEdit(movie)}>Düzenle</Button>
                    <IconButton icon={<FaTrash />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleDelete(movie.id)}/>
                </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* 4. MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.8)" />
        <ModalContent bg="#1a1a1a" color="white" border="1px solid #333">
            <ModalHeader color="blue.400">{isEditing ? "Filmi Düzenle" : "Yeni Film Ekle"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack spacing={5}>
                    <FormControl isRequired><FormLabel color="gray.400">Film Başlığı</FormLabel><Input value={currentMovie.title} onChange={(e) => setCurrentMovie({...currentMovie, title: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    <Flex gap={4} w="100%">
                        <FormControl><FormLabel color="gray.400">Tür</FormLabel><Input value={currentMovie.genre} onChange={(e) => setCurrentMovie({...currentMovie, genre: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                        <FormControl w="100px"><FormLabel color="gray.400">Puan</FormLabel><Input type="number" value={currentMovie.rating} onChange={(e) => setCurrentMovie({...currentMovie, rating: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    </Flex>
                    <FormControl isRequired><FormLabel color="gray.400">Afiş URL</FormLabel><Input value={currentMovie.img} onChange={(e) => setCurrentMovie({...currentMovie, img: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    <Button w="full" size="lg" colorScheme="blue" onClick={handleSave} leftIcon={<FaSave />} mt={2}>{isEditing ? "KAYDET" : "EKLE"}</Button>
                </VStack>
            </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default AdminMovieManager;