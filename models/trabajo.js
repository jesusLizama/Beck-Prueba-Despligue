const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
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
});

const Trabajo = mongoose.model('Trabajo', trabajoSchema);

module.exports = Trabajo;
