import apiRouter from "../../../../../src/ApiRouter";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, DataFunctionArgs } from "@remix-run/node";

/**
 * /api/products
 */

async function checkAuth() {
  await fetch("https://google.com");
  //return json({ status: "ok!" }, { status: 200 });
}

function checkAuthFail() {
  throw new Error("bla");
  // return json({ error: "Unauthorized" }, { status: 401 });
}

// Define all routes
apiRouter()
  .get(checkAuth, async (args: DataFunctionArgs) => {
    await fetch("https://google.com");
    return json({ method: "GET" }, 200);
  })
  .post(checkAuthFail, (args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .put((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .patch((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .delete((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .error((err) => {
    return json({ any: "thing" }, 501);
  });

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
