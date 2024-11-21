import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVentas } from '../slices/ventasSlice';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { format } from 'date-fns';

const VentasDia = () => {
  const dispatch = useDispatch();
  const { items: ventas, status, error } = useSelector((state) => state.ventas);

  const [openModal, setOpenModal] = useState(false);  // Estado para abrir/cerrar el modal
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);  // Estado para la venta seleccionada para mostrar en el modal


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVentas());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography>{error}</Typography>;

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const getFechaSolo = (fecha) => {
    return format(new Date(fecha), 'yyyy-MM-dd'); // Obtiene la fecha en formato 'yyyy-MM-dd'
  };

  // Función para obtener la fecha de hoy
  const getFechaHoy = () => {
    return format(new Date(), 'yyyy-MM-dd'); // Obtiene la fecha de hoy en formato 'yyyy-MM-dd'
  };

  // Filtrar las ventas para mostrar solo las de hoy
  const ventasDeHoy = ventas.filter(venta => getFechaSolo(venta.fechaHora) === getFechaHoy());

    // Función para abrir el modal con los detalles de la venta
    const handleAbrirModal = (venta) => {
      setVentaSeleccionada(venta);
      setOpenModal(true);
    };
  
    // Función para cerrar el modal
    const handleCerrarModal = () => {
      setOpenModal(false);
      setVentaSeleccionada(null);
    };


  return (
    <div>
      <Typography variant="h4">Ventas del Día</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha y Hora</TableCell>
            <TableCell>Importe Total</TableCell>
            <TableCell>Detalle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventasDeHoy.slice().reverse().map((venta, index) => (
            <TableRow key={index}>
              <TableCell>{formatFecha(venta.fechaHora)}</TableCell>
              <TableCell>{parseFloat(venta.total).toFixed(2)}</TableCell> {/* Convertir total a número */}
              <TableCell>
                  <Button variant="outlined" onClick={() => handleAbrirModal(venta)}>
                    Ver Detalle
                  </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para mostrar el detalle de la venta */}
      <Dialog open={openModal} onClose={handleCerrarModal}>
        <DialogTitle>Detalle de la Venta</DialogTitle>
        <DialogContent>
          {ventaSeleccionada && (
            <>
              <Typography variant="h6">Fecha: {new Date(ventaSeleccionada.fechaHora).toLocaleString()}</Typography>
              <Typography variant="h6">Items:</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventaSeleccionada.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombreProducto}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell>{item.precioUnitario}</TableCell>
                      <TableCell>{(item.precioUnitario * item.cantidad)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>      
    </div>
  );
};

export default VentasDia;
