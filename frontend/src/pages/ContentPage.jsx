// frontend/src/pages/ContentPage.jsx
import { Box, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const ContentPage = () => {
  // URL'den (App.jsx'teki rotadan) tipi alıyoruz: /app/content/Film veya /app/content/Tiyatro
  const { type } = useParams(); 

  // URL'deki parametreye göre başlık oluşturma
  const title = type === 'Film' ? 'Dizi/Film Biletleri' : 'Tiyatro Oyunları Biletleri';

  return (
    <Box p={5}>
      <Heading size="xl" mb={4} color="brand.900">
        {title}
      </Heading>
      <Text fontSize="lg" color="gray.600">
        {type} kategorisine ait tüm aktif gösterimleri aşağıda inceleyebilirsiniz.
      </Text>
      
      {/* Burada ContentList bileşeni gösterilecek */}
      {/* ContentList type={type} */}
      <Text mt={10} fontStyle="italic"> (İçerikler yakında burada listelenecek...) </Text>
    </Box>
  );
};

export default ContentPage;