import 'reflect-metadata';
import path from 'path';
import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { __prod__ } from './constants';
import { Post } from '../src/entities/post';
import { User } from '../src/entities/user';
import { PostResolver } from '../src/resolvers/post';
import { UserResolver } from '../src/resolvers/user';

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
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((error) => {
  console.log(error);
});
