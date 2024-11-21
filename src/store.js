import { configureStore } from '@reduxjs/toolkit';
import productosReducer from './slices/productosSlice';
import ticketReducer from './slices/ticketSlice';
import ventasReducer from './slices/ventasSlice';

const store = configureStore({
  reducer: {
    productos: productosReducer,
    ticket: ticketReducer,
    ventas: ventasReducer,
  },
});

export default store;
