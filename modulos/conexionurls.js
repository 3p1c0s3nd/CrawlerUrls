const puppeteer = require('puppeteer');
const fs = require('fs');

const urlslimpias = [];

async function crawlPageWithLinks(url, depth, visitedLinks, originDomain) {
    if (depth === 0 || visitedLinks.has(url)) {
      return;
    }
  
    visitedLinks.add(url); // Agrega la URL actual al conjunto de URLs visitadas.
  
    const browser = await puppeteer.launch({
      headless: "new",
      slowMo: 100,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
  
    await page.goto(url);
  
    // Extrae los enlaces de la página actual.
    const linksbad = await page.$$eval('a', (anchors) => anchors.map((anchor) => anchor.href));

    linksbad.forEach((link) => {
      const parsedUrl = new URL(link);
      const linkDomain = parsedUrl.hostname;

      if (linkDomain === originDomain) {
        urlslimpias.push(link);
        //visitedLinks.add(link);
      }
    })
    try {

      // Imprime los enlaces de la página actual.
      //console.log(`Enlaces en ${url}:`);
      /*links.forEach((link) => {
        console.log(link);
      });*/


      // Convierte el array a una cadena JSON (puedes usar otros formatos si lo deseas)
      const miArrayComoJSON = JSON.stringify(links);
      // Ruta del archivo en el que deseas escribir el array
      const rutaDelArchivo = 'urls.txt';


      //almacenamos todas la urls en un archivo
      fs.appendFile(rutaDelArchivo, miArrayComoJSON, (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
        } else {
          console.log('Array escrito en el archivo correctamente.');
        }
      });
  
      // Itera sobre los enlaces y ábrelos en nuevas ventanas o pestañas.
      for (const link of urlslimpias) {
        // Parsea las URLs para obtener el dominio.
        const parsedUrl = new URL(link);
        const linkDomain = parsedUrl.hostname;
  
        // Verifica si el enlace pertenece al mismo dominio que la URL de origen.
        if (linkDomain === originDomain && !visitedLinks.has(link)) {
          const newPage = await browser.newPage(); // Crea una nueva ventana o pestaña.
          await newPage.goto(link); // Navega a la URL del enlace.
  
          // Realiza operaciones en la nueva ventana o pestaña si es necesario.
  
          await newPage.close(); // Cierra la nueva ventana o pestaña cuando hayas terminado.
  
          // Recursivamente realiza crawling en la nueva página.
          await crawlPageWithLinks(link, depth - 1, visitedLinks, originDomain);
        }
      }

      
    } catch (error) {
      console.error(`Error al visitar ${url}: ${error}`);
    } finally {
      
      await browser.close();
      
    }
    return urlslimpias;
  }


  async function directoryDiscovery(link) {
    const browser = await puppeteer.launch({
        headless: "new",
        //slowMo: 100,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
    const page = await browser.newPage();
  
    try {
        const response = await page.goto(link);
        const httpStatusCode = response.status();
        return httpStatusCode; 
    } catch (error) {
      //await browser.close();
      console.error(`Error al visitar ${link}: ${error}`);
    } finally {
      await browser.close();
    }
  }


  module.exports = {
    crawlPageWithLinks,
    directoryDiscovery
}
