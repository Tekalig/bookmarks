import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import * as argon from 'argon2';
import { AuthPayload } from './payload';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(payload: AuthPayload) {
    // hash password
    const password = await argon.hash(payload.password);

    // create a new user in the database
    try {
      const user = await this.db.user.create({
        data: {
          email: payload.email,
          password,
        },
      });

      return this.signToken(user.email, user.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(payload: AuthPayload) {
    // find user from database
    const user = await this.db.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    // checks if the user is exists
    if (!user) throw new ForbiddenException('Incorrect Credentials');

    // verify the password if it match using argon
    const matches = await argon.verify(user.password, payload.password);

    // checks if it matches
    if (!matches) throw new ForbiddenException('Incorrect Credentials');

    // return the user
    return this.signToken(user.email, user.id);
  }

  async signToken(
    email: string,
    userId: number,
  ): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret: string = this.config.get('JWT_SECRET') ?? '';

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token,
    };
  }
}
