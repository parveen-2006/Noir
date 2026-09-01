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
    updateRole: (state, action) => {
      const index = state.list.findIndex((role) => role.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    removeRole: (state, action) => {
      state.list = state.list.filter((role) => role.id !== action.payload);
    },
  },
});

export const { setRoles, addRole, updateRole, removeRole } = roleSlice.actions;
export default roleSlice.reducer;
