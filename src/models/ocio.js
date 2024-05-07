const mongoose = require('mongoose');

const ocioSchema = new mongoose.Schema({
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
  }
});

const Ocio = mongoose.model('Ocio', ocioSchema);

module.exports = Ocio;
