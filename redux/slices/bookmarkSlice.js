import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmarks: [],
  surahList:[]
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    saveBookmarklist:   (state, action) => {
      const data=[ ...state.bookmarks,action.payload]
      console.log(data,'log in bookmark redux')
      state.bookmarks = data;
    },
      saveSurahList:   (state, action) => {
         console.log(data,'chekc this call')
      state.surahList = action.payload;
    },
    // removeBookmark: (state, action) => {
    //   state.bookmarks = state.bookmarks.filter(item => item.number !== action.payload);
    // },
  },
});

export const { saveBookmarklist, removeBookmark,saveSurahList } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
