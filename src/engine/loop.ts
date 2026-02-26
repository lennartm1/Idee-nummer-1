export class GameLoop {
  private rafId: number | null = null;
  private lastTime = 0;

  constructor(
    private readonly frame: (dt: number) => void,
    private readonly maxStepSeconds = 1 / 20
  ) {}

  start(): void {
    if (this.rafId !== null) {
      return;
    }

    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.rafId === null) {
      return;
    }
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  private tick = (time: number): void => {
    const rawDt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.frame(Math.min(rawDt, this.maxStepSeconds));
    this.rafId = requestAnimationFrame(this.tick);
  };
}
