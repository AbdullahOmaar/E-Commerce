// The domain owns this port. Browser storage is one replaceable adapter.
export abstract class CartPersistence {
  abstract readonly available: boolean;
  abstract read(): string | null;
  abstract write(value: string): void;
}
