const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  calle: {
    type: String,
    required: true,
  },
  imagenes: [{        // Esto es probablemente lo que haya que cambiar para hacerlo con subesquemas como en usuarios!!!
    data: Buffer,
    contentType: String
  }]
});

const Actividad = mongoose.model('Activities', actividadSchema);

module.exports = Actividad;
