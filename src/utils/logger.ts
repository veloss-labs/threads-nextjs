export interface Logger extends Record<string, any> {
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  success: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
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
  success: (message: string, ...args: any[]) => {
    console.log(
      `%c${message}`,
      'color: #fff; background-color: #28a745; padding: 2px 4px; border-radius: 4px;',
      ...args,
    );
  },
  info: (message: string, ...args: any[]) => {
    console.log(
      `%c${message}`,
      'color: #fff; background-color: #17a2b8; padding: 2px 4px; border-radius: 4px;',
      ...args,
    );
  },
};

export default logger;
