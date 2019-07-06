import { IncomingMessage, ServerResponse } from 'http';

export type NextCallback = () => Promise<any>;
export type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextCallback) => any;
export type ComposedMiddleware = (req: IncomingMessage, res: ServerResponse, next?: () => Promise<any>) => Promise<void>;

export default function RequstAndResponseCompose (middleware: Middleware[]): ComposedMiddleware {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return (req: IncomingMessage, res: ServerResponse, next: NextCallback) => {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch (i: number) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(req, res, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
}
