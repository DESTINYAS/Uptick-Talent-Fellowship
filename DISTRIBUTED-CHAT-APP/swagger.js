const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      title: 'DISTRIBUTED CHAT APPLICATION WITH SOCKET IO',
      version: '1.0.0',
      description: 'This API handles all logic of user signup, login and all chatroom related activities by the user',
    },
    components: { 
      securitySchemes: {
        BearerAuth: { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
  "tags": []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
