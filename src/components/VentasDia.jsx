import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVentas } from '../slices/ventasSlice';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { format } from 'date-fns';

const VentasDia = () => {
  const dispatch = useDispatch();
  const { items: ventas, status, error } = useSelector((state) => state.ventas);

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


  return (
    <div>
      <Typography variant="h4">Ventas del Día</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha y Hora</TableCell>
            <TableCell>Importe Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ventasDeHoy.slice().reverse().map((venta, index) => (
            <TableRow key={index}>
              <TableCell>{formatFecha(venta.fechaHora)}</TableCell>
              <TableCell>{parseFloat(venta.total).toFixed(2)}</TableCell> {/* Convertir total a número */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VentasDia;
