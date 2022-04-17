import "isomorphic-fetch";
import ApiRouter from "../../src/ApiRouter";
import { apiRouter } from "../../src/ApiRouter";

describe("ApiRouter unit tests", () => {
  let router: ApiRouter;

  beforeEach(() => {
    router = new ApiRouter();
  });

  test("should set up default handler for noMatch", () => {
    expect((router as any).chains.noMatch).toBeDefined();
    expect((router as any).chains.noMatch.length).toBe(1);
  });

  test("should set up default handler for error", () => {
    expect((router as any).chains.error).toBeDefined();
    expect((router as any).chains.error.length).toBe(1);
  });

  describe("factory function", () => {
    test("should initialize a new ApiRouter instance on each invocation", () => {
      const routerFnInstance1 = apiRouter();
      const routerFnInstance2 = apiRouter();
      routerFnInstance2.get(() => undefined);
      expect(router).toBe(router);
      expect(routerFnInstance1).toBe(routerFnInstance1);
      expect(routerFnInstance2).toBe(routerFnInstance2);
      expect(router).not.toBe(routerFnInstance1);
      expect(router).not.toBe(routerFnInstance2);
      expect(routerFnInstance1).not.toBe(routerFnInstance2);
    });
  });

  describe("setup", () => {
    test("should be able to add handlers to all chains", () => {
      const handlerGet = () => 1;
      const handlerPost = () => 2;
      const handlerPut = () => 3;
      const handlerPatch = () => 4;
      const handlerDelete = () => 5;
      const handlerOptions = () => 6;
      const handlerNoMatch = () => 7;
      const handlerError = () => 8;

      router.get(handlerGet);
      router.post(handlerPost);
      router.put(handlerPut);
      router.patch(handlerPatch);
      router.delete(handlerDelete);
      router.options(handlerOptions);
      router.noMatch(handlerNoMatch);
      router.error(handlerError);

      expect((router as any).chains.get).toStrictEqual([handlerGet]);
      expect((router as any).chains.post).toStrictEqual([handlerPost]);
      expect((router as any).chains.put).toStrictEqual([handlerPut]);
      expect((router as any).chains.patch).toStrictEqual([handlerPatch]);
      expect((router as any).chains.delete).toStrictEqual([handlerDelete]);
      expect((router as any).chains.options).toStrictEqual([handlerOptions]);
      expect((router as any).chains.noMatch).toStrictEqual([handlerNoMatch]);
      expect((router as any).chains.error).toStrictEqual([handlerError]);
    });

    test("should be able to add multiple handlers to a single chain", () => {
      const handler1 = () => 1;
      const handler2 = () => 2;
      const handler3 = () => 3;
      router.get(handler1, handler2).post(handler3);

      expect((router as any).chains.get).toStrictEqual([handler1, handler2]);
      expect((router as any).chains.post).toStrictEqual([handler3]);
    });

    // test("should throw an error if trying to add an invalid handler", () => {
    //   const handler1 = "invalid";
    //   let result;

    //   try {
    //     router.get(handler1 as any);
    //   } catch(err) {
    //     result = err;
    //   }

    //   expect(result).toBeDefined();
    //   expect(result).toBe("TBC");
    // });
  });

  describe("execution", () => {
    test("should be able to execute multiple handlers", async () => {
      let handler1Executed = false;
      let handler2Executed = false;
      const handler1 = () => {
        handler1Executed = true;
        return;
      };
      const handler2 = () => {
        handler2Executed = true;
        return;
      };

      router.put(handler1, handler2);
      await router.handle({ request: { method: "PUT" } as Request, context: "context", params: {} });

      expect(handler1Executed).toBe(true);
      expect(handler2Executed).toBe(true);
    });

    test("should pass same args to handlers", async () => {
      let handler1Args;
      let handler2Args;

      const handler1 = (args) => {
        handler1Args = args;
        return;
      };
      const handler2 = (args) => {
        handler2Args = args;
        return;
      };

      router.patch(handler1, handler2);
      await router.handle({ request: { method: "PATCH" } as Request, context: "context", params: {} });

      expect(handler1Args).toBeDefined();
      expect(handler1Args).toBe(handler2Args);
    });

    test("should stop execution when a handler returns a value", async () => {
      let handler1Executed = false;
      let handler2Executed = false;
      const handler1 = () => {
        handler1Executed = true;
        return "executed!";
      };
      const handler2 = () => {
        handler2Executed = true;
        return;
      };

      router.delete(handler1, handler2);
      await router.handle({ request: { method: "DELETE" } as Request, context: "context", params: {} });

      expect(handler1Executed).toBe(true);
      expect(handler2Executed).toBe(false);
    });

    test("should handle a 'no match' by default", async () => {
      const result1 = await router.handle({ request: { method: "DELETE" } as Request, context: "context", params: {} });
      expect(result1).toBeDefined();
      expect((result1 as Response).status).toBe(405);

      const result2 = await router.handle({ request: { method: "BLA" } as Request, context: "context", params: {} });
      expect(result2).toBeDefined();
      expect((result2 as Response).status).toBe(405);
    });

    test("should handle errors by default", async () => {
      const handler = () => {
        const error = new Error("bla");
        throw error;
      };
      router.options(handler);
      const result = await router.handle({ request: { method: "OPTIONS" } as Request, context: "context", params: {} });

      expect(result).toBeDefined();
      expect((result as Response).status).toBe(500);
    });

    test("should execute a GET handler when invoking loader()", async () => {
      const handler = () => 1;
      router.get(handler);
      const result = await router.loader()({ request: { method: "GET" } as Request, context: "context", params: {} });

      expect(result).toBe(1);
    });

    test("should execute a non GET handler when invoking action()", async () => {
      const handler = () => 1;
      router.patch(handler);
      const result = await router.actions()({
        request: { method: "PATCH" } as Request,
        context: "context",
        params: {},
      });

      expect(result).toBe(1);
    });
  });
});
