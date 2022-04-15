import type { Handler, HandlerArgs, HandlerReturn, ErrorHandler } from "./types";

const inProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
const defaultNoMatchRoutingHandler = () => new Response(null, { status: 405 });
const defaultErrorHandler = (error) => {
  console.error(error);
  return new Response(inProd ? JSON.stringify(error) : null, { status: 500 });
};

class ApiRouter {
  private chains: {
    get: Handler[];
    post: Handler[];
    put: Handler[];
    patch: Handler[];
    delete: Handler[];
    options: Handler[];
    trace: Handler[];
    head: Handler[];
    connect: Handler[];
    noMatch: Handler[];
    error: ErrorHandler[];
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
      // Set up default handler for noMatch routing
      noMatch: [defaultNoMatchRoutingHandler],
      // Set up default handler for error
      error: [defaultErrorHandler],
    };
  }

  get(...handlers: Handler[]): ApiRouter {
    this.chains.get = [].concat(handlers);
    return this;
  }

  post(...handlers: Handler[]): ApiRouter {
    this.chains.post = [].concat(handlers);
    return this;
  }

  put(...handlers: Handler[]): ApiRouter {
    this.chains.put = [].concat(handlers);
    return this;
  }

  patch(...handlers: Handler[]): ApiRouter {
    this.chains.patch = [].concat(handlers);
    return this;
  }

  delete(...handlers: Handler[]): ApiRouter {
    this.chains.delete = [].concat(handlers);
    return this;
  }

  options(...handlers: Handler[]): ApiRouter {
    this.chains.options = [].concat(handlers);
    return this;
  }

  trace(...handlers: Handler[]): ApiRouter {
    this.chains.trace = [].concat(handlers);
    return this;
  }

  head(...handlers: Handler[]): ApiRouter {
    this.chains.head = [].concat(handlers);
    return this;
  }

  connect(...handlers: Handler[]): ApiRouter {
    this.chains.connect = [].concat(handlers);
    return this;
  }

  noMatch(...handlers: Handler[]): ApiRouter {
    this.chains.noMatch = [].concat(handlers);
    return this;
  }

  error(...handlers: ErrorHandler[]): ApiRouter {
    this.chains.error = [].concat(handlers);
    return this;
  }

  loader(): Handler {
    return (args: HandlerArgs) => {
      return this.handleRequest(args);
    };
  }

  actions(): Handler {
    return (args: HandlerArgs) => {
      return this.handleRequest(args);
    };
  }

  private async handleRequest(args: HandlerArgs): Promise<HandlerReturn> {
    // Find handler using the the HTTP Request method
    // If there is no handler set up for the method of the request, use "no match" handler
    const handlers: Handler[] | undefined = this.chains[args.request.method.toLowerCase()] || this.chains.noMatch;

    // Resolve handlers one by one, stopping and returning the result
    // of the first one that has a value other than 'undefined'
    try {
      for (const handler of handlers) {
        const handlerResult = await handler(args);

        if (handlerResult !== undefined) {
          return handlerResult;
        }
      }
    } catch (err: any) {
      // Use error handler
      for (const handler of this.chains.error) {
        const handlerResult = await handler(err, args);

        if (handlerResult !== undefined) {
          return handlerResult;
        }
      }
    }
  }
}

export default () => new ApiRouter();
