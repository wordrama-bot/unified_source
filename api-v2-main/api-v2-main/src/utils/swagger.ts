import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Wordrama REST API',
    description: ''
  },
  host: 'localhost:6969',
  basePath: '/'
};

const outputFile = 'swagger.json';
const routes = [
  '../routes/v3/public.ts',
  '../routes/v3/index.ts',
];

swaggerAutogen(
  outputFile, 
  routes,
  doc
);
