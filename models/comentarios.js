const mongoose = require('mongoose');
const User = require('../models/users');
const Neighborhood = require('../models/barrios'); // Importa el modelo del esquema del Barrio

const comentarioSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true
  },
  // Cambia el nombre del campo y la referencia al esquema del Barrio
  barrio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barrio', // Nombre del modelo del esquema del Barrio
    required: true,
    validate: {
      validator: async function(value) {
        // Verificar si el Barrio con el ID proporcionado existe
        const neighborhood = await Neighborhood.findById(value);
        return neighborhood !== null;
      },
      message: props => `${props.value} no es un ID de Barrio válido`
    }
  },
  idUsuarioEscritor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(value) {
        // Verificar si el usuario con el ID proporcionado existe
        const user = await User.findById(value);
        return user !== null;
      },
      message: props => `${props.value} no es un ID de usuario válido`
    }
  }
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;
