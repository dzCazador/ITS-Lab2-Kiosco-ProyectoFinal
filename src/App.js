import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProductos } from './slices/productosSlice';
import { fetchVentas } from './slices/ventasSlice';
import { Container, Typography,Box } from '@mui/material';
import Ticket from './components/Ticket';
import VentasDia from './components/VentasDia';
import BuscarProducto from './components/BuscarProducto';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductos());
    dispatch(fetchVentas());
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>Kiosko Juanita</Typography>
      <Box mt={4}>
        <BuscarProducto />
      </Box>
      <Box mt={6}>
        <Ticket />
      </Box>
      <Box mt={6} mb={4}>
        <VentasDia />
      </Box>
    </Container>
  );
}

export default App;
