import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: [],
  reducers: {
    addItem: (state, action) => [...state, action.payload],
    removeItem: (state, action) => state.filter((_, index) => index !== action.payload),
    clearTicket: () => [],
  },
});

export const { addItem, removeItem, clearTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
