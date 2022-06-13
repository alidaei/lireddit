import { MikroORM } from '@mikro-orm/core';

import { __prod__ } from './constants';
import { Post } from './entities/post';

export default {
  entities: [Post],
  type: 'postgresql',
  dbName: 'lireddit',
  user: 'postgres',
  password: 'alidaei110',
  allowGlobalContext: true,
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
