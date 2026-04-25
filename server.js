const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configuración de CORS profesional para Stremio
app.use(cors());

const builder = new addonBuilder({
    id: "com.navezseo.overlay",
    version: "1.2.3", // Subimos versión para forzar actualización
    name: "NavezSeo Overlay Mode",
    description: "Modo trabajo con ventana flotante, opacidad y filtros.",
    logo: "https://raw.githubusercontent.com/NavezSeo/Stremio-Overlay-Mode/main/logo.png",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
});

builder.defineStreamHandler((args) => {
    // IMPORTANTE: Verifica que esta URL sea EXACTAMENTE la que te da Render
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

// RUTA DEL MANIFIESTO (CORREGIDA)
app.get("/manifest.json", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(addonInterface.manifest);
});

// Ruta para el reproductor index.html
app.get("/player", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Página de inicio para confirmar que funciona
app.get("/", (req, res) => {
    res.send("<h1>NavezSeo Add-on está LIVE</h1><p>Instala en Stremio usando: <b>stremio://stremio-overlay-mode.onrender.com/manifest.json</b></p>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
