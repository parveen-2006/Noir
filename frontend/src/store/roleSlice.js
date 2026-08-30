import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setRoles: (state, action) => {
      state.list = action.payload;
    },
    addRole: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
});

export const { setRoles, addRole } = roleSlice.actions;
export default roleSlice.reducer;
