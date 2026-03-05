import React, { useState, useEffect } from 'react';
import { 
  Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Heading, Flex, Button, Icon, Text, 
  Tabs, TabList, TabPanels, Tab, TabPanel, Progress, Card, CardBody, Avatar, Divider, Badge, useToast, Table, Thead, Tbody, Tr, Th, Td,
  GridItem, Grid, Tooltip, CircularProgress, CircularProgressLabel,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { 
  FaMoneyBillWave, FaChartPie, FaTheaterMasks, FaFilm, FaGem, FaArrowRight, FaHistory, 
  FaBoxOpen, FaThermometerHalf, FaServer, FaWifi, FaUserSecret, FaBrain, FaClock, FaExclamationTriangle
} from 'react-icons/fa';

// --- GERÇEK FİLM VE OYUN İSİMLERİ ---
const MOVIE_NAMES = [
  "Oppenheimer", "Avatar: Suyun Yolu", "John Wick 4", "Barbie", "Hızlı ve Öfkeli 10", 
  "Mission Impossible 7", "Dune: Çöl Gezegeni", "Örümcek Adam", "Joker 2", "Batman",
  "Interstellar", "Inception", "Matrix 4", "Godfather", "Pulp Fiction",
  "Fight Club", "Gladyatör", "Titanik", "Yüzüklerin Efendisi", "Harry Potter"
];

const PLAY_NAMES = [
  "Hamlet", "Cimri", "Amadeus", "Lüküs Hayat", "Kürk Mantolu Madonna",
  "Godot'yu Beklerken", "Bir Delinin Hatıra Defteri", "Macbeth", "Kel Şarkıcı", "Kanlı Nigar",
  "Romeo ve Juliet", "Othello", "Sefiller", "Fareler ve İnsanlar", "Don Kişot",
  "Kral Lear", "Fırtına", "Operadaki Hayalet", "Aslan Kral", "Martı"
];

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  
  // Stok Modalı için
  const { isOpen: isStockOpen, onOpen: onStockOpen, onClose: onStockClose } = useDisclosure();

  // Tab Yönetimi
  const tabParam = searchParams.get('tab');
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  // Veriler
  const [revenue, setRevenue] = useState({ total: 0, cinema: 0, theater: 0 });
  const [transactions, setTransactions] = useState([]);
  const [reports, setReports] = useState([]);
  const [stockData, setStockData] = useState({ corn: 8000, drink: 25000, snack: 50000 });

  // Sistem Sağlığı (Daha Detaylı)
  const [systemHealth, setSystemHealth] = useState([
    { id: 1, name: "IMAX Projeksiyon", status: "ok", detail: "4K Lazer Aktif" },
    { id: 2, name: "Salon 2 Ses", status: "warning", detail: "Subwoofer Isınıyor" },
    { id: 3, name: "Büyük Sahne Işık", status: "ok", detail: "Tüm Spotlar Aktif" },
    { id: 4, name: "Ana Sunucu", status: "ok", detail: "Yük: %34 - Stabil" }
  ]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || "{}");
  const isBoss = currentUser.storeId === 'BOSS' || currentUser.type === 'super';
  const bossName = isBoss ? "BOSS" : currentUser.name;

  useEffect(() => {
    // 1. Sekme Senkronizasyonu
    if (tabParam === 'finance') setActiveTabIdx(0);
    else if (tabParam === 'ops') setActiveTabIdx(1);
    else if (tabParam === 'reports') setActiveTabIdx(2);

    // 2. Ciro Hesaplama
    const baseRevenue = 52000000; 
    const fluctuation = Math.floor(Math.random() * 5000000) - 2500000; 
    setRevenue({ 
        total: baseRevenue + fluctuation, 
        cinema: (baseRevenue + fluctuation) * 0.65, 
        theater: (baseRevenue + fluctuation) * 0.35 
    });

    // 3. Stok Simülasyonu (Her yenilemede düşer)
    const savedStock = JSON.parse(localStorage.getItem('admin_stock'));
    if (savedStock) {
        // Tüketim yap
        const newStock = {
            corn: savedStock.corn - Math.floor(Math.random() * 50),
            drink: savedStock.drink - Math.floor(Math.random() * 100),
            snack: savedStock.snack - Math.floor(Math.random() * 80)
        };
        setStockData(newStock);
        localStorage.setItem('admin_stock', JSON.stringify(newStock));
    } else {
        // İlk açılış
        const initial = { corn: 7800, drink: 22102, snack: 47100 };
        setStockData(initial);
        localStorage.setItem('admin_stock', JSON.stringify(initial));
    }

    // 4. Raporları Çek
    setReports(JSON.parse(localStorage.getItem('admin_reports') || "[]"));

  }, [tabParam]);

  // CANLI AKIŞ (MATRIX)
  useEffect(() => {
    if (activeTabIdx !== 1) return; 
    const names = ["Ahmet", "Selin", "Mehmet", "Ayşe", "Can", "Zeynep", "Burak"];
    
    const interval = setInterval(() => {
      const randomTarget = Math.random() > 0.5 
        ? MOVIE_NAMES[Math.floor(Math.random() * MOVIE_NAMES.length)]
        : PLAY_NAMES[Math.floor(Math.random() * PLAY_NAMES.length)];

      const newTx = {
        id: Date.now(),
        user: names[Math.floor(Math.random() * names.length)],
        action: "Bilet Aldı",
        target: randomTarget,
        amount: `+${Math.floor(Math.random() * 500) + 100} ₺`,
        time: new Date().toLocaleTimeString(),
        color: "green.400"
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 10));
    }, 800);
    return () => clearInterval(interval);
  }, [activeTabIdx]);

  // GÜNÜN ÖZETİ
  const handleDailySummary = () => {
    const today = new Date().toLocaleDateString('tr-TR');
    const newReport = {
        id: Date.now(),
        date: today,
        revenue: revenue.total,
        status: "Arşivlendi"
    };
    const updated = [newReport, ...reports];
    localStorage.setItem('admin_reports', JSON.stringify(updated));
    setReports(updated);
    toast({ title: "Rapor Oluşturuldu", status: "success" });
  };

  // --- 1. GÖRÜNÜM: HOŞGELDİN EKRANI ---
  if (!tabParam) {
    return (
        <Flex 
            bg="black" minH="100vh" align="center" justify="center" direction="column" 
            bgImage="url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')"
            bgBlendMode="overlay" bgSize="cover"
        >
            <Box textAlign="center" p={10} bg="rgba(0,0,0,0.85)" borderRadius="2xl" border="1px solid #333" backdropFilter="blur(20px)" boxShadow="0 0 50px rgba(0,0,0,0.8)">
                <Avatar size="2xl" src="https://cdn-icons-png.flaticon.com/512/1042/1042390.png" mb={6} border="4px solid gold" />
                <Heading size="3xl" color="white" mb={2} letterSpacing="wider">HOŞ GELDİN, BOSS</Heading>
                <Text color="gray.400" fontSize="xl" mb={8}>Sistemler aktif ve emirlerinizi bekliyor.</Text>
                <Button 
                    size="lg" height="70px" width="280px" fontSize="xl" colorScheme="yellow" 
                    onClick={handleDailySummary} rightIcon={<FaArrowRight />}
                    _hover={{ transform: "scale(1.05)", boxShadow: "0 0 25px gold" }}
                >
                    GÜNÜN ÖZETİNİ AL
                </Button>
            </Box>
        </Flex>
    );
  }

  // --- 2. GÖRÜNÜM: DASHBOARD SEKMELERİ ---
  return (
    <Box p={6} bg="#050505" minH="100vh" color="white" fontFamily="'Segoe UI', sans-serif">
      
      <Flex align="center" gap={4} mb={8} borderBottom="1px solid #222" pb={4}>
         <Icon as={FaGem} color="yellow.400" w={8} h={8}/>
         <Heading size="lg" color="white">Komuta Merkezi</Heading>
         <Badge colorScheme="purple" fontSize="0.8em" p={1} borderRadius="md">V.3.2</Badge>
      </Flex>

      <Tabs index={activeTabIdx} onChange={setActiveTabIdx} variant="solid-rounded" colorScheme="yellow" isLazy>
        <TabList mb={6} gap={2}>
            <Tab _selected={{ bg: "yellow.400", color: "black" }} color="gray.500" fontWeight="bold">📊 Ciro & Grafikler</Tab>
            <Tab _selected={{ bg: "cyan.600", color: "white" }} color="gray.500" fontWeight="bold">⚙️ Operasyon (Komuta)</Tab>
            <Tab _selected={{ bg: "green.600", color: "white" }} color="gray.500" fontWeight="bold">📂 Raporlar</Tab>
        </TabList>

        <TabPanels>
            
            {/* --- SEKME 1: CİRO & GRAFİKLER --- */}
            <TabPanel px={0}>
                {/* AI ANALİST */}
                <Box mb={8} p={4} bgGradient="linear(to-r, purple.900, blue.900)" borderRadius="xl" border="1px solid" borderColor="purple.500" display="flex" alignItems="center" gap={4}>
                    <Icon as={FaBrain} w={10} h={10} color="purple.200" />
                    <Box>
                        <Text fontWeight="bold" color="purple.100">AI Analisti:</Text>
                        <Text fontSize="sm" color="gray.300">"Patron, 'John Wick 4' bilet satışları %20 arttı. Ancak Salon 2 ses sisteminde ısı artışı var, teknik ekibi uyarmanızı öneririm."</Text>
                    </Box>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                    <StatCard title="Toplam Ciro" value={`${(revenue.total/1000000).toFixed(2)} M ₺`} icon={FaMoneyBillWave} color="green" />
                    <StatCard title="Sinema" value={`${(revenue.cinema/1000000).toFixed(2)} M ₺`} icon={FaFilm} color="blue" />
                    <StatCard title="Tiyatro" value={`${(revenue.theater/1000000).toFixed(2)} M ₺`} icon={FaTheaterMasks} color="red" />
                </SimpleGrid>

                {/* BÜFE GRAFİKLERİ */}
                <Box bg="gray.900" p={6} borderRadius="xl" border="1px solid #333" mb={8}>
                    <Heading size="md" mb={6} color="orange.300">🍿 Büfe Satış Dağılımı</Heading>
                    <SimpleGrid columns={3} spacing={10} textAlign="center">
                        <DonutChart value={75} label="Patlamış Mısır" color="yellow.400" />
                        <DonutChart value={45} label="İçecekler" color="blue.400" />
                        <DonutChart value={30} label="Menü/Combo" color="red.400" />
                    </SimpleGrid>
                </Box>

                {/* FİLM & TİYATRO ÇUBUK GRAFİKLERİ (GERÇEK İSİMLERLE) */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    <BarChartBox title="🎬 Vizyondaki Filmler (Top 20)" color="blue" data={MOVIE_NAMES} />
                    <BarChartBox title="🎭 Sahnedeki Oyunlar (Top 20)" color="red" data={PLAY_NAMES} />
                </SimpleGrid>
            </TabPanel>

            {/* --- SEKME 2: OPERASYON (KOMUTA MERKEZİ) --- */}
            <TabPanel px={0}>
                <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={8}>
                    
                    {/* SOL: CANLI AKIŞ (MATRIX) */}
                    <GridItem>
                        <Box bg="black" p={4} borderRadius="xl" border="1px solid #333" h="600px" overflow="hidden" position="relative">
                            <Heading size="sm" mb={4} color="green.400" fontFamily="monospace">>> CANLI_AKIS.EXE</Heading>
                            <Box>
                                {transactions.map(tx => (
                                    <Flex key={tx.id} justify="space-between" mb={2} color="green.500" fontFamily="monospace" fontSize="xs">
                                        <Text>[{tx.time}] {tx.action} - {tx.target}</Text>
                                        <Text>{tx.amount}</Text>
                                    </Flex>
                                ))}
                            </Box>
                        </Box>
                    </GridItem>

                    {/* SAĞ: TEKNİK PANEL */}
                    <GridItem>
                        <SimpleGrid columns={2} spacing={6} mb={6}>
                            {/* SİSTEM SAĞLIĞI (GÜNCELLENDİ) */}
                            <Box bg="gray.900" p={5} borderRadius="xl" border="1px solid #333">
                                <Flex align="center" gap={2} mb={4}><Icon as={FaServer} color="cyan.400"/><Heading size="sm">Sistem Sağlığı</Heading></Flex>
                                <SimpleGrid columns={1} spacing={3}>
                                    {systemHealth.map(s => (
                                        <Box key={s.id} p={2} bg={s.status === 'ok' ? 'green.900' : 'orange.900'} borderRadius="md">
                                            <Flex justify="space-between">
                                                <Text fontSize="xs" color="gray.300" fontWeight="bold">{s.name}</Text>
                                                <Badge colorScheme={s.status === 'ok' ? 'green' : 'orange'}>{s.status === 'ok' ? 'AKTİF' : 'UYARI'}</Badge>
                                            </Flex>
                                            <Text fontSize="xs" color="gray.400" mt={1}>{s.detail}</Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </Box>

                            {/* STOK DURUMU (TIKLANABİLİR) */}
                            <Box 
                                bg="gray.900" p={5} borderRadius="xl" border="1px solid #333" 
                                cursor="pointer" _hover={{ borderColor: "orange.400" }} onClick={onStockOpen}
                            >
                                <Flex align="center" gap={2} mb={4}>
                                    <Icon as={FaBoxOpen} color="orange.400"/><Heading size="sm">Depo & Stok</Heading>
                                    <Badge colorScheme="purple">DETAY</Badge>
                                </Flex>
                                <VStackSpacing label="🍿 Mısır Stoğu" value={Math.floor((stockData.corn / 8000) * 100)} color="red" />
                                <VStackSpacing label="🥤 İçecek" value={Math.floor((stockData.drink / 25000) * 100)} color="blue" />
                                <VStackSpacing label="🍫 Atıştırmalık" value={Math.floor((stockData.snack / 50000) * 100)} color="green" />
                            </Box>
                        </SimpleGrid>

                        {/* ISI HARİTASI */}
                        <Box bg="gray.900" p={5} borderRadius="xl" border="1px solid #333" mb={6}>
                             <Flex align="center" gap={2} mb={4}><Icon as={FaTheaterMasks} color="purple.400"/><Heading size="sm">Salon 1 (IMAX) - Anlık Isı Haritası</Heading></Flex>
                             <SimpleGrid columns={20} spacing={1}>
                                {Array.from({length: 100}).map((_, i) => (
                                    <Box key={i} w="100%" h="10px" bg={Math.random() > 0.3 ? "red.600" : "gray.700"} borderRadius="xs" opacity={0.8} />
                                ))}
                             </SimpleGrid>
                             <Text fontSize="xs" color="gray.500" mt={2} textAlign="right">%85 Doluluk Oranı</Text>
                        </Box>

                        {/* GELECEK SEANSLAR */}
                        <Box bg="gray.900" p={5} borderRadius="xl" border="1px solid #333">
                             <Flex align="center" gap={2} mb={4}><Icon as={FaClock} color="white"/><Heading size="sm">Gelecek Seanslar</Heading></Flex>
                             <Box>
                                <NextUpItem time="15:30" title="Avatar 2" hall="Salon 1" status="Başlıyor" color="green" />
                                <NextUpItem time="16:00" title="Hamlet" hall="Büyük Sahne" status="Kapı Açık" color="yellow" />
                                <NextUpItem time="16:15" title="Oppenheimer" hall="Salon 3" status="Temizlik" color="blue" />
                             </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </TabPanel>

            {/* --- SEKME 3: RAPORLAR --- */}
            <TabPanel>
                <Box bg="gray.900" p={6} borderRadius="xl" border="1px solid #333">
                    <Heading size="md" mb={6} color="green.300">Arşivlenmiş Günlük Raporlar</Heading>
                    <Table variant="simple" size="sm">
                        <Thead><Tr><Th color="gray.500">Tarih</Th><Th color="gray.500" isNumeric>Ciro</Th><Th color="gray.500">Durum</Th></Tr></Thead>
                        <Tbody>
                            {reports.map((r) => (
                                <Tr key={r.id} _hover={{ bg: "whiteAlpha.100" }}>
                                    <Td>{r.date}</Td>
                                    <Td isNumeric color="green.300">{(r.revenue/1000000).toFixed(2)} M ₺</Td>
                                    <Td><Badge colorScheme="green">Arşiv</Badge></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </TabPanel>

        </TabPanels>
      </Tabs>

      {/* --- STOK DETAY PENCERESİ (MODAL) --- */}
      <Modal isOpen={isStockOpen} onClose={onStockClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="gray.900" color="white" border="1px solid #444">
            <ModalHeader borderBottom="1px solid #333">Depo ve Stok Durumu</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
                <SimpleGrid columns={2} spacing={6}>
                    <Box p={4} bg="blackAlpha.500" borderRadius="lg" border="1px solid #333">
                        <Text color="gray.400" fontSize="sm">🍿 Patlamış Mısır</Text>
                        <Heading size="lg" color="yellow.400">{stockData.corn.toLocaleString()} <Text as="span" fontSize="sm" color="gray.500">Adet</Text></Heading>
                    </Box>
                    <Box p={4} bg="blackAlpha.500" borderRadius="lg" border="1px solid #333">
                        <Text color="gray.400" fontSize="sm">🥤 İçecekler</Text>
                        <Heading size="lg" color="blue.400">{stockData.drink.toLocaleString()} <Text as="span" fontSize="sm" color="gray.500">Adet</Text></Heading>
                    </Box>
                    <Box p={4} bg="blackAlpha.500" borderRadius="lg" border="1px solid #333">
                        <Text color="gray.400" fontSize="sm">🍫 Atıştırmalıklar</Text>
                        <Heading size="lg" color="green.400">{stockData.snack.toLocaleString()} <Text as="span" fontSize="sm" color="gray.500">Adet</Text></Heading>
                    </Box>
                    <Box p={4} bg="red.900" borderRadius="lg" border="1px solid red">
                        <Flex align="center" gap={2}>
                            <Icon as={FaExclamationTriangle} color="red.200"/>
                            <Text color="red.200" fontWeight="bold">Kritik Stok Uyarısı</Text>
                        </Flex>
                        <Text fontSize="xs" mt={2} color="red.100">Pipet stoğu kritik seviyenin altında (500 adet).</Text>
                    </Box>
                </SimpleGrid>
            </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

// --- YARDIMCI KOMPONENTLER ---
const StatCard = ({ title, value, subValue, icon, color }) => (
    <Card bg="gray.900" borderTop="4px solid" borderColor={`${color}.500`} boxShadow="lg">
        <CardBody>
            <Stat>
                <Flex align="center" gap={3} mb={1}>
                    <Icon as={icon} color={`${color}.400`} w={6} h={6}/>
                    <StatLabel color="gray.400">{title}</StatLabel>
                </Flex>
                <StatNumber color="white" fontSize="2xl">{value}</StatNumber>
            </Stat>
        </CardBody>
    </Card>
);

const DonutChart = ({ value, label, color }) => (
    <Box position="relative" display="inline-flex" flexDirection="column" alignItems="center">
        <CircularProgress value={value} color={color} size="100px" thickness="12px">
            <CircularProgressLabel color="white" fontWeight="bold">%{value}</CircularProgressLabel>
        </CircularProgress>
        <Text fontSize="sm" color="gray.400" mt={2}>{label}</Text>
    </Box>
);

const BarChartBox = ({ title, color, data }) => (
    <Box bg="gray.900" p={5} borderRadius="xl" border="1px solid #333" h="350px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: '#555' } }}>
        <Heading size="sm" mb={4} color="gray.300">{title}</Heading>
        {data.map((item, i) => {
            const val = Math.floor(Math.random() * 60) + 40; // %40-%100 arası rastgele
            return (
                <Flex key={i} align="center" mb={3} gap={3}>
                    <Text fontSize="xs" w="20px" color="gray.500">{i+1}.</Text>
                    <Text fontSize="xs" w="120px" color="gray.300" noOfLines={1}>{item}</Text>
                    <Box flex="1" h="8px" bg="gray.800" borderRadius="full">
                        <Box w={`${val}%`} h="100%" bg={`${color}.500`} borderRadius="full" />
                    </Box>
                    <Text fontSize="xs" w="30px" color="gray.400">{val}%</Text>
                </Flex>
            )
        })}
    </Box>
);

const VStackSpacing = ({ label, value, color }) => (
    <Box mb={3}>
        <Flex justify="space-between" mb={1}><Text fontSize="xs" color="gray.400">{label}</Text><Text fontSize="xs" fontWeight="bold" color={`${color}.300`}>{value}%</Text></Flex>
        <Progress value={value} size="xs" colorScheme={color} borderRadius="full" bg="gray.800" />
    </Box>
);

const NextUpItem = ({ time, title, hall, status, color }) => (
    <Flex justify="space-between" p={2} borderBottom="1px solid #222" align="center">
        <Flex gap={3} align="center">
            <Text color="white" fontWeight="bold" fontSize="sm">{time}</Text>
            <Box><Text color="gray.300" fontSize="sm">{title}</Text><Text color="gray.600" fontSize="xs">{hall}</Text></Box>
        </Flex>
        <Badge colorScheme={color} fontSize="0.7em">{status}</Badge>
    </Flex>
);

export default AdminDashboard;