import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: { items: [] }, // commentaires de la publication ouverte
  reducers: {
    setComments: (state, action) => { state.items = action.payload; },
    addComment: (state, action) => { state.items.push(action.payload); },
    removeComment: (state, action) => {
      state.items = state.items.filter((c) => c._id !== action.payload);
    },
    clearComments: (state) => { state.items = []; },
  },
});

export const { setComments, addComment, removeComment, clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
