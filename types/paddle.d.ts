/**
 * Minimal TypeScript declarations for the Paddle Billing (v2) browser SDK.
 * Loaded via https://cdn.paddle.com/paddle/v2/paddle.js
 */

interface PaddleCheckoutSettings {
  displayMode?: 'overlay' | 'inline';
  theme?: 'dark' | 'light';
  locale?: string;
  successUrl?: string;
  frameTarget?: string;
  frameInitialHeight?: number;
  frameStyle?: string;
}

interface PaddleCheckoutItem {
  priceId: string;
  quantity?: number;
}

interface PaddleCheckoutCustomer {
  email?: string;
}

interface PaddleCheckoutOpenParams {
  items: PaddleCheckoutItem[];
  settings?: PaddleCheckoutSettings;
  customer?: PaddleCheckoutCustomer;
  customData?: Record<string, string>;
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
  set(env: 'production' | 'sandbox'): void;
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
