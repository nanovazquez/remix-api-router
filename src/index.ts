import type { MiddlewareArgs, Middleware, MiddlewareReturn } from "./types";

class ApiRouter {
  private chains: {
    get: Middleware[];
    post: Middleware[];
    put: Middleware[];
    patch: Middleware[];
    delete: Middleware[];
    options: Middleware[];
    trace: Middleware[];
    head: Middleware[];
    connect: Middleware[];
  };

  constructor() {
    this.chains = {
      get: [],
      post: [],
      put: [],
      patch: [],
      delete: [],
      options: [],
      trace: [],
      head: [],
      connect: [],
    };
  }

  get(...middlewares: Middleware[]): ApiRouter {
    this.chains.get = [].concat(this.chains.post, middlewares);
    return this;
  }

  post(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  put(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  patch(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  delete(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  options(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  trace(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  head(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  connect(...middlewares): ApiRouter {
    this.chains.post = [].concat(this.chains.post, middlewares);
    return this;
  }

  loader(): Middleware {
    return (args: MiddlewareArgs) => {
      return this.handleRequest(args);
    };
  }

  actions(): Middleware {
    return (args: MiddlewareArgs) => {
      return this.handleRequest(args);
    };
  }

  private handleRequest(args: MiddlewareArgs): MiddlewareReturn {
    const handlers = this.chains[args.request.method.toLowerCase()];

    // If there is no handler, return 405 Method not allowed
    if (!handlers?.length) {
      return new Response(null, { status: 405 });
    }

    // Resolve all middlewares, returning the result of the last middleware
    // that has a value other than 'undefined'
    let result: MiddlewareReturn = null;

    handlers.forEach((handler) => {
      const handlerResult = handler(args);

      if (handlerResult != undefined) {
        result = handlerResult;
      }
    });

    return result;
  }
}

export default () => new ApiRouter();
