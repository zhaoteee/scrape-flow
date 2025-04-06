export const LogLevels = ["info", "error"] as const;

export type logLevel = (typeof LogLevels)[number];
export type LogFunction = (message: string) => void;
export type Log = { message: string; level: logLevel; timestamp: Date };

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in logLevel]: LogFunction;
};
