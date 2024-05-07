const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/users');
const {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo} = require('../middleware/verifyToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secreto = process.env.SECRETO;

const logger = require('../winston/logger');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados con los usuarios
 */

// GET /users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK. Lista de usuarios obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    logger.warn('Se ha solicitado la lista de todos los usuarios.');
    res.send(users);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     description: Devuelve un usuario específico según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener.
 *         schema:
 *           type: string
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK. Usuario obtenido correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      logger.info(`Se encontró el usuario con ID: ${userId}`);
      res.send(user);
    } else {
      logger.warn(`No se encontró ningún usuario para el ID: ${userId}`);
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    logger.error(`Error al obtener el usuario con ID: ${userId}. Detalles del error: ${error}`);
    res.status(500).send('Error interno del servidor');
  }
});

// POST /users
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               telefono:
 *                 type: string
 *               nickname:
 *                 type: string
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: El usuario ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/users', async (req, res) => {
  try {
    const { email, password, nombre, apellidos, telefono, nickname } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }
    const newUser = new User({ email, password, nombre, apellidos, telefono, nickname });
    await newUser.save();

    // Registro de información de usuario registrado
    logger.info(`Usuario registrado exitosamente con ID: ${newUser._id}`);
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// PUT /users/:id
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     description: Actualiza un usuario existente según su ID con los datos proporcionados, incluyendo la foto de perfil.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               telefono:
 *                 type: string
 *               nickname:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateFields = req.body; // Campos a actualizar

    // Verificar si se proporcionó una foto de perfil para actualizar
    if ('fotoPerfil' in updateFields && updateFields.fotoPerfil !== null) {
      // Decodificar la imagen base64
      const base64Data = updateFields.fotoPerfil.replace(/^data:image\/.*;base64,/, '');
      const bufferData = Buffer.from(base64Data, 'base64');

      // Actualizar el campo de fotoPerfil con el objeto Buffer
      updateFields.fotoPerfil = {
        data: bufferData,
        contentType: 'image/png' // Puedes ajustar el tipo de imagen según sea necesario
      };
    }

    // Actualizar el usuario con los campos proporcionados
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (updatedUser) {
      // Registro de información de usuario actualizado
      logger.info(`Usuario actualizado correctamente. ID: ${userId}`);
      res.send('Usuario actualizado correctamente');
    } else {
      logger.warn(`Usuario no encontrado para actualizar. ID: ${userId}`);
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    logger.error('Error al actualizar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// DELETE /users/:id
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     description: Elimina un usuario existente según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar.
 *         schema:
 *           type: string
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.send('Usuario eliminado correctamente');
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    logger.error('Error al eliminar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// POST /login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Verifica las credenciales de un usuario y permite iniciar sesión.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: Dirección de correo electrónico del usuario.
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         required: true
 *         description: Contraseña del usuario.
 *         schema:
 *           type: string
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve el ID del usuario.
 *       401:
 *         description: Contraseña incorrecta.
 *       402:
 *         description: Cuenta bloqueada.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Buscar el usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (user) {
      // Verificar si la cuenta está bloqueada
      if (user.bloqueada) {
        logger.warn(`Intento de inicio de sesión en cuenta bloqueada. Correo electrónico: ${email}`);
        return res.status(402).send('La cuenta está bloqueada');
      }
      // Verificar la contraseña
      const passwordMatch = password === user.password;
      if (passwordMatch) {
        let role = 'USER';
        if (email === 'admin@admin.com') {
          role = 'ADMIN';
        }
        // Si la contraseña es correcta, generar el token JWT
        const payload = { userId: user._id, email: user.email, role: role };
        const token = jwt.sign(
          payload,
          secreto, 
          { algorithm: 'HS256', expiresIn: '1h' });
        // Devolver el token y un mensaje de éxito
        logger.info(`Inicio de sesión exitoso. Correo electrónico: ${email}`);
        res.status(200).send({ message: 'Inicio de sesión exitoso', userId: user._id, token });
      } else {
        // Si la contraseña no coincide, devolver un mensaje de error
        logger.warn(`Intento de inicio de sesión con contraseña incorrecta. Correo electrónico: ${email}`);
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      // Si no se encuentra el usuario, devolver un mensaje de error
      logger.warn(`Intento de inicio de sesión con usuario no encontrado. Correo electrónico: ${email}`);
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    logger.error('Error al iniciar sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
});


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Redirige a la ruta POST /users para registrar un nuevo usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               telefono:
 *                 type: string
 *               nickname:
 *                 type: string
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: El usuario ya existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/register', async (req, res) => {
  try {
    // Llamada al endpoint de '/users' para registro
    req.url = '/users';
    req.method = 'POST';
    const response = await router.handle(req, res);

    // Obtener el ID del usuario recién creado del cuerpo de la respuesta
    const userId = response.body._id;

    // Registro de información de usuario registrado exitosamente con el ID
    logger.info(`Usuario registrado exitosamente. ID: ${userId}`);

    return response;
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// PUT /modificacionVector/:id
/**
 * @swagger
 * /modificacionVector/{id}:
 *   put:
 *     summary: Modificar un vector de un usuario por ID
 *     description: Modifica un vector específico de un usuario según su ID, agregando un nuevo componente al vector.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario cuyo vector se va a modificar.
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: Datos para modificar el vector del usuario.
 *         schema:
 *           type: object
 *           properties:
 *             vectorName:
 *               type: string
 *               description: Nombre del vector que se va a modificar en el esquema del usuario.
 *             newComponent:
 *               type: string
 *               description: Nuevo componente a agregar al vector.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Vector especificado no encontrado en el esquema del usuario o ID de usuario inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/modificacionVector/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const { vectorName, newComponent } = req.body;
  console.log(userId);

  try {
    // Obtener el usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el vector existe en el esquema
    if (!user[vectorName]) {
      return res.status(400).json({ error: 'Vector especificado no encontrado en el esquema del usuario' });
    }

    // Agregar el nuevo componente al vector
    user[vectorName].push(newComponent);

    // Guardar los cambios
    await user.save();

    // Devolver un mensaje indicando que el usuario ha sido actualizado
    logger.info('Vector del usuario modificado correctamente');
    return res.send({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    logger.error('Error al modificar el vector:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// PRUEBAS!!!!!



router.get('/protected-endpoint', verifyToken, (req, res) => {
  res.send('Este es un endpoint protegido');
});

module.exports = router;
