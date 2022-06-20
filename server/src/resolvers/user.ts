import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import argon2 from 'argon2';

import { User } from '../entities/user';
import { MyContext } from './../types';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}