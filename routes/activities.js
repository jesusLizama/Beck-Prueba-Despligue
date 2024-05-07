const express = require('express');
const router = express.Router();
const Actividad = require('../models/activities');
const logger = require('../winston/logger');
// const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('../middleware/verifyToken');

// /**
//  * @swagger
//  * tags:
//  *   name: Activities
//  *   description: Endpoints relacionados con las actividades
//  */

// /**
//  * @swagger
//  * /activities:
//  *   get:
//  *     summary: Obtener todas las actividades
//  *     description: Devuelve una lista de todas las actividades.
//  *     tags: [Activities]
//  *     responses:
//  *       200:
//  *         description: OK. Lista de actividades obtenida correctamente.
//  *       500:
//  *         description: Error interno del servidor.
//  */
// router.get('/activities', async (req, res) => {
//   try {
//     const actividades = await Actividad.find({});
//     logger.info('Actividades obtenidas correctamente');
//     res.send(actividades);
//   } catch (error) {
//     logger.error('Error al obtener actividades:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// /**
//  * @swagger
//  * /activities:
//  *   post:
//  *     summary: Crear una nueva actividad
//  *     description: Crea una nueva actividad con los datos proporcionados.
//  *     tags: [Activities]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               descripción:
//  *                 type: string
//  *               calle:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Actividad creada exitosamente.
//  *       500:
//  *         description: Error interno del servidor.
//  */
// router.post('/activities', async (req, res) => {
//   try {
//     const { nombre, descripcion, calle } = req.body;
//     const nuevaActividad = new Actividad({ nombre, descripcion, calle });
//     await nuevaActividad.save();
//     logger.info('Actividad creada exitosamente');
//     res.status(201).send('Actividad creada exitosamente');
//   } catch (error) {
//     logger.error('Error al crear actividad:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// /**
//  * @swagger
//  * /activities/{id}:
//  *   put:
//  *     summary: Actualizar una actividad por ID
//  *     description: Actualiza una actividad existente según su ID con los datos proporcionados.
//  *     tags: [Activities]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID de la actividad a actualizar.
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               nombre:
//  *                 type: string
//  *               descripción:
//  *                 type: string
//  *               calle:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Actividad actualizada correctamente.
//  *       404:
//  *         description: Actividad no encontrada.
//  *       500:
//  *         description: Error interno del servidor.
//  */
// router.put('/activities/:id', async (req, res) => {
//   try {
//     const actividadId = req.params.id;
//     const { nombre, descripción, calle } = req.body;
//     const updatedActividad = await Actividad.findByIdAndUpdate(actividadId, { nombre, descripción, calle }, { new: true });
//     if (updatedActividad) {
//       logger.info('Actividad actualizada correctamente');
//       res.send('Actividad actualizada correctamente');
//     } else {
//       logger.warn('Actividad no encontrada');
//       res.status(404).send('Actividad no encontrada');
//     }
//   } catch (error) {
//     logger.error('Error al actualizar actividad:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// /**
//  * @swagger
//  * /activities/{id}:
//  *   delete:
//  *     summary: Eliminar una actividad por ID
//  *     description: Elimina una actividad existente según su ID.
//  *     tags: [Activities]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID de la actividad a eliminar.
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Actividad eliminada correctamente.
//  *       404:
//  *         description: Actividad no encontrada.
//  *       500:
//  *         description: Error interno del servidor.
//  */
// router.delete('/activities/:id', async (req, res) => {
//   try {
//     const actividadId = req.params.id;
//     const deletedActividad = await Actividad.findByIdAndDelete(actividadId);
//     if (deletedActividad) {
//       logger.info('Actividad eliminada correctamente');
//       res.send('Actividad eliminada correctamente');
//     } else {
//       logger.warn('Actividad no encontrada');
//       res.status(404).send('Actividad no encontrada');
//     }
//   } catch (error) {
//     logger.error('Error al eliminar actividad:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// /**
//  * @swagger
//  * /activities/{id}:
//  *   get:
//  *     summary: Obtener una actividad por ID
//  *     description: Devuelve una actividad específica según su ID.
//  *     tags: [Activities]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         description: ID de la actividad a obtener.
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: OK. Actividad obtenida correctamente.
//  *       404:
//  *         description: Actividad no encontrada.
//  *       500:
//  *         description: Error interno del servidor.
//  */
// router.get('/activities/:id', async (req, res) => {
//   try {
//     const actividadId = req.params.id;
//     const actividad = await Actividad.findById(actividadId);
//     if (actividad) {
//       logger.info('Actividad obtenida correctamente');
//       res.send(actividad);
//     } else {
//       logger.warn('Actividad no encontrada');
//       res.status(404).send('Actividad no encontrada');
//     }
//   } catch (error) {
//     logger.error('Error al obtener actividad:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });

// module.exports = router;
