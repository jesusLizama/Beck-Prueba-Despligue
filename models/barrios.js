const mongoose = require('mongoose');
const Comentario = require('./comentarios');

const barrioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  calles: [{
    type: String,
    required: true,
  }],
  descripcion: {
    type: String, 
    required: true,
  },
  comentarios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comentario',
    validate: {
      validator: async function(value) {
        // Verificar si el comentario con el ID proporcionado existe
        const comentario = await Comentario.findById(value);
        return comentario !== null;
      },
      message: props => `${props.value} no es un ID de comentario válido`
    }
  }]
});

const Barrio = mongoose.model('Barrio', barrioSchema);

module.exports = Barrio;
