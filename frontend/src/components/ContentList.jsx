// frontend/src/components/ContentList.jsx

import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

const ContentList = () => {
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" color="gray.600">
        İçerik Listesi Yüklenecek...
      </Text>
      {/* Burada API'den gelen filmler ve tiyatrolar listelenecek */}
    </VStack>
  );
};

export default ContentList;