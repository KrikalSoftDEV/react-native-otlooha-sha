import {createSlice} from '@reduxjs/toolkit';

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    userData: null,
  },
  reducers: {
    setUserDetails: (state, action) => {
      console.log(action,'payload check')
      state.userData = action.payload;
    },
  },
});

export const { setUserDetails} = commonSlice.actions;
export default commonSlice.reducer;
