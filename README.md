# Le Tableau – MERN + Redux Toolkit (club étudiant)

Stack : MongoDB Atlas · Express · React 18 (Vite) · Node.js · Redux Toolkit · JWT · bcrypt · Axios

## Architecture
    server/
      server.js            point d entrée (CORS, JSON, connexion Mongo)
      models/              User, Post, Comment (Mongoose, relations 1->N via ref)
      routes/              auth, posts (GET/POST/PUT/DELETE), comments
      middleware/auth.js   sentinelle JWT "protect"
    client/src/
      app/store.js         configureStore : auth + posts + comments
      api/                 axiosClient (intercepteur JWT) + services par ressource
      features/
        auth/              authSlice (user, token, localStorage) + AuthPage
        posts/             postsSlice + HomePage, PostDetailPage, PostCard, PostForm
        comments/          commentsSlice + CommentSection
      components/          Navbar (composant partagé)
      utils/               postTypes, formatDate
      styles/index.css

## Flux de données (Redux)
Composant -> service Axios (token ajouté par l intercepteur) -> API Express -> réponse -> dispatch(action) -> reducer du slice -> useSelector remet l interface à jour.

## Lancer en local
    cd server && cp .env.example .env   # MONGO_URI, JWT_SECRET
    npm install && npm run dev
    cd client && cp .env.example .env
    npm install && npm run dev

## Déploiement
Atlas (M0) · Render (Root Directory server, Start npm start, vars MONGO_URI / JWT_SECRET / CLIENT_URL) · Vercel (Root Directory client, var VITE_API_URL = https://TON-API.onrender.com/api)
