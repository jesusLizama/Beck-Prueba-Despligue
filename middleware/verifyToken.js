const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../winston/logger');
const User = require('../models/users');


const secreto = process.env.SECRETO;

const extractUserDataFromToken = (token) => {
  const decodedToken = jwt.decode(token);
  if (decodedToken) {
    const userData = {
      email: decodedToken.email,
      role: decodedToken.role
    };
    return userData;
  } else {
    return null; // Devuelve null si el token no se pudo decodificar correctamente
  }
};


const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.error(`Se ha intentado acceder a un endPoint del Admin sin token.`);
    return res.status(401).send('Token no proporcionado');
  }

  const userData = extractUserDataFromToken(token);

  if (!userData || userData.role !== 'ADMIN') {
    logger.error(`Se ha intentado acceder a un endPoint del Admin sin serlo con email: ${userData.email}.`);
    return res.status(403).send('Acceso denegado. Se requiere rol de ADMIN');
  }

  
  next();
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.error(`Se ha intentado acceder a un endPoint sin token.`);
    return res.status(401).send('Token no proporcionado');
  }

  const userData = extractUserDataFromToken(token);

  if (!userData || (userData.role !== 'USER' && userData.role !== 'ADMIN')) {
    logger.error(`Se ha intentado acceder a un endPoint sin ser rol ADMIN o USER con email: ${userData.email}.`);
    return res.status(403).send('Acceso denegado. Se requiere rol de USER o ADMIN');
  }

  next();
};

const verifyTokenAndAccessColegio = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.error('Token no proporcionado');
    return res.status(401).send('Token no proporcionado');
  }

  const userData = extractUserDataFromToken(token);

  if (!userData || (userData.role !== 'USER' && userData.role !== 'ADMIN')) {
    logger.error(`Acceso denegado. Se requiere rol de USER o ADMIN.`);
    return res.status(403).send('Acceso denegado. Se requiere rol de USER o ADMIN');
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      logger.error(`Usuario no encontrado para el email: ${userData.email}`);
      return res.status(404).send('Usuario no encontrado');
    }

    // Comprobar si el ID del colegio está presente en el vector de colegios del usuario
    const tieneAcceso = user.colegio.some(colegio => colegio.toString() === req.params.id);
    if (!tieneAcceso) {
      logger.error(`El usuario no tiene acceso al colegio con ID: ${req.params.id}`);
      return res.status(403).send('Acceso denegado. El usuario no tiene acceso al colegio solicitado');
    }

    logger.info(`Usuario con correo electrónico ${userData.email} tiene acceso al colegio con ID: ${req.params.id}`);
    next();
  } catch (error) {
    logger.error('Error al verificar el acceso al colegio:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const verifyTokenAndAccessOcio = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.error('Token no proporcionado');
    return res.status(401).send('Token no proporcionado');
  }

  const userData = extractUserDataFromToken(token);

  if (!userData || (userData.role !== 'USER' && userData.role !== 'ADMIN')) {
    logger.error(`Acceso denegado. Se requiere rol de USER o ADMIN.`);
    return res.status(403).send('Acceso denegado. Se requiere rol de USER o ADMIN');
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      logger.error(`Usuario no encontrado para el email: ${userData.email}`);
      return res.status(404).send('Usuario no encontrado');
    }

    // Comprobar si el ID del ocio está presente en el vector de ocios del usuario
    const tieneAcceso = user.ocio.some(ocio => ocio.toString() === req.params.id);
    if (!tieneAcceso) {
      logger.error(`El usuario no tiene acceso al ocio con ID: ${req.params.id}`);
      return res.status(403).send('Acceso denegado. El usuario no tiene acceso al ocio solicitado');
    }

    logger.info(`Usuario con correo electrónico ${userData.email} tiene acceso al ocio con ID: ${req.params.id}`);
    next();
  } catch (error) {
    logger.error('Error al verificar el acceso al ocio:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const verifyTokenAndAccessTrabajo = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    logger.error('Token no proporcionado');
    return res.status(401).send('Token no proporcionado');
  }

  const userData = extractUserDataFromToken(token);

  if (!userData || (userData.role !== 'USER' && userData.role !== 'ADMIN')) {
    logger.error(`Acceso denegado. Se requiere rol de USER o ADMIN.`);
    return res.status(403).send('Acceso denegado. Se requiere rol de USER o ADMIN');
  }

  try {
    // Buscar al usuario en la base de datos
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      logger.error(`Usuario no encontrado para el email: ${userData.email}`);
      return res.status(404).send('Usuario no encontrado');
    }

    // Comprobar si el ID del trabajo está presente en el vector de trabajos del usuario
    const tieneAcceso = user.trabajos.some(trabajo => trabajo.toString() === req.params.id);
    if (!tieneAcceso) {
      logger.error(`El usuario no tiene acceso al trabajo con ID: ${req.params.id}`);
      return res.status(403).send('Acceso denegado. El usuario no tiene acceso al trabajo solicitado');
    }

    logger.info(`Usuario con correo electrónico ${userData.email} tiene acceso al trabajo con ID: ${req.params.id}`);
    next();
  } catch (error) {
    logger.error('Error al verificar el acceso al trabajo:', error);
    res.status(500).send('Error interno del servidor');
  }
};



module.exports = {verifyAdmin, verifyToken, verifyTokenAndAccessColegio, verifyTokenAndAccessOcio, verifyTokenAndAccessTrabajo};