const express = require('express');
const router = express.Router();
const Barrio = require('./models/barrios');
const Comentario = require('./models/comentarios');
const Tree = require('./models/tree'); // Importa el modelo Tree
const { getRecommendation, actualizarResultados } = require('./decision-tree/tree');
const logger = require('./winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('./middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   name: Barrios
 *   description: Endpoints relacionados con los barrios
 */

/**
 * @swagger
 * /barrios:
 *   get:
 *     summary: Obtener todos los barrios
 *     description: Devuelve una lista de todos los barrios.
 *     tags: [Barrios]
 *     responses:
 *       200:
 *         description: OK. Lista de barrios obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/barrios', verifyAdmin, async (req, res) => {
  try {
    const barrios = await Barrio.find({});
    logger.info('Barrios obtenidos correctamente');
    res.send(barrios);
  } catch (error) {
    logger.error('Error al obtener barrios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /barrios:
 *   post:
 *     summary: Crear un nuevo barrio
 *     description: Crea un nuevo barrio con los datos proporcionados.
 *     tags: [Barrios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               calles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Barrio creado exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/barrios', verifyAdmin, async (req, res) => {
  try {
    const { nombre, calles } = req.body;
    const nuevoBarrio = new Barrio({ nombre, calles });
    await nuevoBarrio.save();
    logger.info('Barrio creado exitosamente');
    res.status(201).send('Barrio creado exitosamente \n');
  } catch (error) {
    logger.error('Error al crear barrio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /barrios/{id}:
 *   put:
 *     summary: Actualizar un barrio por ID
 *     description: Actualiza un barrio existente según su ID con los datos proporcionados.
 *     tags: [Barrios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del barrio a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               calles:
 *                 type: array
 *               comentarios:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Barrio actualizado correctamente.
 *       404:
 *         description: Barrio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/barrios/:id', async (req, res) => {
  try {
    const barrioId = req.params.id;
    const updateFields = req.body; // Campos a actualizar

    // Actualizar el barrio con los campos proporcionados
    const updatedBarrio = await Barrio.findByIdAndUpdate(barrioId, updateFields, { new: true });

    if (updatedBarrio) {
      logger.info('Barrio actualizado correctamente');
      res.send('Barrio actualizado correctamente');
    } else {
      logger.warn('Barrio no encontrado');
      res.status(404).send('Barrio no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar barrio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /modificacionComentarios/{id}:
 *   put:
 *     summary: Modificar comentarios de un barrio por su ID
 *     description: Modifica los comentarios de un barrio existente según su ID, agregando un nuevo comentario.
 *     tags: [Barrios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del barrio a actualizar.
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Datos del nuevo comentario a agregar al barrio.
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - comentarios
 *           properties:
 *             comentarios:
 *               type: string
 *               description: ID del nuevo comentario a agregar al barrio.
 *     responses:
 *       200:
 *         description: Barrio actualizado correctamente con el nuevo comentario.
 *       400:
 *         description: Error debido a datos incorrectos o faltantes.
 *       404:
 *         description: Barrio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/modificacionComentarios/:id', verifyToken, async (req, res) => {
  const barrioId = req.params.id;
  const { comentarios } = req.body;

  try {
    // Obtener el barrio por su ID
    const barrio = await Barrio.findById(barrioId);
    console.log("El barrio es: ", barrio);
    if (!barrio) {
      logger.warn(`Barrio con ID ${barrioId} no encontrado`);
      return res.status(404).json({ error: 'Barrio no encontrado' });
    }

    // Verificar si el vector de comentarios existe en el esquema
    if (!barrio.comentarios) {
      logger.warn(`Vector de comentarios no encontrado en el esquema del barrio con ID ${barrioId}`);
      return res.status(400).json({ error: 'Vector de comentarios no encontrado en el esquema del barrio' });
    }

    // Verificar si el nuevo comentario existe
    const newComment = await Comentario.findById(comentarios);
    if (!newComment) {
      logger.warn(`El comentario con ID ${comentarios} proporcionado no existe`);
      return res.status(400).json({ error: 'El comentario proporcionado no existe' });
    }

    // Agregar el nuevo comentario al vector
    barrio.comentarios.push(comentarios);

    // Guardar los cambios
    await barrio.save();

    // Devolver un mensaje indicando que el barrio ha sido actualizado con el nuevo comentario
    logger.info(`Barrio con ID ${barrioId} actualizado correctamente con el nuevo comentario`);
    return res.send({ message: 'Barrio actualizado correctamente con el nuevo comentario' });
  } catch (error) {
    logger.error(`Error al modificar el vector de comentarios del barrio con ID ${barrioId}:`, error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});



/**
 * @swagger
 * /barrios/{id}:
 *   delete:
 *     summary: Eliminar un barrio por ID
 *     description: Elimina un barrio existente según su ID.
 *     tags: [Barrios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del barrio a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Barrio eliminado correctamente.
 *       404:
 *         description: Barrio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/barrios/:id', verifyAdmin, async (req, res) => {
  try {
    const barrioId = req.params.id;
    const deletedBarrio = await Barrio.findByIdAndDelete(barrioId);
    if (deletedBarrio) {
      logger.info('Barrio eliminado correctamente');
      res.send('Barrio eliminado correctamente');
    } else {
      logger.warn('Barrio no encontrado');
      res.status(404).send('Barrio no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar barrio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /barrios:
 *   delete:
 *     summary: Eliminar todos los barrios
 *     description: Elimina todos los barrios existentes.
 *     tags: [Barrios]
 *     responses:
 *       200:
 *         description: Barrios eliminados correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/barrios', verifyAdmin, async (req, res) => {
  try {
    await Barrio.deleteMany({});
    logger.info('Todos los barrios han sido eliminados correctamente');
    res.send('Todos los barrios han sido eliminados correctamente');
  } catch (error) {
    logger.error('Error al eliminar barrios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /barrios/{id}:
 *   get:
 *     summary: Obtener un barrio por ID
 *     description: Devuelve un barrio específico según su ID.
 *     tags: [Barrios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del barrio a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Barrio obtenido correctamente.
 *       404:
 *         description: Barrio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/barrios/:id', verifyToken, async (req, res) => {
  try {
    const barrioId = req.params.id;
    const barrio = await Barrio.findById(barrioId);
    if (barrio) {
      logger.info('Barrio obtenido correctamente');
      res.send(barrio);
    } else {
      logger.warn('Barrio no encontrado');
      res.status(404).send('Barrio no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener barrio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /recomendacion:
 *   post:
 *     summary: Obtener recomendación de barrio
 *     description: Devuelve una recomendación de barrio basada en las respuestas proporcionadas.
 *     tags: [Barrios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responses:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: OK. Recomendación de barrio obtenida correctamente.
 *       400:
 *         description: Respuestas no proporcionadas correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/recomendacion', verifyToken, (req, res) => {
  try {
    const { responses } = req.body;

    // Verifica que se proporcionaron las respuestas correctamente
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      logger.warn('Respuestas no proporcionadas correctamente');
      return res.status(400).send('Respuestas no proporcionadas correctamente');
    }

    // Obtener la recomendación
    const recommendation = getRecommendation(responses);

    // Actualiza los resultados del árbol de decisiones
    actualizarResultados(recommendation)
      .then(() => {
        logger.info('Recomendación de barrio obtenida correctamente:', recommendation);
        res.send(recommendation);
      })
      .catch(error => {
        logger.error('Error al actualizar los resultados del árbol:', error);
        res.status(500).send('Error interno del servidor');
      });
  } catch (error) {
    logger.error('Error al obtener recomendación de barrio:', error);
    res.status(500).send('Error interno del servidor');
  }
});


module.exports = router;
