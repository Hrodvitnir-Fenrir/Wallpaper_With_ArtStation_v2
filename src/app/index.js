const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

const axios = require("axios");
const https = require('https');

const ffi = require('ffi-napi');
const user32 = ffi.Library('user32', {
    SystemParametersInfo: ['int', ['int', 'int', 'string', 'int']]
});

const SPI_SETDESKWALLPAPER = 20;
const UPDATE_INI_FILE = 0x01;
const SEND_CHANGE = 0x02;

const localPath = path.resolve(process.env.APPDATA, "ArtStationWallPaper/image.jpg");
const randomImageUrl = "https://www.artstation.com/random_project.json";

async function downloadImage(folderPath, url) {
    const imageUrl = await axios.get(url).then(response => response.data.assets[0].image_url);
    const file = fs.createWriteStream(folderPath);

    https.get(imageUrl, response => {
        response.pipe(file);
    });

    file.on("finish", () => {
        setWallpaper(localPath)
    });
}

function setWallpaper(imagePath) {
    user32.SystemParametersInfo(SPI_SETDESKWALLPAPER, 0, imagePath, UPDATE_INI_FILE | SEND_CHANGE);
}


downloadImage(localPath, randomImageUrl);
