const express = require('express');
const router = express.Router();
const Tree = require('../models/tree');
const logger = require('../winston/logger');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   - name: Tree
 *     description: Endpoints relacionados con los árboles de decisión
*/

/**
 * @swagger
 * /tree:
 *   get:
 *     summary: Obtener todos los árboles de decisión
 *     description: Devuelve una lista de todos los árboles de decisión.
 *     tags: [Tree]
 *     responses:
 *       200:
 *         description: OK. Lista de árboles de decisión obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/tree', verifyAdmin, async (req, res) => {
  try {
    const trees = await Tree.find({});
    res.json(trees);
  } catch (error) {
    logger.error('Error al obtener los árboles de decisión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /tree/{id}:
 *   get:
 *     summary: Obtener un árbol de decisión por su ID
 *     description: Devuelve un árbol de decisión según su ID.
 *     tags: [Tree]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del árbol de decisión a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK. Árbol de decisión obtenido correctamente.
 *       404:
 *         description: Árbol de decisión no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/tree/:id', verifyAdmin, async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (tree) {
      res.json(tree);
    } else {
      logger.warn(`Árbol de decisión no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Árbol de decisión no encontrado');
    }
  } catch (error) {
    logger.error('Error al obtener el árbol de decisión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /tree:
 *   post:
 *     summary: Crear un nuevo árbol de decisión
 *     description: Crea un nuevo árbol de decisión con los datos proporcionados.
 *     tags: [Tree]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tree'
 *     responses:
 *       201:
 *         description: Árbol de decisión creado correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/tree', verifyAdmin, async (req, res) => {
  try {
    const newTree = new Tree(req.body);
    const savedTree = await newTree.save();
    logger.info(`Árbol de decisión creado correctamente. ID: ${savedTree._id}`);
    res.status(201).json({ id: savedTree._id });
  } catch (error) {
    logger.error('Error al crear un nuevo árbol de decisión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /tree/{id}:
 *   put:
 *     summary: Actualizar un árbol de decisión por su ID
 *     description: Actualiza un árbol de decisión existente según su ID con los datos proporcionados.
 *     tags: [Tree]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del árbol de decisión a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tree'
 *     responses:
 *       200:
 *         description: Árbol de decisión actualizado correctamente.
 *       404:
 *         description: Árbol de decisión no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/tree/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedTree = await Tree.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedTree) {
      logger.info(`Árbol de decisión actualizado correctamente. ID: ${req.params.id}`);
      res.json(updatedTree);
    } else {
      logger.warn(`Árbol de decisión no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Árbol de decisión no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar el árbol de decisión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /tree/{id}:
 *   delete:
 *     summary: Eliminar un árbol de decisión por su ID
 *     description: Elimina un árbol de decisión existente según su ID.
 *     tags: [Tree]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del árbol de decisión a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Árbol de decisión eliminado correctamente.
 *       404:
 *         description: Árbol de decisión no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/tree/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedTree = await Tree.findByIdAndDelete(req.params.id);
    if (deletedTree) {
      logger.info(`Árbol de decisión eliminado correctamente. ID: ${req.params.id}`);
      res.send('Árbol de decisión eliminado correctamente');
    } else {
      logger.warn(`Árbol de decisión no encontrado para el ID: ${req.params.id}`);
      res.status(404).send('Árbol de decisión no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar el árbol de decisión:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
