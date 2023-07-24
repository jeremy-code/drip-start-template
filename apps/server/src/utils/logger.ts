import * as log from "log/mod.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: ({ datetime, levelName, msg }) => {
        return `[${levelName}] ${datetime.toLocaleTimeString()} ${msg}`;
      },
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger();

export default logger;
