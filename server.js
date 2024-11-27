const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');

/**
 * Initializes and configures the Express application.
 * @returns {express.Application} - The configured Express application.
 */
const initApp = () => {
    const app = express();
    app.use(express.json());

    setupSwagger(app);
    setupRoutes(app);

    return app;
};

/**
 * Configures Swagger for API documentation.
 * @param {express.Application} app - The Express application instance.
 */
const setupSwagger = (app) => {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API documentation for transcription service',
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 3000}`,
                    description: 'Local server',
                },
            ],
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        apis: ['./routes/*.js'],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

/**
 * Sets up the API routes for the application.
 * @param {express.Application} app - The Express application instance.
 */
const setupRoutes = (app) => {
    app.use('/api', routes);
};

/**
 * Starts the Express server.
 * @param {express.Application} app - The Express application instance.
 */
const startServer = (app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    });
};

const server = initApp();
startServer(server);
