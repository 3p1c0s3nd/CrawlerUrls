
const url = require('url'); // Módulo 'url' incorporado en Node.js para manipular URLs.
const { crawlPageWithLinks } = require('./modulos/conexionurls');
//const { bruteforce } = require('./modulos/librerias');


// Inicializacion de las variables
const initialUrl = 'http://testphp.vulnweb.com/'; // Reemplaza con tu URL inicial.
const depth = 2;
const visitedLinks = new Set(); // Conjunto para mantener un registro de las URLs visitadas.
const originDomain = new URL(initialUrl).hostname; // Obtiene el dominio de la URL de origen.
let headers = {
    'Cookie' : "PHPSESSID=ppl736jpsvq4ff0lgkmmlgmrf8; security=low"
}

//check bruteforce directorios
//bruteforce(initialUrl)

crawlPageWithLinks(initialUrl, depth, visitedLinks, originDomain)
  .then((resp) => console.log(resp))
  .catch((err) => console.error(`Error general: ${err}`));
