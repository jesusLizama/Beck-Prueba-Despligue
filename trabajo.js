const express = require('express');
const router = express.Router();
const Trabajo = require('./models/trabajo');
const logger = require('./winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('./middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   - name: Trabajo
 *     description: Endpoints relacionados con los trabajos
*/

/**
 * @swagger
 * /trabajo:
 *   get:
 *     summary: Obtener todos los trabajos
 *     description: Devuelve una lista de todos los trabajos.
 *     tags: [Trabajo]
 *     responses:
 *       200:
 *         description: OK. Lista de trabajos obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/trabajo', verifyAdmin, async (req, res) => {
  try {
    const trabajo = await Trabajo.find({});
    res.send(trabajo);
  } catch (error) {
    logger.error('Error al obtener los trabajos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /trabajo/{id}:
 *   get:
 *     summary: Obtener un trabajo por su ID
 *     description: Devuelve un trabajo según su ID.
 *     tags: [Trabajo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajo a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Trabajo obtenido correctamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/trabajo/:id', verifyTokenAndAccessTrabajo, async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id);
    if (trabajo) {
      res.send(trabajo);
    } else {
      logger.warn(`Trabajo no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Trabajo no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener el trabajo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /trabajo:
 *   post:
 *     summary: Crear un nuevo trabajo
 *     description: Crea un nuevo trabajo con los datos proporcionados.
 *     tags: [Trabajo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               calle:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trabajo creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/trabajo', verifyToken, async (req, res) => {
  try {
    const nuevoTrabajo = new Trabajo(req.body);
    const savedTrabajo = await nuevoTrabajo.save();
    logger.info('Trabajo creado correctamente');
    res.status(201).send('Trabajo creado correctamente');
  } catch (error) {
    logger.error('Error al crear un nuevo trabajo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /trabajo/{id}:
 *   put:
 *     summary: Actualizar un trabajo por su ID
 *     description: Actualiza un trabajo existente según su ID con los datos proporcionados.
 *     tags: [Trabajo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajo a actualizar.
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
 *               descripcion:
 *                 type: string
 *               calle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trabajo actualizado correctamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/trabajo/:id', verifyToken, async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (trabajo) {
      logger.info(`Trabajo actualizado correctamente. ID: ${req.params.id}`);
      res.send(trabajo);
    } else {
      logger.warn(`Trabajo no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Trabajo no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar el trabajo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /trabajo/{id}:
 *   delete:
 *     summary: Eliminar un trabajo por su ID
 *     description: Elimina un trabajo existente según su ID.
 *     tags: [Trabajo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del trabajo a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trabajo eliminado correctamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/trabajo/:id', verifyAdmin, async (req, res) => {
  try {
    const trabajo = await Trabajo.findByIdAndDelete(req.params.id);
    if (trabajo) {
      logger.info(`Trabajo eliminado correctamente. ID: ${req.params.id}`);
      res.send('Trabajo eliminado correctamente');
    } else {
      logger.warn(`Trabajo no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Trabajo no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar el trabajo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
