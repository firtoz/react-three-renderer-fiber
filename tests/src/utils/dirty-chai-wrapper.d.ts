import "./dirty-chai";

declare namespace Chai {
  /* tslint:disable */
  interface Assertion {
    (...args: any[]): void;

    bleepbloop(): void;

  }

  interface TypeComparison {
    (...args: any[]): void;
  }

  /* tslint:enable */
}
