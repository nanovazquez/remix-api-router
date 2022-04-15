export type NextFunction = (error?: Error) => void;

export type HandlerArgs = {
  request: Request;
  context: unknown;
  params: {
    readonly [key: string]: string | undefined;
  };
};

export type HandlerReturn = Promise<Response> | Response | Promise<unknown> | unknown;
export type Handler = (args: HandlerArgs) => HandlerReturn;
export type ErrorHandler<T = unknown> = (args: HandlerArgs, error: T) => HandlerReturn;
