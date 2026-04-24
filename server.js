const { addonBuilder } = require("stremio-addon-sdk");
const express = require("express");
const path = require("path");

const builder = new addonBuilder({
    id: "com.navezseo.overlay",
    version: "1.2.0",
    name: "NavezSeo Overlay Mode",
    description: "Modo trabajo con ventana flotante, opacidad y filtros.",
    logo: "https://raw.githubusercontent.com/NavezSeo/tu-repo/main/logo.png", // Cambia tu-repo por el nombre real
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"]
});

// Esto hace que el add-on aparezca en la lista de enlaces de Stremio
builder.defineStreamHandler((args) => {
    // Aquí redirigimos el flujo hacia tu reproductor especial
    // Nota: Reemplaza 'tu-app.render.com' por tu URL de hosting más adelante
    const playerUrl = `https://tu-app.render.com/player?id=${args.id}`;
    
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
const app = express();

// Servir el add-on
app.use("/", (req, res, next) => {
    if (req.path === "/") return next();
    addonInterface.manifest(req, res, next);
});

app.get("/manifest.json", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(addonInterface.manifest);
});

// Ruta para el reproductor (el index.html que hicimos antes)
app.get("/player", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Add-on listo en: http://localhost:${port}/manifest.json`);
});
