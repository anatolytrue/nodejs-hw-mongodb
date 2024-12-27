import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Contacts App',
            version: '1.0.0',
        },
    },
    apis: ['docs/openapi.yaml'],
};

const specs = swaggerJsdoc(options);
export default specs;
