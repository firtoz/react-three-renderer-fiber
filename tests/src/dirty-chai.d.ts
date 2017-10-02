declare module "dirty-chai" {
  function dirtyChai(chai: any, utils: any): void;

  namespace dirtyChai {
  }

  export = dirtyChai;

}

declare namespace Chai {
  /* tslint:disable */
  interface Assertion {
    (): void;
    /* tslint:enable */
  }
}
