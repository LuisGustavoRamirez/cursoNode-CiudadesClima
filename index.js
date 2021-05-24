require('dotenv').config();
require('colors');

const { inquirerMenu, leerInput, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async () => {
    const busquedas = new Busquedas();

    console.clear();
    let opt;
    do {
        console.clear();
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar Mensaje
                const termino = await leerInput('Ciudad:');
                //Buscar Lugares
                const lugares = await busquedas.ciudad(termino);
                //seleccionar Lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);
                //guardar en Db
                busquedas.agregarHistorial(lugarSel.nombre);

                //Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                //Mostrar resultados
                console.clear();
                console.log('\n Informacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;


        }
        if (opt !== 0) await pausa();

    } while (opt !== 0)

}

main();