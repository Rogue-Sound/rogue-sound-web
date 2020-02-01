import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: false,
  current: {},
  queue: [],
};

const playingSlice = createSlice({
  name: 'playing',
  initialState,
  reducers: {
    setCurrent: (state, action) => ({
      ...state,
      current: action.payload,
    }),
    setQueue: (state, action) => ({
      ...state,
      queue: action.payload,
    }),
    stop: () => initialState,
  },
});

export const { setCurrent, setQueue, stop } = playingSlice.actions;

export default playingSlice.reducer;
