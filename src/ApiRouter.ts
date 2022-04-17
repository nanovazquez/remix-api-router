import type { Handler, HandlerArgs, HandlerReturn, ErrorHandler } from "./types";

const inProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
const defaultNoMatchRoutingHandler: Handler = () => {
  return new Response(null, { status: 405 });
};
const defaultErrorHandler: ErrorHandler = (args, error) => {
  console.error(error);
  return new Response(inProd ? JSON.stringify(error) : null, { status: 500 });
};

class ApiRouter {
  private chains: {
    get?: Handler[];
    post?: Handler[];
    put?: Handler[];
    patch?: Handler[];
    delete?: Handler[];
    options?: Handler[];
    trace?: Handler[];
    head?: Handler[];
    connect?: Handler[];
    noMatch: Handler[];
    error: ErrorHandler[];
  };

  constructor() {
    this.chains = {
      // Set up default handler for noMatch routing
      noMatch: [defaultNoMatchRoutingHandler],
      // Set up default handler for error
      error: [defaultErrorHandler],
    };
  }

  /**
   * Sets up handlers for a GET request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  get(...handlers: Handler[]): ApiRouter {
    this.chains.get = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a POST request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  post(...handlers: Handler[]): ApiRouter {
    this.chains.post = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a PUT request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  put(...handlers: Handler[]): ApiRouter {
    this.chains.put = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a PATCH request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  patch(...handlers: Handler[]): ApiRouter {
    this.chains.patch = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a DELETE request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  delete(...handlers: Handler[]): ApiRouter {
    this.chains.delete = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for an OPTIONS request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  options(...handlers: Handler[]): ApiRouter {
    this.chains.options = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a TRACE request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  trace(...handlers: Handler[]): ApiRouter {
    this.chains.trace = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a HEAD request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  head(...handlers: Handler[]): ApiRouter {
    this.chains.head = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for a CONNECT request.
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  connect(...handlers: Handler[]): ApiRouter {
    this.chains.connect = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for requests with no match with other configured handlers
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  noMatch(...handlers: Handler[]): ApiRouter {
    this.chains.noMatch = [].concat(handlers);
    return this;
  }

  /**
   * Sets up handlers for an error that happens during the request process
   * @param handlers The handlers for the request
   * @returns The ApiRouter instance to chain other handlers
   */
  error(...handlers: ErrorHandler[]): ApiRouter {
    this.chains.error = [].concat(handlers);
    return this;
  }

  /**
   * Returns a function that, when executed, triggers the router handling process
   * @returns A function that will execute the router handling process
   */
  loader(): Handler {
    return this.handle.bind(this);
  }

  /**
   * Returns a function that, when executed, triggers the router handling process
   * @returns A function that will execute the router handling process
   */
  actions(): Handler {
    return this.handle.bind(this);
  }

  /**
   * Triggers the router handling process
   * @param args The arguments of the router handling process
   * @returns The response of the router handling process
   */
  handle(args: HandlerArgs): Promise<unknown> {
    return this.handleRequest(args);
  }

  private async handleRequest(args: HandlerArgs): Promise<HandlerReturn> {
    // Find handler using the the HTTP Request method
    // If there is no handler set up for the method of the request, use "no match" handler
    const handlers: Handler[] | undefined = this.chains[args.request.method.toLowerCase()] || this.chains.noMatch;

    // Resolve handlers one by one, stopping and returning the result
    // of the first one that has a value other than 'undefined'
    try {
      return await this.executeHandlers(handlers, args);
    } catch (err: unknown) {
      // Use error handlers
      return await this.executeHandlers(this.chains.error, args);
    }
  }

  private async executeHandlers(
    handlers: Handler[] | ErrorHandler[],
    args: HandlerArgs,
    error?: unknown
  ): Promise<unknown> {
    for (const handler of handlers) {
      const handlerResult = await handler(args, error);
      if (handlerResult !== undefined) {
        return handlerResult;
      }
    }
  }
}

export default ApiRouter;
export const apiRouter = () => new ApiRouter();
