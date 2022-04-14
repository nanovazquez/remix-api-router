import apiRouter from "../../../../../src/index";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  DataFunctionArgs,
} from "@remix-run/node";

/**
 * /api/products
 */

async function checkAuth() {
  await fetch("https://google.com");
  //return json({ status: "ok!" }, { status: 200 });
}

function checkAuthFail() {
  return json({ error: "Unauthorized" }, { status: 401 });
}

// Define all routes
const router = apiRouter();
router
  .get(checkAuth, async (args: DataFunctionArgs) => {
    await fetch("https://google.com");
    return json({ method: "GET" }, 200);
  })
  .post(checkAuthFail, (args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .put((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .patch((args: DataFunctionArgs) => json({ method: "GET" }, 200))
  .delete((args: DataFunctionArgs) => json({ method: "GET" }, 200));

export const loader: LoaderFunction = router.loader();
export const action: ActionFunction = router.actions();
