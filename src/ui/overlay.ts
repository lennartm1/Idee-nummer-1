import { GameState } from '../game/types';

interface UiData {
  state: GameState;
  score: number;
  highScore: number;
  muted: boolean;
}

export class OverlayUi {
  private restartHandler: () => void = () => undefined;
  private muteHandler: () => void = () => undefined;

  constructor(private readonly root: HTMLElement) {}

  render(data: UiData): void {
    this.root.innerHTML = '';

    const score = document.createElement('div');
    score.className = 'score';
    score.textContent = `${data.score}`;
    this.root.append(score);

    const controls = document.createElement('div');
    controls.className = 'top-right';
    controls.innerHTML = `<button class="ui-button" id="mute-btn">${data.muted ? 'Unmute' : 'Mute'}</button>`;
    this.root.append(controls);

    const muteBtn = controls.querySelector<HTMLButtonElement>('#mute-btn');
    muteBtn?.addEventListener('click', () => this.muteHandler());

    if (data.state === 'intro') {
      this.addPanel(
        'Flumpy Trump',
        'Tik, klik of druk op spatie/pijl omhoog om te starten. Vermijd de pijpen!'
      );
    }

    if (data.state === 'paused') {
      this.addPanel('Gepauzeerd', 'Druk op P om verder te spelen.');
    }

    if (data.state === 'gameover') {
      const panel = this.addPanel(
        'Game Over',
        `Score: ${data.score} · High score: ${data.highScore}`,
        true
      );
      const restartBtn = panel.querySelector<HTMLButtonElement>('#restart-btn');
      restartBtn?.addEventListener('click', () => this.restartHandler());
    }
  }

  onRestart(handler: () => void): void {
    this.restartHandler = handler;
  }

  onMute(handler: () => void): void {
    this.muteHandler = handler;
  }

  private addPanel(title: string, subtitle: string, withRestart = false): HTMLDivElement {
    const wrap = document.createElement('div');
    wrap.className = 'overlay-center';
    wrap.innerHTML = `
      <div class="panel">
        <h2 class="title">${title}</h2>
        <p class="muted">${subtitle}</p>
        ${withRestart ? '<button id="restart-btn" class="ui-button">Restart</button>' : ''}
      </div>
    `;
    this.root.append(wrap);
    return wrap;
  }
}
