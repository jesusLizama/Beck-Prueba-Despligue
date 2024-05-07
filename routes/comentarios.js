const express = require('express');
const router = express.Router();
const Comentario = require('../models/comentarios');
const logger = require('../winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: Endpoints relacionados con los comentarios
 */

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Obtener todos los comentarios
 *     description: Devuelve una lista de todos los comentarios.
 *     tags: [Comentarios]
 *     responses:
 *       200:
 *         description: OK. Lista de comentarios obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/comentarios', async (req, res) => {
  try {
    const comentarios = await Comentario.find({});
    logger.info('Se han solicitado obtener todos los comentarios');
    res.send(comentarios);
  } catch (error) {
    logger.error('Error al obtener comentarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});


/**
 * @swagger
 * /comentarios/{id}:
 *   get:
 *     summary: Obtener un comentario por su ID
 *     description: Devuelve un comentario específico según su ID.
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Comentario obtenido correctamente.
 *       404:
 *         description: Comentario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/comentarios/:id', async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const comentario = await Comentario.findById(comentarioId);
    if (comentario) {
      logger.info(`Se ha solicitado mostrar la información del comentario con ID: ${comentarioId}`);
      res.send(comentario);
    } else {
      logger.warn('Comentario no encontrado');
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear un nuevo comentario
 *     description: Crea un nuevo comentario con los datos proporcionados.
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *               idActividad:
 *                 type: string
 *               idUsuarioEscritor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/comentarios', async (req, res) => {
  try {
    const { texto, idActividad, idUsuarioEscritor } = req.body;
    const nuevoComentario = new Comentario({ texto, idActividad, idUsuarioEscritor });
    const savedComentario = await nuevoComentario.save();
    const mensaje = `Comentario creado con ID: ${savedComentario._id} por el usuario con ID: ${idUsuarioEscritor}`;
    logger.info(mensaje);
    res.status(201).send(mensaje);
  } catch (error) {
    logger.error('Error al crear un nuevo comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /comentarios/{id}:
 *   put:
 *     summary: Actualizar un comentario por su ID
 *     description: Actualiza un comentario existente según su ID con los datos proporcionados.
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado correctamente.
 *       404:
 *         description: Comentario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/comentarios/:id', async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const { texto } = req.body;
    const updatedComentario = await Comentario.findByIdAndUpdate(comentarioId, { texto }, { new: true });
    if (updatedComentario) {
      logger.info(`Comentario actualizado con ID: ${comentarioId}`);
      res.send(updatedComentario);
    } else {
      logger.warn('Comentario no encontrado');
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar el comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Eliminar un comentario por su ID
 *     description: Elimina un comentario existente según su ID.
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comentario a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente.
 *       404:
 *         description: Comentario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/comentarios/:id', async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const deletedComentario = await Comentario.findByIdAndDelete(comentarioId);
    if (deletedComentario) {
      logger.info(`Comentario eliminado correctamente con ID: ${comentarioId}`);
      res.send('Comentario eliminado correctamente');
    } else {
      logger.warn(`Intento de eliminar comentario con ID ${comentarioId}, pero no se encontró`);
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar el comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
