import { resolve } from 'path';
import Fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import fastifyJwt from 'fastify-jwt';
import { JWT_SECRET, BASE_PATH } from '$/config/env';
import server from './$server';
import { logger } from '$/utils/logger';

const fastify = Fastify();

fastify.register(fastifyHelmet);
fastify.register(fastifyCors, {
  exposedHeaders: ['Authorization'],
  origin: ['https://technote-space.github.io', /localhost/],
});
fastify.register(fastifyStatic, {
  root: resolve(process.cwd(), 'public'),
  prefix: BASE_PATH,
});
fastify.register(fastifyJwt, { secret: JWT_SECRET });

server(fastify, { basePath: BASE_PATH });
fastify.addHook('onError', (req, reply, error, done) => {
  logger.error(error);
  done();
});

fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (req, body, done) => {
    try {
      done(null, {
        raw: body,
      });
    } catch (error) {
      error.statusCode = 400;
      done(error, undefined);
    }
  },
);

export default fastify;
