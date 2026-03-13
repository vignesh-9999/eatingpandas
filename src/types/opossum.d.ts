declare module "opossum" {
  interface CircuitBreakerOptions {
    timeout?: number;
    errorThresholdPercentage?: number;
    resetTimeout?: number;
  }

  export default class CircuitBreaker<TResult> {
    constructor(action: () => Promise<TResult>, options?: CircuitBreakerOptions);
    fire(): Promise<TResult>;
    readonly opened: boolean;
  }
}
