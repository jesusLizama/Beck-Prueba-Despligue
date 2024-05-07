const mongoose = require('mongoose');

const colegioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  calle: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
});

const Colegio = mongoose.model('Colegio', colegioSchema);

module.exports = Colegio;
