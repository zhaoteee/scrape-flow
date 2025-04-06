import {
  Log,
  LogCollector,
  LogFunction,
  logLevel,
  LogLevels,
} from "@/types/log";

export function createLogCollector(): LogCollector {
  const logs: Log[] = [];
  const getAll = () => logs;
  const logFunctions = {} as Record<logLevel, LogFunction>;
  LogLevels.forEach((level) => {
    return (logFunctions[level] = (message: string) => {
      logs.push({ message, level, timestamp: new Date() });
    });
  });
  return {
    getAll,
    ...logFunctions,
  };
}
