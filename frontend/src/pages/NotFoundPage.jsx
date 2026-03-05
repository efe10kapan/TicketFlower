// frontend/src/pages/NotFoundPage.jsx
import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, brand.400, brand.600)" backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Sayfa Bulunamadı
      </Text>
      <Text color={'gray.500'} mb={6}>
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </Text>

      <Button
        as={Link}
        to="/login"
        colorScheme="blue"
        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
        color="white"
        variant="solid">
        Giriş Sayfasına Dön
      </Button>
    </Box>
  );
};

export default NotFoundPage;