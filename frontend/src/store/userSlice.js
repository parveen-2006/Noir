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
    updateUser: (state, action) => {
      const index = state.list.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
});

export const { setUsers, addUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
