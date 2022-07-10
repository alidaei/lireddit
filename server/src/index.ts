import 'reflect-metadata';
import path from 'path';
import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { __prod__, COOKIE_NAME } from './constants';
import { Post } from '../src/entities/post';
import { User } from '../src/entities/user';
import { PostResolver } from '../src/resolvers/post';
import { UserResolver } from '../src/resolvers/user';
import { MyContext } from './types';

const RedisServer = require('redis-server');

const main = async () => {
  // initializing the ORM for connection to the database and configurations
  const orm = await MikroORM.init<PostgreSqlDriver>({
    migrations: {
      path: path.join(__dirname, '../migrations'),
    },
    entities: [Post, User],
    type: 'postgresql',
    dbName: 'lireddit',
    user: 'postgres',
    password: 'alidaei110',
    allowGlobalContext: true,
    debug: !__prod__,
  });

  // calling the migrator to create the tables
  await orm.getMigrator().up();

  // creating the express app for the server
  const app = express();

  // Simply pass the port that you want a Redis server to listen on.
  new RedisServer(6379);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.set('trust proxy', 1);

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      saveUninitialized: false,
      secret: 'qlflkefkeofklkflskfosfkokeflksss',
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: false, // cookie only works in https
      },
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((error) => {
  console.log(error);
});
