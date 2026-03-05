import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Heading, SimpleGrid, Image, Text, Button, Flex, Badge, IconButton, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure,
  FormControl, FormLabel, Input, VStack, InputGroup, InputLeftElement, Stat, StatLabel, StatNumber, StatHelpText, Icon, Card, CardBody
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus, FaSearch, FaUndo, FaTheaterMasks, FaSave, FaUsers, FaMask } from 'react-icons/fa';

// --- TAM TİYATRO LİSTESİ (50 ADET) ---
const INITIAL_PLAYS = [
  { id: 1, title: "Hamlet", genre: "Trajedi", img: "https://img.rgstatic.com/content/movie/c2872588-32f5-47d9-9a36-689111780adc/poster-780.jpg" },
  { id: 2, title: "Cimri", genre: "Komedi", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/cimri-20235291064.jpeg" },
  { id: 3, title: "Amadeus", genre: "Dram", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/d273f76c8d7643ada1eeae7f3f474bee.jpg" },
  { id: 4, title: "Lüküs Hayat", genre: "Müzikal", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/lukus-hayat-ebb-202492616019b04127a67233494ea10c7abc48886a56.jpg" },
  { id: 5, title: "Kürk Mantolu Madonna", genre: "Dram", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/kurk-mantolu-madonna-20246291432409f6af6c2f6ea4af282439b42c8f84406.jpg" },
  { id: 6, title: "Godot'yu Beklerken", genre: "Absürt", img: "https://playtusu.com/wp-content/uploads/2024/08/GT6bwtrXgAA0u4U.jpeg" },
  { id: 7, title: "Bir Delinin Hatıra Defteri", genre: "Psikolojik", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/bir-delinin-hatira-defteri-sonsuz-2025921556204a1f25ae37dd447c9ff42cf9e708e435.png" },
  { id: 8, title: "Macbeth", genre: "Trajedi", img: "https://www.bonzoproductions.com/macbeth/graphics/macbeth-background3b.jpg" },
  { id: 9, title: "Kel Şarkıcı", genre: "Absürt", img: "https://tse4.mm.bing.net/th/id/OIP.dyT7EXa0J8WjS8HMPeGpnAHaJL?w=950&h=1178&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 10, title: "Kanlı Nigar", genre: "Geleneksel", img: "https://tr.web.img3.acsta.net/pictures/bzp/01/213405.jpg" },
  { id: 11, title: "Romeo ve Juliet", genre: "Romantik", img: "https://cdn.timas.com.tr/urun/romeo-ve-juliet-9786054985418.jpg" },
  { id: 12, title: "Othello", genre: "Trajedi", img: "https://th.bing.com/th/id/R.00835daa09f64570c9da1a6ded189315?rik=QuhXxsPDa7%2bKAA&riu=http%3a%2f%2f4.bp.blogspot.com%2f_D9cWf075QuU%2fTAuBVPcWIdI%2fAAAAAAAAAR4%2fNZkE8mqM9wI%2fs1600%2fOthello%2bby%2bWilliam%2bShakespeare%2bOKEEH.jpg&ehk=dnJyNK5SDFj2VQKMm4k%2bELeg%2f8wqatzDQdh%2bPvNWvXQ%3d&risl=&pid=ImgRaw&r=0" },
  { id: 13, title: "Sefiller", genre: "Dram", img: "https://tse4.mm.bing.net/th/id/OIP.z9gSpLc-3hpgiZLdzxPnCwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 14, title: "Fareler ve İnsanlar", genre: "Dram", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/fareler-ve-insanlar-20231116114722c18e0ff0db994f7ba81145f3578bbcd2.jpeg" },
  { id: 15, title: "Don Kişot", genre: "Macera", img: "https://tse4.mm.bing.net/th/id/OIP.MJP2MpV4Dnj3Y495615Q5AHaKt?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 16, title: "Kral Lear", genre: "Trajedi", img: "https://www.databazeknih.cz/img/books/50_/507952/big_kral-lear-bTD-507952.jpg" },
  { id: 17, title: "Fırtına", genre: "Fantastik", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/firtina-tiyatro-oyunu-2025911337164ee0e36d6cfd4e9e8282ab731322ac0c.jpeg" },
  { id: 18, title: "Operadaki Hayalet", genre: "Müzikal", img: "https://images.justwatch.com/poster/73350280/s718/operadaki-hayalet.jpg" },
  { id: 19, title: "Aslan Kral", genre: "Müzikal", img: "https://images.justwatch.com/poster/264337438/s718/aslan-kral-2019.%7Bformat%7D" },
  { id: 20, title: "Alice Harikalar Diyarında", genre: "Fantastik", img: "https://images.justwatch.com/poster/260769800/s718/alis-harikalar-diyarinda.%7Bformat%7D" },
  { id: 21, title: "Hisseli Harikalar Kumpanyası", genre: "Müzikal", img: "https://im.haberturk.com/movies/movie/b/hisseli-harikalar-kumpanyasi-350167.jpg?ver=1701241199" },
  { id: 22, title: "Keşanlı Ali Destanı", genre: "Epik", img: "https://i4.hurimg.com/i/hurriyet/75/750x422/5c0fbd15c03c0e0df4fba5c0.jpg" },
  { id: 23, title: "Ferhangi Şeyler", genre: "Komedi", img: "https://tse1.mm.bing.net/th/id/OIP.dLobHS7gCmKbJVWOLub-2gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 24, title: "Vişne Bahçesi", genre: "Dram", img: "https://www.gazetekadikoy.com.tr/Uploads/gazetekadikoy.com.tr/202307131539321-img.jpeg" },
  { id: 25, title: "Küçük Prens", genre: "Çocuk", img: "https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG" },
  { id: 26, title: "Martı", genre: "Dram", img: "https://b6s54eznn8xq.merlincdn.net/IBB/TheatrePlay/Brochure/45f43206b3ba4ed0a1ef002e203707f4.jpg" },
  { id: 27, title: "1984", genre: "Distopya", img: "https://tse4.mm.bing.net/th/id/OIP.mZ8lfUjtuU5CvVzBCcc9ygHaLH?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 28, title: "Şeker Portakalı", genre: "Dram", img: "https://tse4.mm.bing.net/th/id/OIP.QPdsxb6wcoxsHJv8gn1ZawHaLH?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 29, title: "Saatleri Ayarlama Enstitüsü", genre: "Dram", img: "https://tse3.mm.bing.net/th/id/OIP.TidPlmAJoctWXhpy-P1J6gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 30, title: "Suç ve Ceza", genre: "Dram", img: "https://th.bing.com/th/id/R.5a74e63b3bf9fb61648996d9c2b36f00?rik=kbXvjykxKiptVw&pid=ImgRaw&r=0" },
  { id: 31, title: "Dönüşüm", genre: "Absürt", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/donusum-highest-2025424917238fff5d63b8bf4d3d8d9e1a7a80ef8b3a.png" },
  { id: 32, title: "Zengin Mutfağı", genre: "Komedi", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/zengin-mutfagi-2021123011125.jpg" },
  { id: 33, title: "Kundakçı", genre: "Tarih", img: "https://tse3.mm.bing.net/th/id/OIP.brv0Ks7MuCA-DvWBvv9k6gHaKX?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 34, title: "Bir Baba Hamlet", genre: "Komedi", img: "https://www.babasahne.com/uploads/oyun_afis/134_1t9NseGC0Z.jpg" },
  { id: 35, title: "Tartuffe", genre: "Komedi", img: "https://ridgeviewecho.com/wp-content/uploads/2024/02/IMG_1006-scaled.jpg" },
  { id: 36, title: "Notre Dame'ın Kamburu", genre: "Müzikal", img: "https://tse2.mm.bing.net/th/id/OIP.LxpmVVO26qJ7IyZGE1zLiwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 37, title: "Ayak Bacak Fabrikası", genre: "Politik", img: "https://b6s54eznn8xq.merlincdn.net/Uploads/Films/ayak-bacak-fabrikasi-2020108163523.jpg" },
  { id: 38, title: "Yedi Kocalı Hürmüz", genre: "Müzikal", img: "https://th.bing.com/th/id/R.55b0274070fe6da1b0772404b8fe200f?rik=L410RnQi%2bGYkHQ&pid=ImgRaw&r=0" },
  { id: 39, title: "Cyrano de Bergerac", genre: "Romantik", img: "https://tse1.mm.bing.net/th/id/OIP.henIErdQrt3yTTtJWWg5NwHaKq?w=556&h=800&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 40, title: "Bir Yaz Gecesi Rüyası", genre: "Komedi", img: "https://th.bing.com/th/id/R.9ab85f2cad936027e18b26d0958cba26?rik=8xjXZ5%2bswYQI4g&pid=ImgRaw&r=0" },
  { id: 41, title: "Vanya Dayı", genre: "Dram", img: "https://tse4.mm.bing.net/th/id/OIP.p2-g3OSMTmBzfMDreTUDUwHaLh?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 42, title: "Üç Kız Kardeş", genre: "Dram", img: "https://penguenkitap.com.tr/upload/products/uc-kiz-kardes/uc-kiz-kardes_2319.jpg" },
  { id: 43, title: "Satıcının Ölümü", genre: "Dram", img: "https://tse4.mm.bing.net/th/id/OIP.Zey9VonvQ8z0PdOnhXghEgHaKl?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 44, title: "Arzu Tramvayı", genre: "Dram", img: "https://tiyatrolar.com.tr/files/activity/a/arzu-tramvayi/image/arzu-tramvayi.jpg" },
  { id: 45, title: "Damdaki Kemancı", genre: "Müzikal", img: "https://m.media-amazon.com/images/M/MV5BZDgwYTM2NzQtY2JkMi00MzE0LWE2ZjItNzliZTY2OTc2YzVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { id: 46, title: "Mamma Mia", genre: "Müzikal", img: "https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_.jpg" },
  { id: 47, title: "Wicked", genre: "Müzikal", img: "https://cdn.britannica.com/09/251609-050-C7714B50/Broadway-musical-Wicked-performance-Sydney-2009.jpg" },
  { id: 48, title: "Chicago", genre: "Müzikal", img: "https://th.bing.com/th/id/R.b168cb506f690e8d6e005a6f624674dc?rik=jbpFy%2bXy%2bYVZCw&riu=http%3a%2f%2fdata.logograph.com%2fresize%2fEKUCenter%2fmultimedia%2fImage%2f5071%2fchicago-the-musical-event-page.jpg%3fwidth%3d1500&ehk=dnKifudO4eTjzaeL5Y7GHxU8n4F0%2b1tYJDRQMRYVXjA%3d&risl=&pid=ImgRaw&r=0" },
  { id: 49, title: "Cats", genre: "Müzikal", img: "https://th.bing.com/th/id/R.4c7d202276865cc4da3f260b85677eae?rik=k0o2GQodk1NVKQ&pid=ImgRaw&r=0" },
  { id: 50, title: "Hamilton", genre: "Müzikal", img: "https://th.bing.com/th/id/R.f087d1d89890ece9126c2e07875f924d?rik=QVEMFYPEF62iuA&pid=ImgRaw&r=0" }
];

const AdminTheaterManager = () => {
  const [plays, setPlays] = useState([]);
  const [search, setSearch] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlay, setCurrentPlay] = useState({ title: '', genre: '', img: '' });
  const [lastDeleted, setLastDeleted] = useState(null);
  
  const toast = useToast();
  const toastIdRef = useRef();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('admin_theaters'));
    // Eğer localStorage boşsa veya eksikse fulle
    if (saved && saved.length > 5) setPlays(saved);
    else {
      setPlays(INITIAL_PLAYS);
      localStorage.setItem('admin_theaters', JSON.stringify(INITIAL_PLAYS));
    }
  }, []);

  // --- İSTATİSTİK ---
  const stats = {
    total: plays.length,
    musicalCount: plays.filter(p => p.genre.includes("Müzikal")).length,
    dramaCount: plays.filter(p => p.genre.includes("Dram")).length
  };

  // --- SİLME VE GERİ ALMA ---
  const handleDelete = (id) => {
    const itemToDelete = plays.find(p => p.id === id);
    const filtered = plays.filter(p => p.id !== id);
    
    setPlays(filtered);
    localStorage.setItem('admin_theaters', JSON.stringify(filtered));
    setLastDeleted(itemToDelete);

    if (toastIdRef.current) toast.close(toastIdRef.current);

    toastIdRef.current = toast({
        position: 'bottom-right',
        render: ({ onClose }) => (
            <Box color="white" p={4} bg="red.600" borderRadius="xl" boxShadow="lg" display="flex" alignItems="center" justifyContent="space-between" w="350px">
                <Flex align="center" gap={2}>
                    <Icon as={FaTrash} />
                    <Text fontWeight="bold" fontSize="sm">Oyun Kaldırıldı</Text>
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
        setPlays(prev => [item, ...prev]);
        const currentList = JSON.parse(localStorage.getItem('admin_theaters') || "[]");
        localStorage.setItem('admin_theaters', JSON.stringify([item, ...currentList]));
        
        closeToast();
        toast({ title: "Geri Alındı", status: "success", duration: 1500, position: "bottom-right" });
    }
  };

  const handleSave = () => {
    if (!currentPlay.title || !currentPlay.img) {
        toast({ title: "Eksik Bilgi", status: "warning" });
        return;
    }

    let updatedList;
    if (isEditing) {
        updatedList = plays.map(p => p.id === currentPlay.id ? currentPlay : p);
        toast({ title: "Güncellendi", status: "success" });
    } else {
        const newPlay = { ...currentPlay, id: Date.now() };
        updatedList = [newPlay, ...plays];
        toast({ title: "Sahneye Eklendi", status: "success" });
    }

    setPlays(updatedList);
    localStorage.setItem('admin_theaters', JSON.stringify(updatedList));
    onClose();
  };

  const openAdd = () => { setIsEditing(false); setCurrentPlay({ title: '', genre: '', img: '' }); onOpen(); };
  const openEdit = (p) => { setIsEditing(true); setCurrentPlay(p); onOpen(); };

  const filteredPlays = plays.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={8} bg="#080808" minH="100vh" color="white" fontFamily="'Segoe UI', sans-serif">
      
      {/* 1. İSTATİSTİK BAR */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg="#111" borderTop="4px solid" borderColor="red.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaTheaterMasks} color="red.500" w={6} h={6}/><StatLabel color="gray.400">Sahnedeki Oyunlar</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.total}</StatNumber>
                    <StatHelpText>Aktif repertuar</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
        <Card bg="#111" borderTop="4px solid" borderColor="purple.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaUsers} color="purple.500" w={6} h={6}/><StatLabel color="gray.400">Müzikaller</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.musicalCount}</StatNumber>
                    <StatHelpText>En çok izlenen kategori</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
        <Card bg="#111" borderTop="4px solid" borderColor="orange.500">
            <CardBody>
                <Stat>
                    <Flex align="center" gap={3}><Icon as={FaMask} color="orange.500" w={6} h={6}/><StatLabel color="gray.400">Dram Oyunları</StatLabel></Flex>
                    <StatNumber fontSize="3xl">{stats.dramaCount}</StatNumber>
                    <StatHelpText>Sezonun favorileri</StatHelpText>
                </Stat>
            </CardBody>
        </Card>
      </SimpleGrid>

      {/* 2. ARAÇ ÇUBUĞU */}
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={8} gap={4} bg="#111" p={4} borderRadius="xl" border="1px solid #222">
        <Flex align="center" gap={3}>
            <Heading size="lg" color="red.500">Sahne Yönetimi</Heading>
            <Badge colorScheme="red">TİYATRO</Badge>
        </Flex>
        <Flex gap={4} w={{ base: "100%", md: "auto" }}>
            <InputGroup w={{ base: "100%", md: "300px" }}>
                <InputLeftElement pointerEvents="none"><FaSearch color="gray" /></InputLeftElement>
                <Input placeholder="Oyun Ara..." value={search} onChange={(e) => setSearch(e.target.value)} bg="#000" border="1px solid #333" _focus={{ borderColor: "red.500" }} />
            </InputGroup>
            <Button leftIcon={<FaPlus />} colorScheme="red" px={6} onClick={openAdd}>Oyun Ekle</Button>
        </Flex>
      </Flex>

      {/* 3. LİSTE */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
        {filteredPlays.map((play) => (
          <Box key={play.id} bg="#141414" borderRadius="xl" overflow="hidden" border="1px solid #222" transition="all 0.3s" _hover={{ borderColor: "red.600", transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} role="group">
            <Box position="relative">
                <Image src={play.img} h="320px" w="100%" objectFit="cover" filter="brightness(0.9)" />
                <Badge position="absolute" top={3} right={3} colorScheme="red" fontSize="xs">{play.genre}</Badge>
            </Box>
            <Box p={4}>
                <Heading size="sm" mb={1} noOfLines={1} color="white">{play.title}</Heading>
                <Flex gap={2} mt={4}>
                    <Button flex="1" size="sm" variant="outline" colorScheme="gray" leftIcon={<FaEdit />} onClick={() => openEdit(play)}>Düzenle</Button>
                    <IconButton icon={<FaTrash />} colorScheme="red" variant="ghost" size="sm" onClick={() => handleDelete(play.id)}/>
                </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* 4. MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.8)" />
        <ModalContent bg="#1a1a1a" color="white" border="1px solid #333">
            <ModalHeader color="red.400">{isEditing ? "Oyunu Düzenle" : "Yeni Oyun Ekle"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
                <VStack spacing={5}>
                    <FormControl isRequired><FormLabel color="gray.400">Oyun Adı</FormLabel><Input value={currentPlay.title} onChange={(e) => setCurrentPlay({...currentPlay, title: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    <FormControl><FormLabel color="gray.400">Tür</FormLabel><Input value={currentPlay.genre} onChange={(e) => setCurrentPlay({...currentPlay, genre: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    <FormControl isRequired><FormLabel color="gray.400">Afiş URL</FormLabel><Input value={currentPlay.img} onChange={(e) => setCurrentPlay({...currentPlay, img: e.target.value})} bg="black" border="1px solid #333" /></FormControl>
                    <Button w="full" size="lg" colorScheme="red" onClick={handleSave} leftIcon={<FaSave />} mt={2}>{isEditing ? "KAYDET" : "EKLE"}</Button>
                </VStack>
            </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default AdminTheaterManager;