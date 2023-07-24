import logger from "./logger.ts";

const onError = (error: unknown) => {
  if (error instanceof Error) {
    logger.error(error.message);
    return new Response("Internal server error", { status: 500 });
  }

  logger.error(`Error starting server: ${JSON.stringify(error)}`);
  return new Response("Internal server error", { status: 500 });
};

export default onError;
