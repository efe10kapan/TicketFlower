import React, { useState } from 'react';
import { 
  Box, Heading, FormControl, FormLabel, Input, Select, Textarea, 
  Button, useToast, VStack, Container 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ContentAddPage = () => {
  const [type, setType] = useState('movie'); // 'movie' veya 'theater'
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    setLoading(true);
    
    // Burada normalde Backend API'ye POST isteği atılır.
    // Şimdilik LocalStorage'a eklemiş gibi yapalım veya sadece mesaj verelim.
    
    setTimeout(() => {
        toast({ title: "Başarılı", description: `${title} başarıyla eklendi!`, status: "success", duration: 2000 });
        setLoading(false);
        navigate('/app/admin'); // Panele geri dön
    }, 1500);
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <Heading size="lg" mb={6} color="purple.700">Yeni İçerik Ekle</Heading>
        
        <VStack spacing={5}>
            <FormControl>
                <FormLabel>İçerik Türü</FormLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="movie">Sinema Filmi</option>
                    <option value="theater">Tiyatro Oyunu</option>
                </Select>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Başlık</FormLabel>
                <Input placeholder="Örn: Hamlet veya Matrix" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Afiş URL (Resim Linki)</FormLabel>
                <Input placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />
            </FormControl>

            <FormControl>
                <FormLabel>Açıklama / Konu</FormLabel>
                <Textarea placeholder="İçerik hakkında bilgi..." value={desc} onChange={(e) => setDesc(e.target.value)} />
            </FormControl>

            <Button w="full" colorScheme="purple" size="lg" onClick={handleSave} isLoading={loading}>
                KAYDET VE YAYINLA
            </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ContentAddPage;