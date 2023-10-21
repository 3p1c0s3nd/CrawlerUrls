const { directoryDiscovery } = require('../modulos/conexionurls');
const fs = require('fs');
//const { exec } = require('child_process');


//Bruteforce de directorios

/*function bruteforce2(pagina){
    // Reemplaza 'miPrograma.go' con la ubicación y nombre de tu archivo Go
    const comando = 'go run miPrograma.go';

    exec(comando, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar el programa Go: ${error}`);
        return;
    }
    console.log(`Resultado del programa Go:\n${stdout}`);
    });
}
*/

 function bruteforce(pagina) {
    let url = new URL(pagina);
    let urlcompleto = url.protocol + "//" + url.host +  "/";
    const data = fs.readFileSync('./txt/common.txt', { encoding: 'utf8', flag: 'r' });
    let lines = data.toString().split('\n');
    const urlsattack = [];
    lines.forEach(line => {
        urlsattack.push(urlcompleto+line);
    });
    checkea(urlsattack);
}

async function checkea(urlsattack){
    let contador = 0;
    for(checkurl of urlsattack){
        if(contador == 4){
            const respuesta = await directoryDiscovery(checkurl);
            if(respuesta == 200){
                console.log(`HTTP Ok: ${checkurl}`);
            }
            contador = 0;
        }
        const respuesta = directoryDiscovery(checkurl);
        if(respuesta == 200){
            console.log(`HTTP Ok: ${checkurl}`);
        }
        contador++;      
    }
}


module.exports = {
    bruteforce
}