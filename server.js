const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors()); 

// Configuración del Add-on con 'catalogs' como array vacío
const builder = new addonBuilder({
    id: "com.navezseo.overlay",
    version: "1.2.2",
    name: "NavezSeo Overlay Mode",
    description: "Modo trabajo con ventana flotante, opacidad y filtros.",
    logo: "https://raw.githubusercontent.com/NavezSeo/Stremio-Overlay-Mode/main/logo.png",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: [] // <--- ESTO ES LO QUE FALTABA
});

builder.defineStreamHandler((args) => {
    // Al usar una URL externa, Stremio abrirá el navegador
    // IMPORTANTE: Cuando Render te dé tu URL, cámbiala aquí si es necesario
    const playerUrl = `https://stremio-overlay-mode.onrender.com/player?id=${args.id}`;
    
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

// Servir el manifiesto correctamente
app.get("/manifest.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(addonInterface.manifest);
});

// Ruta para el reproductor
app.get("/player", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta raíz
app.get("/", (req, res) => {
    res.send("NavezSeo Stremio Add-on está activo. Instala /manifest.json en Stremio.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
