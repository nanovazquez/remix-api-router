import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  /* handle "GET" */
  return json({ success: true }, 200);
};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      /* handle "POST" */
      return json({ success: true }, 201);
    }
    case "PUT": {
      /* handle "PUT" */
      return json({ success: true }, 200);
    }
    case "PATCH": {
      /* handle "PATCH" */
      return json({ success: true }, 200);
    }
    case "DELETE": {
      /* handle "DELETE" */
      return json({ success: true }, 200);
    }
  }
};
