const STORAGE_KEY = 'dodgeRock.v1.coins';

/**
 * Persists the player's coin total in `localStorage` so it survives refresh and game over.
 */
export class CoinWallet {
  private total = 0;

  constructor() {
    this.total = CoinWallet.readStored();
  }

  private static readStored(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return 0;
      const n = Number.parseInt(raw, 10);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(n, 999_999_999);
    } catch {
      return 0;
    }
  }

  get coins(): number {
    return this.total;
  }

  /** Adds coins, clamps to sane range, persists. Returns new balance. */
  add(amount: number): number {
    const a = Math.max(0, Math.floor(amount));
    if (a === 0) return this.total;
    this.total = Math.min(this.total + a, 999_999_999);
    try {
      localStorage.setItem(STORAGE_KEY, String(this.total));
    } catch {
      // Private mode / quota — gameplay still works in-session.
    }
    return this.total;
  }
}
