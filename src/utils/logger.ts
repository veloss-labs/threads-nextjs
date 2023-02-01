export interface Logger extends Record<string, any> {
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

const logger: Logger = {
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    console.debug(message, ...args);
  },
};

export default logger;
