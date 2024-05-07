
const express = require('express');
const { connectDB } = require('./db/db');
const usersRouter = require('./routes/users');
const activitiesRouter = require('./routes/activities');
const barriosRouter = require('./routes/barrios');
const ocioRouter = require('./routes/ocio');
const trabajoRouter = require('./routes/trabajo');
const colegioRouter = require('./routes/colegio');
const treeRouter = require('./routes/tree');
const comentariosRouter = require('./routes/comentarios');

const swaggerMiddleware = require('./swagger/swagger'); // Importa el middleware de Swagger


const app = express();
const puerto = 9000;

app.listen(puerto, () => console.log('Servidor escuchando en el puerto', puerto));

connectDB(); // Establecer conexión a la base de datos

app.use(express.json()); // Configurar middleware para analizar el cuerpo de las solicitudes en formato JSON





app.use('/', usersRouter); // Usar el enrutador de usuarios para las rutas '/users'
app.use('/', activitiesRouter); // Usar el enrutador de actividades para las rutas '/activities'
app.use('/', barriosRouter); // Usar el enrutador de actividades para las rutas '/barrios'
app.use('/', ocioRouter); // Usar el enrutador de actividades para las rutas '/ocio'
app.use('/', trabajoRouter); // Usar el enrutador de actividades para las rutas '/trabajo'
app.use('/', colegioRouter); // Usar el enrutador de actividades para las rutas '/colegio'
app.use('/', treeRouter); // Usar el enrutador de actividades para las rutas '/tree'
app.use('/', comentariosRouter); // Usar el enrutador de actividades para las rutas '/comentarios'


app.use('/public', express.static(`${__dirname}/storage/img`)); // Usar el enrutador de actividades para las rutas '/trabajo'


// LO DE SWAGGER!!

// Utilizar el middleware de Swagger
swaggerMiddleware(app);
  

// En index.js
module.exports = app;

