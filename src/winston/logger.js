const winston = require('winston');
const { format } = winston;

// Configuración de los transportes de Winston
const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Formato de hora local
    format.simple() // Formato simple para los registros
  ),
  transports: [
    // Transporte para registrar en un archivo de registro de información
    new winston.transports.File({
      filename: 'src/logs/info.log',
      level: 'info'
    }),
    // Transporte para registrar en un archivo de registro de advertencias
    new winston.transports.File({
      filename: 'src/logs/warn.log',
      level: 'warn'
    }),
    // Transporte para registrar en un archivo de registro de errores
    new winston.transports.File({
      filename: 'src/logs/error.log',
      level: 'error'
    })
  ]
});

module.exports = logger;
