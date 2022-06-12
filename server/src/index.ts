import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from '../src/constants';
import { Post } from './entities/post';

const main = async () => {
  const orm = await MikroORM.init({
    entities: [Post],
    dbName: 'lireddit',
    type: 'postgresql',
    debug: !__prod__,
  });
};

main();
