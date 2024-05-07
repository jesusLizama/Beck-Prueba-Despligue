
const express = require('express');
const { connectDB } = require('./db.js');


const app = express();
const puerto = 9000;

app.listen(puerto, () => console.log('Servidor escuchando en el puerto', puerto));

connectDB(); // Establecer conexión a la base de datos

app.use(express.json()); // Configurar middleware para analizar el cuerpo de las solicitudes en formato JSON
  

// En index.js
module.exports = app;

