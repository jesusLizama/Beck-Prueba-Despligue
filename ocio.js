const express = require('express');
const router = express.Router();
const Ocio = require('./models/ocio');
const logger = require('./winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('./middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   - name: Ocio
 *     description: Endpoints relacionados con el ocio
*/

/**
 * @swagger
 * /ocio:
 *   get:
 *     summary: Obtener todos los ocio
 *     description: Devuelve una lista de todos los ocio.
 *     tags: [Ocio]
 *     responses:
 *       200:
 *         description: OK. Lista de ocio obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/ocio', verifyToken, async (req, res) => {
  try {
    const ocio = await Ocio.find({});
    res.send(ocio);
  } catch (error) {
    logger.error('Error al obtener los ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /ocio/{id}:
 *   get:
 *     summary: Obtener un ocio por su ID
 *     description: Devuelve un ocio según su ID.
 *     tags: [Ocio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ocio a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Ocio obtenido correctamente.
 *       404:
 *         description: Ocio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/ocio/:id',verifyTokenAndAccessOcio, async (req, res) => {
  try {
    const ocio = await Ocio.findById(req.params.id);
    if (ocio) {
      res.send(ocio);
    } else {
      logger.warn(`Ocio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Ocio no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener el ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /ocio:
 *   post:
 *     summary: Crear un nuevo ocio
 *     description: Crea un nuevo ocio con los datos proporcionados.
 *     tags: [Ocio]
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
 *         description: Ocio creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/ocio', verifyToken, async (req, res) => {
  try {
    const nuevoOcio = new Ocio(req.body);
    const savedOcio = await nuevoOcio.save();
    logger.info('Elemento de Ocio creado correctamente');
    res.status(201).send('Elemento de Ocio creado correctamente');
  } catch (error) {
    logger.error('Error al crear un nuevo ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /ocio/{id}:
 *   put:
 *     summary: Actualizar un ocio por su ID
 *     description: Actualiza un ocio existente según su ID con los datos proporcionados.
 *     tags: [Ocio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ocio a actualizar.
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
 *         description: Ocio actualizado correctamente.
 *       404:
 *         description: Ocio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/ocio/:id', verifyToken, async (req, res) => {
  try {
    const ocio = await Ocio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (ocio) {
      logger.info(`Ocio actualizado correctamente. ID: ${req.params.id}`);
      res.send(ocio);
    } else {
      logger.warn(`Ocio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Ocio no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar el ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /ocio/{id}:
 *   delete:
 *     summary: Eliminar un ocio por su ID
 *     description: Elimina un ocio existente según su ID.
 *     tags: [Ocio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del ocio a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ocio eliminado correctamente.
 *       404:
 *         description: Ocio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/ocio/:id', verifyAdmin, async (req, res) => {
  try {
    const ocio = await Ocio.findByIdAndDelete(req.params.id);
    if (ocio) {
      logger.info(`Ocio eliminado correctamente. ID: ${req.params.id}`);
      res.send('Ocio eliminado correctamente');
    } else {
      logger.warn(`Ocio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Ocio no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar el ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
