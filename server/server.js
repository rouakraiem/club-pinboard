require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// CORS : autorise uniquement le front (CLIENT_URL, séparés par des virgules)
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API Club Pinboard OK" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
  })
  .catch((err) => { console.error("Erreur MongoDB :", err.message); process.exit(1); });
