import React from 'react';
import { Flex, Button, Text, Box } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../../store/slices/authSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <Box
      position="fixed"
      top="0"
      right="0"
      left={{ base: 0, md: "240px" }}
      height="70px"
      zIndex="9999" // Her şeyin en üstünde olması için çok yüksek bir değer
      bg="white"
      borderBottom="2px solid red" // Görünürlüğü test etmek için kırmızı çerçeve
      display="flex"
      alignItems="center"
      px={10}
    >
      <Flex w="full" justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">TicketFlower</Text>
        
        <Flex alignItems="center" gap={4}>
          <Text fontWeight="bold">{user?.name}</Text>
          <Button 
            colorScheme="red" 
            onClick={onLogout}
            leftIcon={<FiLogOut />}
          >
            ÇIKIŞ YAP
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;