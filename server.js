const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const cors = require("cors");
const path = require("path");

// 1. Inicializar la app de Express PRIMERO
const app = express();
app.use(cors()); 

// 2. Configurar el constructor del Add-on
const builder = new addonBuilder({
    id: "com.navezseo.overlay",
    version: "1.2.1",
    name: "NavezSeo Overlay Mode",
    description: "Modo trabajo con ventana flotante, opacidad y filtros.",
    logo: "https://raw.githubusercontent.com/NavezSeo/Stremio-Overlay-Mode/main/logo.png",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"]
});

// 3. Definir el manejador de streams
builder.defineStreamHandler((args) => {
    // IMPORTANTE: Aquí Render te dará una URL, úsala cuando la tengas.
    // Por ahora usamos una ruta relativa para el reproductor.
    const playerUrl = `/player?id=${args.id}`;
    
    return Promise.resolve({
        streams: [
            {
                title: "🚀 ACTIVAR MODO NAVEZSEO (PiP)",
                externalUrl: playerUrl
            }
        ]
    });
});

const addonInterface = builder.getInterface();

// 4. Rutas del Servidor
app.get("/manifest.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(addonInterface.manifest);
});

app.get("/player", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta raíz para verificar que el servidor vive
app.get("/", (req, res) => {
    res.send("NavezSeo Stremio Add-on está activo. Instala /manifest.json en Stremio.");
});

// 5. Encender el servidor en el puerto que Render asigne
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
