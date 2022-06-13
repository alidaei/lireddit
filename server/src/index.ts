import path from 'path';
import { MikroORM } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { __prod__ } from './constants';
import { Post } from './entities/post';

const main = async () => {
  // initializing the ORM for connection to the database and configurations
  const orm = await MikroORM.init<PostgreSqlDriver>({
    migrations: {
      path: path.join(__dirname, './migrations'),
    },
    entities: [Post],
    type: 'postgresql',
    dbName: 'lireddit',
    user: 'postgres',
    password: 'alidaei110',
    allowGlobalContext: true,
    debug: !__prod__,
  });

  // calling the migrations to create the tables
  await orm.getMigrator().up();

  const post = orm.em.create(Post, {
    title: 'Hello World',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await orm.em.persistAndFlush(post);
  console.log('-------- sql2 --------');
  await orm.em.nativeInsert(post, { title: 'Hello World' });
};

main().catch((error) => {
  console.log(error);
});
