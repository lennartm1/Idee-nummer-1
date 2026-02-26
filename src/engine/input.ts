export class InputHandler {
  private flapPressed = false;
  private pausePressed = false;

  constructor(private readonly target: HTMLElement | Window) {}

  mount(): void {
    window.addEventListener('keydown', this.onKeyDown);
    this.target.addEventListener('pointerdown', this.onPointer, { passive: false });
    this.target.addEventListener('touchstart', this.onTouch, { passive: false });
  }

  unmount(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('pointerdown', this.onPointer);
    this.target.removeEventListener('touchstart', this.onTouch);
  }

  consumeFlap(): boolean {
    const active = this.flapPressed;
    this.flapPressed = false;
    return active;
  }

  consumePause(): boolean {
    const active = this.pausePressed;
    this.pausePressed = false;
    return active;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      this.flapPressed = true;
    }

    if (event.code === 'KeyP') {
      this.pausePressed = true;
    }
  };

  private onPointer = (event: Event): void => {
    event.preventDefault();
    this.flapPressed = true;
  };

  private onTouch = (event: Event): void => {
    event.preventDefault();
  };
}
