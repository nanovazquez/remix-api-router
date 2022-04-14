export type NextFunction = (error?: Error) => void;

export type HandlerArgs = {
  request: Request;
  context: any;
  params: {
    readonly [key: string]: string | undefined;
  };
};

export type HandlerReturn = Promise<Response> | Response | Promise<unknown> | unknown;
export type Handler = (args: HandlerArgs) => HandlerReturn;
export type ErrorHandler = (error: any, args: HandlerArgs) => HandlerReturn;
