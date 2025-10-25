import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    logIn: (user: any, done: (err: Error | null) => void) => void;
  }
}