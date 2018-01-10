declare const process: {
  env: {
    NODE_ENV: string,
  };
} | undefined;

// if process is undefined, then it is production
// if process env is production, then it is production
const isNonProduction: boolean = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : false;

export default isNonProduction;
