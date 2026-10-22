import 'express-async-errors';

import * as cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {
  Express,
  NextFunction,
  Request,
  Response,
} from 'express';
// import { pinoHttp as pino } from 'pino-http';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger.json';
import v3Router from './routes/v3';
import { router as v3PublicRouter } from './routes/v3/public';
import { router as billingWebhookRouter } from './routes/v3/billingWebhook';

// Config
dotenv.config();

const app: Express = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  '/api/v3/billing/webhook',
  express.raw({ type: 'application/json' }),
  billingWebhookRouter,
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser.default());
app.use(express.static('public'));

// CORS (supports comma-separated list in CORS_ORIGIN, e.g. "https://wordrama.io,https://www.wordrama.io")
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

// Logging middleware
/*
app.use(
  pino({
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
    },
  }),
);
*/

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v3', v3PublicRouter);
app.use('/api/v3', v3Router);

// Final request error handler.
// express-async-errors forwards rejected async route promises here.
app.use(
  (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    console.error('[express] unhandled request error', {
      method: req.method,
      path: req.originalUrl,
      error,
    });

    if (res.headersSent) {
      return next(error);
    }

    return res.status(500).json({
      status: 500,
      count: 0,
      data: {},
      message: 'Internal server error.',
    });
  },
);

// Initialise
const host = '0.0.0.0';

app.listen(Number(port), host, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});