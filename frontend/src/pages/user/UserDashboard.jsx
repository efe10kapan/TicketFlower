import React, { useState, useEffect } from 'react';
import { 
  Box, Flex, Heading, Text, Button, Image, SimpleGrid, Badge, Icon, HStack, VStack,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure, AspectRatio 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaPlay, FaTheaterMasks, FaFilm, FaCalendarAlt, FaStar } from 'react-icons/fa';

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // --- MODAL (POPUP) AYARLARI ---
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTrailer, setSelectedTrailer] = useState("");

  // Fragmanı Açma Fonksiyonu
  const handleOpenTrailer = (url) => {
    setSelectedTrailer(url);
    onOpen();
  };

  // --- 1. SLIDER AYARLARI ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Oppenheimer",
      desc: "Dünyayı kurtarmak için onu yok etme riskini almak zorundalar.",
      image: "https://images.wallpapersden.com/image/download/oppenheimer-2023-movie-poster_bmVpamqUmZqaraWkpJRmbmdlrWZlbWU.jpg",
      rating: "9.2",
      trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg" // Oppenheimer Fragman
    },
    {
      id: 2,
      title: "Dune: Çöl Gezegeni Bölüm 2",
      desc: "Paul Atreides, intikam yolculuğunda Fremenlerle birlik oluyor.",
      image: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
      rating: "8.9",
      trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w" // Dune 2 Fragman
    },
   {
      id: 3,
      title: "Avatar: Suyun Yolu",
      desc: "Pandora'nın okyanuslarında geçen görsel bir şölen.",
      // Sadece bunu değiştirdim: En net, geniş ve orijinal görsel.
      image: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      rating: "8.5",
      trailerUrl: "https://www.youtube.com/embed/d9MyqF3bPZQ" 
    },
    {
      id: 4,
      title: "John Wick 4",
      desc: "Özgürlüğünü kazanmak için Yüksek Şura'ya karşı savaşıyor.",
      // Senin gönderdiğin John Wick görseli (YouTube kapak fotosu - Asla bozulmaz)
      image: "https://i.ytimg.com/vi/yjRHZEUamCc/maxresdefault.jpg",
      rating: "8.8",
      trailerUrl: "https://www.youtube.com/embed/yjRHZEUamCc" 
    },
    {
      id: 5,
      title: "Spider-Man: Across the Spider-Verse",
      desc: "Miles Morales, çoklu evrende diğer örümceklerle karşı karşıya.",
      image: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
      rating: "9.0",
      trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg" // Spider-Man Fragman
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // --- 2. YAKINDA GELECEKLER (2026 - FRAGMANLI) ---
  const comingSoon2026 = [
    { 
      id: 101,
      name: "Avengers: Secret Wars", 
      date: "1 Mayıs 2026",
      image: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg", 
      desc: "Çoklu evrenin kaderi, kahramanlarımızın son savaşında belirlenecek.",
      trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c" // Avengers Endgame (Temsili)
    },
    { 
      id: 102,
      name: "The Batman Part II", 
      date: "2 Ekim 2026",
      image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", 
      desc: "Bruce Wayne, Gotham'ın karanlık sokaklarında yeni tehditlerle yüzleşiyor.",
      trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4" // The Batman (Temsili)
    },
    { 
      id: 103,
      name: "Star Wars: New Jedi Order", 
      date: "18 Aralık 2026",
      image: "https://image.tmdb.org/t/p/w500/db32LaOibwEliAmSL2jjDF6oDdj.jpg", 
      desc: "Rey Skywalker, Jedi Düzeni'ni yeniden kurmak için harekete geçiyor.",
      trailerUrl: "https://www.youtube.com/embed/8Qn_spdM5Zg" // Star Wars (Temsili)
    }
  ];

  return (
    <Box bg="#121212" minH="100vh" color="white" pb={10} overflowX="hidden">
      
      {/* 1. HERO SLIDER SECTION */}
      <Box position="relative" w="100%" h="70vh" overflow="hidden">
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            position="absolute" top="0" left="0" w="100%" h="100%"
            bgImage={`linear-gradient(to top, #121212 10%, rgba(0,0,0,0.3) 60%), url(${slide.image})`}
            bgSize="cover"
            bgPosition="center top"
            opacity={index === currentSlide ? 1 : 0}
            transition="opacity 1s ease-in-out"
            display="flex" alignItems="flex-end"
            zIndex={index === currentSlide ? 1 : 0}
          >
            <Box maxW="1200px" mx="auto" px={6} pb={16} w="100%">
              <Flex align="center" gap={3} mb={2}>
                <Badge colorScheme="red" fontSize="1em" px={3} py={1} borderRadius="md">TOP 5 VİZYON</Badge>
                <Flex align="center" color="yellow.400" bg="rgba(0,0,0,0.6)" px={2} borderRadius="md">
                  <Icon as={FaStar} mr={1} /> {slide.rating}
                </Flex>
              </Flex>
              <Heading size="4xl" mb={4} textShadow="0 4px 20px black" lineHeight="1.1">{slide.title}</Heading>
              <Text fontSize="xl" maxW="700px" mb={8} textShadow="0 2px 10px black" color="gray.200" fontWeight="light">{slide.desc}</Text>
              <Flex gap={4}>
                <Button size="lg" h="56px" bg="#e50914" color="white" _hover={{ bg: "#b20710", transform: "scale(1.05)" }} leftIcon={<FaTicketAlt />} onClick={() => navigate('/app/content/movie/detail/1')} boxShadow="0 0 20px rgba(229, 9, 20, 0.4)">Hemen Bilet Al</Button>
                
                {/* SLIDER FRAGMAN BUTONU */}
                <Button 
                  size="lg" h="56px" variant="outline" color="white" borderWidth="2px" leftIcon={<FaPlay />} 
                  _hover={{ bg: 'whiteAlpha.300', transform: "scale(1.05)" }}
                  onClick={() => handleOpenTrailer(slide.trailerUrl)}
                >
                  Fragmanı İzle
                </Button>
              </Flex>
            </Box>
          </Box>
        ))}
        <HStack position="absolute" bottom="30px" right="50px" spacing={3} zIndex={10}>
          {slides.map((_, idx) => (
            <Box key={idx} w={idx === currentSlide ? "30px" : "10px"} h="10px" bg={idx === currentSlide ? "#e50914" : "gray.500"} borderRadius="full" transition="all 0.3s" cursor="pointer" onClick={() => setCurrentSlide(idx)}/>
          ))}
        </HStack>
      </Box>

      {/* 2. ANA İÇERİK ALANI */}
      <Box maxW="1200px" mx="auto" px={6} mt={-10} position="relative" zIndex={5}>
        
        {/* Hızlı Kategori Seçimi */}
        <Heading size="lg" mb={6} borderLeft="5px solid #e50914" pl={4}>Ne İzlemek İstersin?</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={12}>
          <Box bg="gray.800" h="220px" borderRadius="2xl" position="relative" overflow="hidden" cursor="pointer" role="group" boxShadow="0 10px 30px rgba(0,0,0,0.5)" onClick={() => navigate('/app/content/movie')} transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: "0 20px 40px rgba(0,0,0,0.7)" }}>
            <Image src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80" w="100%" h="100%" objectFit="cover" opacity={0.5} transition="all 0.5s" _groupHover={{ transform: "scale(1.1)", opacity: 0.3 }}/>
            <Flex position="absolute" top="0" left="0" w="100%" h="100%" direction="column" justify="center" align="center" zIndex={2}>
              <Box p={4} bg="rgba(0,0,0,0.6)" borderRadius="full" mb={3} border="1px solid rgba(255,255,255,0.1)"><Icon as={FaFilm} w={10} h={10} color="#3182ce" /></Box>
              <Heading size="xl" letterSpacing="wider">SİNEMA</Heading>
              <Text color="gray.300" mt={1}>Vizyondaki En Yeni Filmler</Text>
            </Flex>
          </Box>
          <Box bg="gray.800" h="220px" borderRadius="2xl" position="relative" overflow="hidden" cursor="pointer" role="group" boxShadow="0 10px 30px rgba(0,0,0,0.5)" onClick={() => navigate('/app/content/theater')} transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: "0 20px 40px rgba(0,0,0,0.7)" }}>
            <Image src="https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=800&q=80" w="100%" h="100%" objectFit="cover" opacity={0.5} transition="all 0.5s" _groupHover={{ transform: "scale(1.1)", opacity: 0.3 }}/>
            <Flex position="absolute" top="0" left="0" w="100%" h="100%" direction="column" justify="center" align="center" zIndex={2}>
              <Box p={4} bg="rgba(0,0,0,0.6)" borderRadius="full" mb={3} border="1px solid rgba(255,255,255,0.1)"><Icon as={FaTheaterMasks} w={10} h={10} color="#e53e3e" /></Box>
              <Heading size="xl" letterSpacing="wider">TİYATRO</Heading>
              <Text color="gray.300" mt={1}>Sahnedeki Oyunlar</Text>
            </Flex>
          </Box>
        </SimpleGrid>

        {/* 3. YAKINDA GELECEKLER */}
        <Box bg="#1a1a1a" p={6} borderRadius="2xl" mb={10} borderTop="4px solid #F6E05E" boxShadow="dark-lg">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="md" color="white" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaCalendarAlt} color="yellow.400"/> Yakında Vizyona Girecekler (2026)
                </Heading>
                <Button size="sm" variant="ghost" colorScheme="yellow">Tüm Takvimi Gör</Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                {comingSoon2026.map((movie) => (
                    <Flex key={movie.id} bg="#252525" borderRadius="xl" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                        <Image src={movie.image} alt={movie.name} w="120px" h="180px" objectFit="cover"/>
                        <VStack align="start" justify="space-between" p={4} flex={1}>
                            <Box>
                              <Badge colorScheme="yellow" mb={2}>{movie.date}</Badge>
                              <Heading size="md" noOfLines={1} mb={2}>{movie.name}</Heading>
                              <Text fontSize="sm" color="gray.400" noOfLines={2}>{movie.desc}</Text>
                            </Box>
                            
                            {/* YAKINDAKİLER FRAGMAN BUTONU */}
                            <Button 
                              size="sm" variant="outline" colorScheme="yellow" leftIcon={<FaPlay />} w="100%"
                              onClick={() => handleOpenTrailer(movie.trailerUrl)}
                              _hover={{ bg: 'yellow.400', color: 'black' }}
                            >
                              Fragman İzle
                            </Button>
                        </VStack>
                    </Flex>
                ))}
            </SimpleGrid>
        </Box>

        {/* --- VIDEO MODAL (POPUP) --- */}
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
            <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0,0,0,0.8)" />
            <ModalContent bg="black" color="white">
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
    </Box>
  );
};

export default UserDashboard;