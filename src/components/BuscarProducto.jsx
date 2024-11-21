import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProducto } from '../slices/productosSlice';
import { addItem } from '../slices/ticketSlice';
import { TextField, Button, Typography, Box,CircularProgress,List, ListItem,ListItemText } from '@mui/material';
import axios from '../api/axios';

const BuscarProducto = () => {
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState('');
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [precioNuevo, setPrecioNuevo] = useState('');
  const [cantidadNueva, setCantidadNueva] = useState(1);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [mostrarFormularioNuevoProducto, setMostrarFormularioNuevoProducto] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Estado para los productos filtrados


  const productos = useSelector((state) => state.productos.items);
  const dispatch = useDispatch();

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    setNombreNuevo(texto);
    setMostrarFormularioNuevoProducto(false);
    const resultado = productos.filter((producto) =>
      producto.name.toLowerCase().includes(texto.toLowerCase()) && texto !== ''
    );
    if (resultado.length > 0) {
      if (resultado.length === 1) {
        handleSeleccionarProducto(resultado[0]); // Si es uno solo seleccionarlo
      }
      else {
        setProductosFiltrados(resultado); // Mostrar los productos filtrados si hay coincidencias
      }
    } else {
      setProductosFiltrados([]);
      setMostrarFormularioNuevoProducto(true); // Si no hay coincidencias, mostrar el formulario para agregar un nuevo producto
    }
  };

    // Seleccionar un producto de la lista filtrada
    const handleSeleccionarProducto = (producto) => {
      setSelectedProducto(producto);
      //setBusqueda(producto.name); // Autocompletar el campo de búsqueda con el nombre del producto seleccionado
      setPrecio(producto.price); // Asignar el precio del producto seleccionado
      setProductosFiltrados([]); // Limpiar la lista de productos filtrados
    };

  const handleAgregarProducto = async() => {
    setLoading(true);
    try {
      // Enviar la venta a la API
      await dispatch(
        addItem({
          nombre: selectedProducto.name,
          cantidad: parseInt(cantidad),
          precio: parseFloat(precio),
        })
      );
      setSelectedProducto(null);
      setBusqueda('');
      setCantidad(1);
      setPrecio('');
    } catch (error) {
      alert("Error al guardar la venta.");
    } finally {
      // Ocultar el spinner
      setLoading(false);
    }      
  };

  const handleAgregarNuevoProducto = async () => {
    setLoading(true);

    const nuevoProducto = {
      id: productos.length + 1, // Generar un nuevo ID
      name: nombreNuevo,
      price: parseFloat(precioNuevo),
      quantity: parseInt(cantidadNueva),
      provider: 'Desconocido', // Se puede ajustar según los datos requeridos
    };

    try {
      await axios.post('/products', nuevoProducto); // Asume que tienes un endpoint POST para agregar productos
      dispatch(addProducto(nuevoProducto));
      dispatch(
        addItem({
          nombre: nombreNuevo,
          cantidad: parseInt(cantidadNueva),
          precio: parseFloat(precioNuevo),
        })
      );
      setBusqueda('');
      setNombreNuevo('');
      setPrecioNuevo('');
      setCantidadNueva(1);
      setMostrarFormularioNuevoProducto(false);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
    finally {
      // Ocultar el spinner
      setLoading(false);
    }    
  };

  return (
    <div>
      <TextField
        label="Buscar producto"
        variant="outlined"
        value={busqueda}
        onChange={(e) => handleBuscar(e.target.value)}
        fullWidth
      />

      {productosFiltrados.length > 0 && (
              <List>
                {productosFiltrados.map((producto) => (
                  <ListItem
                    button
                    key={producto.id}
                    onClick={() => handleSeleccionarProducto(producto)}
                  >
                    <ListItemText primary={producto.name} secondary={`Precio: ${producto.price}`} />
                  </ListItem>
                ))}
              </List>
            )}

      {selectedProducto && (
        <Box mt={4}>
          <Typography variant="h6">Producto: {selectedProducto.name}</Typography>
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button onClick={handleAgregarProducto} variant="contained" color="primary" sx={{ mt: 2 }}>Agregar al Ticket</Button>
        </Box>
      )}

      {mostrarFormularioNuevoProducto && (
        <Box mt={2}>
          <Typography variant="h6">Producto no encontrado. ¿Quieres agregarlo?</Typography>
          <TextField
            label="Nombre del Producto"
            value={nombreNuevo}
            onChange={(e) => setNombreNuevo(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Precio"
            type="number"
            value={precioNuevo}
            onChange={(e) => setPrecioNuevo(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Cantidad"
            type="number"
            value={cantidadNueva}
            onChange={(e) => setCantidadNueva(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button onClick={handleAgregarNuevoProducto} variant="contained" color="primary" sx={{ mt: 2 }}
          disabled={loading} // Deshabilitar el botón mientras carga
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null} // Mostrar spinner mientras carga
          >
               {loading ? "Agregando..." : "Agregar Nuevo Producto"}
            </Button>
        </Box>
      )}
    </div>
  );
};

export default BuscarProducto;
