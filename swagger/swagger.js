const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Opciones para swagger-jsdoc
const options = {
    definition: {
      openapi: '3.0.0', // Versión de OpenAPI
      info: {
        title: 'API de CalidaZ, LALA LA MAMA',
        version: '1.0.0',
        description: 'Documentación de la API de CalidaZ',
      },
      components: {
        securitySchemes: {
          bearerAuth: { 
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
        },
      },
      security: [{
        bearerAuth: [],
      }]  
    },
    apis: ['src/routes/users.js', 'src/routes/activities.js', 'src/routes/barrios.js',
    'src/routes/ocio.js', 'src/routes/trabajo.js', 'src/routes/colegio.js', 'src/routes/tree.js',
    'src/routes/comentarios.js'], // Ruta a tus archivos de controladores
  };


// Generar la especificación Swagger
const specs = swaggerJsdoc(options);

// Exportar middleware para Swagger
module.exports = function (app) {
    // Configurar Swagger UI en una ruta específica
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  };
