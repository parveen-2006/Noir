import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.list = action.payload;
    },
    addUser: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
});

export const { setUsers, addUser } = userSlice.actions;
export default userSlice.reducer;
