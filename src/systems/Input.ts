export class Input {
  private keys = new Map<string, boolean>();
  private justPressed = new Map<string, boolean>();

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys.get(e.code)) {
        this.justPressed.set(e.code, true);
      }
      this.keys.set(e.code, true);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);
    });
  }

  isDown(code: string): boolean {
    return this.keys.get(code) === true;
  }

  wasPressed(code: string): boolean {
    return this.justPressed.get(code) === true;
  }

  endFrame(): void {
    this.justPressed.clear();
  }
}
