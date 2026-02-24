import * as cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
//import { pinoHttp as pino } from 'pino-http';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger.json';
import v3Router from './routes/v3';
import { router as v3PublicRouter } from './routes/v3/public';

// Config
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser.default());
app.use(express.static('public'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'https://wordrama.io',
    credentials: true,
  }),
);
// Logging middleware
/* app.use(
  pino({
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
    },
  }),
); */

// Mount router
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v3', v3PublicRouter);
app.use('/api/v3', v3Router);

// Initialise
const host = '0.0.0.0';

app.listen(Number(port), host, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});
