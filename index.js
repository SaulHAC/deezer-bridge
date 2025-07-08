const express = require("express");
const axios = require("axios");
const cors = require("cors"); // ← si lo necesitas

const app = express();
const PORT = 3000;

app.use(cors()); // ← habilita CORS
app.use(express.json());

app.get("/deezer", async (req, res) => {
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Parámetro 'endpoint' requerido" });
  }

  try {
    const response = await axios.get(`https://api.deezer.com/${endpoint}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Fallo al consultar la API de Deezer" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
