import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],       // liste reçue de l API Express
    selected: null,  // publication ouverte sur la page détail
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {            // GET /posts
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelected: (state, action) => {         // GET /posts/:id
      state.selected = action.payload;
    },
    addPost: (state, action) => {             // POST /posts
      state.items.unshift(action.payload);
    },
    updatePost: (state, action) => {          // PUT /posts/:id
      state.items = state.items.map((p) => (p._id === action.payload._id ? action.payload : p));
      state.selected = action.payload;
    },
    removePost: (state, action) => {          // DELETE /posts/:id
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setPosts, setSelected, addPost, updatePost, removePost, setLoading, setError } = postsSlice.actions;
export default postsSlice.reducer;
