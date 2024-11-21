import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Acción para obtener las ventas desde la API
export const fetchVentas = createAsyncThunk('ventas/fetchVentas', async () => {
  const response = await axios.get('/sells');
  return response.data; // Asegúrate de que el formato de la respuesta sea adecuado
});

// Acción para agregar una venta a través de la API
export const addVenta = createAsyncThunk('ventas/addVenta', async (venta) => {
  const response = await axios.post('/sells', venta);
  return response.data;
});

const ventasSlice = createSlice({
  name: 'ventas',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVentas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // La respuesta de la API se guarda aquí
      })
      .addCase(fetchVentas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addVenta.fulfilled, (state, action) => {
        state.items.push(action.payload); // Agregar la nueva venta al estado
      });
  },
});

export default ventasSlice.reducer;
