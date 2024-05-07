const express = require('express');
const router = express.Router();
const Colegio = require('../models/colegio');
const logger = require('../winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   - name: Colegio
 *     description: Endpoints relacionados con los colegios
*/

/**
 * @swagger
 * /colegio:
 *   get:
 *     summary: Obtener todos los colegios
 *     description: Devuelve una lista de todos los colegios.
 *     tags: [Colegio]
 *     responses:
 *       200:
 *         description: OK. Lista de colegios obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/colegio', verifyAdmin, async (req, res) => {
  try {
    const colegios = await Colegio.find({});
    res.send(colegios);
  } catch (error) {
    logger.error('Error al obtener los colegios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /colegio/{id}:
 *   get:
 *     summary: Obtener un colegio por su ID
 *     description: Devuelve un colegio según su ID.
 *     tags: [Colegio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Colegio obtenido correctamente.
 *       404:
 *         description: Colegio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/colegio/:id', verifyTokenAndAccessColegio, async (req, res) => {
  try {
    const colegio = await Colegio.findById(req.params.id);
    if (colegio) {
      res.send(colegio);
    } else {
      logger.warn(`Colegio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Colegio no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener el colegio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /colegio:
 *   post:
 *     summary: Crear un nuevo colegio
 *     description: Crea un nuevo colegio con los datos proporcionados.
 *     tags: [Colegio]
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
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Colegio creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/colegio', verifyToken, async (req, res) => {
  try {
    const nuevoColegio = new Colegio(req.body);
    const savedColegio = await nuevoColegio.save();
    logger.info('Colegio creado correctamente');
    res.status(201).send('Colegio creado correctamente');
  } catch (error) {
    logger.error('Error al crear un nuevo colegio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /colegio/{id}:
 *   put:
 *     summary: Actualizar un colegio por su ID
 *     description: Actualiza un colegio existente según su ID con los datos proporcionados.
 *     tags: [Colegio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a actualizar.
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
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Colegio actualizado correctamente.
 *       404:
 *         description: Colegio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/colegio/:id', verifyAdmin, async (req, res) => {
  try {
    const colegio = await Colegio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (colegio) {
      logger.info(`Colegio actualizado correctamente. ID: ${req.params.id}`);
      res.send('Colegio actualizado correctamente');
    } else {
      logger.warn(`Colegio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Colegio no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar el colegio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /colegio/{id}:
 *   delete:
 *     summary: Eliminar un colegio por su ID
 *     description: Elimina un colegio existente según su ID.
 *     tags: [Colegio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Colegio eliminado correctamente.
 *       404:
 *         description: Colegio no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/colegio/:id', verifyAdmin, async (req, res) => {
  try {
    const colegio = await Colegio.findByIdAndDelete(req.params.id);
    if (colegio) {
      logger.info(`Colegio eliminado correctamente. ID: ${req.params.id}`);
      res.send('Colegio eliminado correctamente');
    } else {
      logger.warn(`Colegio no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Colegio no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar el colegio:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
