
const express = require('express');
const { connectDB } = require('./db/db');
const usersRouter = require('./routes/users');
const activitiesRouter = require('./routes/activities');
const barriosRouter = require('./routes/barrios');
// const ocioRouter = require('./routes/ocio');
// const trabajoRouter = require('./routes/trabajo');
// const colegioRouter = require('./routes/colegio');
// const treeRouter = require('./routes/tree');
// const comentariosRouter = require('./routes/comentarios');

// const swaggerMiddleware = require('./swagger/swagger'); // Importa el middleware de Swagger


const app = express();
const puerto = 9000;

app.listen(puerto, () => console.log('Servidor escuchando en el puerto', puerto));

connectDB(); // Establecer conexión a la base de datos

app.use(express.json()); // Configurar middleware para analizar el cuerpo de las solicitudes en formato JSON
  

// app.use('/', usersRouter); // Usar el enrutador de usuarios para las rutas '/users'
// app.use('/', activitiesRouter); // Usar el enrutador de actividades para las rutas '/activities'


// En index.js
module.exports = app;

