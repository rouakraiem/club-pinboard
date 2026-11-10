import { createSlice } from "@reduxjs/toolkit";

// Lecture sécurisée de localStorage (évite un crash si la valeur est corrompue)
const readUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readUser(),                     // session restaurée au chargement
    token: localStorage.getItem("token"),
  },
  reducers: {
    // Après /auth/login ou /auth/register : ranger user + token (Redux + localStorage)
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    // Déconnexion : vider Redux + localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user; // sélecteur réutilisable
export default authSlice.reducer;
