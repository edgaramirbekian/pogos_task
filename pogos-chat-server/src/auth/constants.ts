import { randomBytes } from 'crypto';

export const jwtConstants = {
  secret: randomBytes(64).toString('hex'),
};
