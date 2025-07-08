const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta existente para Deezer API
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

// Nueva ruta para proxy de imágenes
app.get("/image-proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Parámetro 'url' requerido" });
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"] || "image/jpeg";

    res.set("Content-Type", contentType);
    res.send(Buffer.from(response.data, "binary"));
  } catch (error) {
    console.error("Error al cargar la imagen:", error.message);
    res.status(500).json({ error: "No se pudo cargar la imagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
