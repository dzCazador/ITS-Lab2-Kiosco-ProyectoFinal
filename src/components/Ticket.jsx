import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearTicket } from '../slices/ticketSlice';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography,CircularProgress } from '@mui/material';
import { addVenta } from '../slices/ventasSlice';

const Ticket = () => {
  const ticket = useSelector((state) => state.ticket);
  const [loading, setLoading] = useState(false); // Estado de carga
  const dispatch = useDispatch();

  const total = ticket.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleFinalizarTicket = async () => {
    if (ticket.length === 0) {
      alert("No hay productos en el ticket.");
      return;
    }

    const fechaHora = new Date().toISOString(); // Genera la fecha en formato ISO
    const items = ticket.map(item => ({
      nombreProducto: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    }));
    const nuevaVenta = {
      fechaHora,
      items,
    };
    // Mostrar el spinner
    setLoading(true);
     // Enviar la venta a la API
     try {
      // Enviar la venta a la API
      await dispatch(addVenta(nuevaVenta));

      // Limpiar el ticket después de guardarlo
      dispatch({ type: 'ticket/clearTicket' });

      //alert("Ticket finalizado y guardado con éxito.");
    } catch (error) {
      alert("Error al guardar la venta.");
    } finally {
      // Ocultar el spinner
      setLoading(false);
    }
  };

  
  return (
    <div>
      <Typography variant="h4">Ticket de Venta</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ticket.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.nombre}</TableCell>
              <TableCell>{item.cantidad}</TableCell>
              <TableCell>{item.precio.toFixed(2)}</TableCell>
              <TableCell>{(item.precio * item.cantidad).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => dispatch(removeItem(index))}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6">Total: {total.toFixed(2)}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFinalizarTicket}
        disabled={loading} // Deshabilitar el botón mientras carga
        startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null} // Mostrar spinner mientras carga
      >
        {loading ? "Finalizando..." : "Finalizar Ticket"}
      </Button>
    </div>
  );
};

export default Ticket;
