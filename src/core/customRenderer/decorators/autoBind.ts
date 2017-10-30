const functionsToAutoBindSymbol = Symbol("functions-to-auto-bind");
const autoBoundFunctionsSymbol = Symbol("auto-bind-functions");

export function autoBind(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const targetConstructor = target.constructor;
  if (targetConstructor[functionsToAutoBindSymbol] === undefined) {
    Object.defineProperty(targetConstructor, functionsToAutoBindSymbol, {
      configurable: true,
      enumerable: false,
      value: [],
    });
  }

  if (targetConstructor[autoBoundFunctionsSymbol] !== undefined
    && targetConstructor[autoBoundFunctionsSymbol].indexOf(propertyKey) !== -1) {
    console.warn(`The method ${propertyKey} for ${targetConstructor.name} will already be bound` +
      ` in a base class, so no need to re-declare it as @autoBind.`);
    return;
  }

  targetConstructor[functionsToAutoBindSymbol].push(propertyKey);
}

export function bindAcceptor(target: any): any {
  const {
    [functionsToAutoBindSymbol]: functionsToAutoBind,
  } = target;

  if (functionsToAutoBind === undefined) {
    console.warn(target.name + " is a @bindAcceptor but it has no methods with the @autoBind parameter.");
    return target;
  }

  if (target[autoBoundFunctionsSymbol] === undefined) {
    target[autoBoundFunctionsSymbol] = [];
  }

  target[autoBoundFunctionsSymbol] = target[autoBoundFunctionsSymbol].concat(functionsToAutoBind);

  // So that the children won't re-try binding
  delete target[functionsToAutoBindSymbol];

  return class extends (target as new (...args: any[]) => any) {
    constructor(...args: any[]) {
      super(...args);

      functionsToAutoBind.forEach((functionName: string) => {
        this[functionName] = this[functionName].bind(this);
      });
    }
  };
}
