// db/db.js

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;


async function connectDB() { 
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB!!! \n');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1); // Salir del proceso en caso de error
  }
}

async function closeDB() {
  await mongoose.connection.close();
  console.log('Conexión cerrada');
}

module.exports = { connectDB, closeDB };
