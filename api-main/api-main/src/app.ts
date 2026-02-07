// Node Modules
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

const logger = morgan;

dotenv.config();

// Importing custom middleware
import { notFound, errorHandler } from './middleware';

// Importing API routes
import apiV1 from './api/v1';
import apiV2 from './api/v2';

const app = express();

// Configuring middleware in express
app.use(logger('dev', {
  skip: (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.statusCode < 400;
    }
    return false;
  }
}));
app.use(helmet());
app.use(cors());
app.use(express.json({limit: '2mb'}));

// Health route
app.get('/health', (req, res) => {
  res.send('OK');
});

// Adding imported routes to express
app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);

// Adding imported, custom middleware to express
app.use(notFound);
app.use(errorHandler);

export default app;
