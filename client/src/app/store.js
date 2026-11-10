import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";

// Le "coffre" Redux : un tiroir (slice) par fonctionnalité
export const store = configureStore({
  reducer: {
    auth: authReducer,         // utilisateur connecté + token JWT
    posts: postsReducer,       // liste des publications + publication ouverte
    comments: commentsReducer, // commentaires de la publication ouverte
  },
});
