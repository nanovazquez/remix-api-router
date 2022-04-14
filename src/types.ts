export type NextFunction = (error?: Error) => void;

export type MiddlewareArgs = {
  request: Request;
  context: any;
  params: {
    readonly [key: string]: string | undefined;
  };
};

export type MiddlewareReturn = Promise<Response> | Promise<unknown>;
export type Middleware = (args: MiddlewareArgs) => MiddlewareReturn;
