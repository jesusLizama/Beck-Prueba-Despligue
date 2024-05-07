const mongoose = require('mongoose');

// Definir el subesquema para la foto de perfil
const fotoPerfilSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  fechaCarga: {
    type: Date,
    default: Date.now
  }
});

// Definir el esquema principal del usuario con el subesquema de foto de perfil
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellidos: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  barrio: {
    type: String,
  },
  fotoPerfil: fotoPerfilSchema, // Subesquema para la foto de perfil
  comentarios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comentario'
  }],
  actividades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activities'
  }],
  ocio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ocio'
  }],
  trabajos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trabajo'
  }],
  colegio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colegio'
  }],
  bloqueada: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
