import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createRedisClient } from 'redis';
import Stripe from 'stripe';
import { ServiceBusClient } from '@azure/service-bus';

import { Database } from './database.types';

import * as sockets from './websocket';

// Import the configured express app
import app from './app';

// Setting the default port for express
let port: number = 5000;

// If a port is configured as an environment variable
// use that over the hard-coded port
if (process?.env?.PORT) {
  port = parseInt(process.env.PORT);
}

const supabase = createSupabaseClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const redisClient = createRedisClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD || undefined
});
async function initRedisConnection() {
   try { 
    await redisClient.connect();
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.set('STARTED', 'Redis Client Connected');
    const v = await redisClient.get('STARTED');
    console.log(v);
  } catch (e) {
    console.error(e);
  }
}

const stripe = new Stripe(process.env.STRIPE_SK || '');
const serviceBusClient = new ServiceBusClient(process?.env?.SERVICE_BUS_SERVICE_CONNECTION);

// Start express listening on the above port
const server = app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

initRedisConnection();
sockets.init(server);

export {
  stripe,
  supabase,
  redisClient,
  serviceBusClient
};
