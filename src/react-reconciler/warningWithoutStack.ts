/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

const warningWithoutStack = (condition: boolean, format: string, ...args: any[]) => {
  if (format === undefined) {
    throw new Error(
      "`warningWithoutStack(condition, format, ...args)` requires a warning " +
        "message argument",
    );
  }
  if (args.length > 8) {
    // Check before the condition to catch violations early.
    throw new Error(
      "warningWithoutStack() currently supports at most 8 arguments.",
    );
  }
  if (condition) {
    return;
  }
  if (typeof console !== "undefined") {
    const [a, b, c, d, e, f, g, h] = args.map((item) => "" + item);
    const message = "Warning: " + format;

    // We intentionally don't use spread (or .apply) because it breaks IE9:
    // https://github.com/facebook/react/issues/13610
    switch (args.length) {
      case 0:
        console.error(message);
        break;
      case 1:
        console.error(message, a);
        break;
      case 2:
        console.error(message, a, b);
        break;
      case 3:
        console.error(message, a, b, c);
        break;
      case 4:
        console.error(message, a, b, c, d);
        break;
      case 5:
        console.error(message, a, b, c, d, e);
        break;
      case 6:
        console.error(message, a, b, c, d, e, f);
        break;
      case 7:
        console.error(message, a, b, c, d, e, f, g);
        break;
      case 8:
        console.error(message, a, b, c, d, e, f, g, h);
        break;
      default:
        throw new Error(
          "warningWithoutStack() currently supports at most 8 arguments.",
        );
    }
  }
  try {
    // --- Welcome to debugging React ---
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    let argIndex = 0;
    const message =
      "Warning: " + format.replace(/%s/g, () => args[argIndex++]);
    throw new Error(message);
  } catch (x) { /* Noop */ }
};

export default warningWithoutStack;
