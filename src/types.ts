export type NextFunction = (error?: Error) => void;

export interface AppLoadContext {
  [key: string]: unknown;
}

export type HandlerArgs = {
  request: Request;
  context: AppLoadContext;
  params: {
    readonly [key: string]: string | undefined;
  };
};

export type HandlerReturn<T = unknown> = Promise<Response> | Response | Promise<T> | T;
export type Handler = (args: HandlerArgs) => HandlerReturn;
export type ErrorHandler<T = unknown> = (args: HandlerArgs, error: T) => HandlerReturn;
