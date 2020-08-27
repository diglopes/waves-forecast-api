import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { UsersCotroller } from '@src/controllers/users';

export interface DecodedUser extends Omit<UsersCotroller, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static gerenateToken(payload: object): string {
    return jwt.sign(payload, config.get('App.auth.secret'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.secret')) as DecodedUser;
  }
}
