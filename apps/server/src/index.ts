import { serve } from "http/server.ts";

import { logger, onError, Router } from "./utils/mod.ts";

const port = 8000;

const router = new Router();

const loggingMiddleware = async (
  req: Request,
  _params: Record<string, string>,
  next: () => Promise<Response> | Response
) => {
  logger.info(`Incoming request for ${req.url}`);
  return await next();
};

router.get(
  "/",
  () => {
    return new Response("Hello World!", { status: 200 });
  },
  loggingMiddleware
);

router.get("/about", () => {
  return new Response("This is the route for /about!", { status: 200 });
});

serve(async (req) => await router.route(req), {
  port,
  onListen({ port, hostname }) {
    logger.info(`Listener started at http://${hostname}:${port}`);
  },
  onError,
});
