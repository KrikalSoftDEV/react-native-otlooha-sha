import {createSlice} from '@reduxjs/toolkit';
import { getUserProfile } from './userSlice';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    globalToken: null,
    userInfo: null,
    guestInfo:null
  },
  reducers: {
    setGlobalToken: (state, action) => {
      state.globalToken = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
      setGuestInfo: (state, action) => {
      state.guestInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      if (action.payload?.data?.status === 1) {
        state.userInfo = action.payload.data.result;
      }
    });
  },
});

export const {setGlobalToken, setUserInfo,setGuestInfo} = appSlice.actions;
export default appSlice.reducer;
