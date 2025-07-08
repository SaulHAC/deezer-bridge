// --- REQUERIMIENTOS E INSTALACIÓN ---
// npm init -y
// npm install express axios cors node-vibrant node-vibrant@3

const express = require("express");
const axios = require("axios");
const Vibrant = require("node-vibrant");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* --------------------------
   RUTAS PARA API DE DEEZER
----------------------------*/

app.get("/deezer", async (req, res) => {
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Parámetro 'endpoint' requerido" });
  }

  try {
    const response = await axios.get(`https://api.deezer.com/${endpoint}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error Deezer:", error.message);
    res.status(500).json({ error: "Fallo al consultar la API de Deezer" });
  }
});

/* --------------------------
  RUTA PARA OBTENER COLOR DOMINANTE CON NODE-VIBRANT
----------------------------*/

app.get("/color-from-url", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: "Parámetro 'imageUrl' requerido" });
  }

  try {
    // Descargar imagen como buffer (axios con responseType: arraybuffer)
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Obtener paleta con Vibrant
    const palette = await Vibrant.from(buffer).getPalette();

    // Obtener color dominante (Vibrant) o fallback a negro
    const dominant = palette.Vibrant?.rgb || [0, 0, 0];

    res.json({ dominantColor: dominant });
  } catch (error) {
    console.error("Error Vibrant:", error.message);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
