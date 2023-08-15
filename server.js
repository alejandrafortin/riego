const express = require('express');
const cors = require('cors');
const dbConection = require('./database/config');
const init = require("./config/init.config");
const path = require('path');

class Server {

    constructor() {
        this.app = express();

        process.env.TZ = 'America/Tegucigalpa';
        this.port = process.env.PORT || 3000;
        this.rutaRiego = '/';
        this.middlewares();
        this.routes();
    }

    async syncDB() {
        try {

            const db = require("./models/controlriego");
            await dbConection.sync({
                force: true
            }).then(() => {
            });
            console.log('base sincronizada');

        } catch (error) {
            console.log('error pai');
            console.log(error)
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json()); // Función de express que permite leer y parsear el body de una petición
        this.app.use(express.urlencoded({ extended: true }));


        //motor de plantilla
        this.app.set('view engine', 'ejs');
        this.app.set('views', __dirname + '/views')

        //Ruta vistas


        // Directorio público
        this.app.use(express.static(__dirname + '/public'));
    }

    // Endpoints 
    routes() {
        // Ruta de usuarios api
        this.app.use(this.rutaRiego, require('./routes/riego.routes'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ', this.port);
        });
    }

}

module.exports = Server;
