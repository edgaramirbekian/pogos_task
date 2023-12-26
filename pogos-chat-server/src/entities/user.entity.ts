import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

interface IUser {
  id: string;
  username: string;
  passwordHash: string;
  isLoggedIn: boolean;
}

export const allUsers = new Map<string, User>();

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export class User implements IUser {
  id: string;
  username: string;
  passwordHash: string;
  isLoggedIn: boolean;
  jwt: string;

  constructor(username: string, passwordHash: string) {
    this.id = randomBytes(16).toString('hex');
    this.username = username;
    this.passwordHash = passwordHash;
  }

  logInOut(isIn: boolean) {
    this.isLoggedIn = isIn;
  }
}

type userFactory = User | null;

export const userFactory = async (
  username: string,
  password: string,
): Promise<userFactory> => {
  if (!allUsers.has(username)) {
    const passHash = await hashPassword(password);
    const newUser = new User(username, passHash);
    allUsers.set(newUser.username, newUser);
    return allUsers.get(newUser.username);
  }
  return null;
};
