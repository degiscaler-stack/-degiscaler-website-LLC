/**
 * Minimal TypeScript declarations for the Paddle Billing (v2) browser SDK.
 * Loaded via https://cdn.paddle.com/paddle/v2/paddle.js
 */

interface PaddleCheckoutItem {
  priceId: string;
  quantity?: number;
}

interface PaddleCheckoutOpenParams {
  items: PaddleCheckoutItem[];
}

interface PaddleEventData {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
}

interface PaddleInitializeOptions {
  token: string;
  eventCallback?: (event: PaddleEventData) => void;
}

interface PaddleCheckout {
  open(params: PaddleCheckoutOpenParams): void;
}

interface PaddleEnvironment {
  set(env: 'production'): void;
}

interface PaddleInstance {
  Initialize(options: PaddleInitializeOptions): void;
  Checkout: PaddleCheckout;
  Environment: PaddleEnvironment;
}

declare global {
  interface Window {
    Paddle?: PaddleInstance;
    /** Set to true by PaddleProvider after Paddle.Initialize() succeeds. */
    _paddleInitialized?: boolean;
  }
}

export {};
