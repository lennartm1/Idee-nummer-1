import { InputHandler } from '../engine/input';
import {
  CEILING_Y,
  FLAP_IMPULSE,
  GRAVITY,
  GROUND_HEIGHT,
  HIGH_SCORE_KEY,
  MAX_FALL_SPEED,
  PIPE_SPAWN_EVERY,
  PIPE_WIDTH,
  PLAYER_RADIUS,
  PLAYER_START_Y,
  PLAYER_X,
  WORLD_HEIGHT,
  WORLD_WIDTH
} from './config';
import { circleIntersectsRect } from './collision';
import { computeGap, computeSpeed } from './difficulty';
import { generateGapY } from './pipes';
import { Renderer } from './renderer';
import { collectPassedPipes } from './scoring';
import { GameState, Particle, PipePair, Player } from './types';
import { SeededRng } from '../utils/rng';

export interface GameUi {
  render(data: { state: GameState; score: number; highScore: number; muted: boolean }): void;
  onRestart(handler: () => void): void;
  onMute(handler: () => void): void;
}

export class FlumpyTrumpGame {
  private readonly rng = new SeededRng(Date.now());
  private readonly player: Player = {
    position: { x: PLAYER_X, y: PLAYER_START_Y },
    velocityY: 0,
    radius: PLAYER_RADIUS,
    rotation: 0
  };

  private state: GameState = 'intro';
  private score = 0;
  private highScore = 0;
  private elapsed = 0;
  private shake = 0;
  private spawnTimer = 0;
  private nextPipeId = 1;
  private pipes: PipePair[] = [];
  private particles: Particle[] = [];
  private muted = false;

  constructor(
    private readonly renderer: Renderer,
    private readonly input: InputHandler,
    private readonly ui: GameUi
  ) {
    this.highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0);
    this.ui.onRestart(() => this.reset('playing'));
    this.ui.onMute(() => {
      this.muted = !this.muted;
      this.pushUi();
    });
    this.pushUi();
  }

  update(dt: number): void {
    this.elapsed += dt;

    if (this.input.consumePause() && this.state === 'playing') {
      this.state = 'paused';
      this.pushUi();
    } else if (this.input.consumePause() && this.state === 'paused') {
      this.state = 'playing';
      this.pushUi();
    }

    const flap = this.input.consumeFlap();
    if (flap) {
      if (this.state === 'intro') {
        this.reset('playing');
      }
      if (this.state === 'gameover') {
        this.reset('playing');
      }
      if (this.state === 'playing') {
        this.player.velocityY = FLAP_IMPULSE;
        this.spawnFlapParticles();
      }
    }

    if (this.state !== 'playing') {
      this.updateParticles(dt);
      return;
    }

    const speed = computeSpeed(this.score);
    const gap = computeGap(this.score);

    this.player.velocityY = Math.min(this.player.velocityY + GRAVITY * dt, MAX_FALL_SPEED);
    this.player.position.y += this.player.velocityY * dt;
    this.player.rotation = Math.max(-0.7, Math.min(1.1, this.player.velocityY / 580));

    this.spawnTimer += dt;
    if (this.spawnTimer >= PIPE_SPAWN_EVERY) {
      this.spawnTimer = 0;
      this.pipes.push({
        id: this.nextPipeId++,
        x: WORLD_WIDTH + PIPE_WIDTH,
        width: PIPE_WIDTH,
        gapY: generateGapY(gap, () => this.rng.next()),
        gapSize: gap,
        passed: false
      });
    }

    this.pipes.forEach((pipe) => {
      pipe.x -= speed * dt;
    });
    this.pipes = this.pipes.filter((pipe) => pipe.x + pipe.width > -20);

    const gained = collectPassedPipes(this.pipes, this.player);
    if (gained > 0) {
      this.score += gained;
      this.pushUi();
    }

    this.checkCollision();
    this.updateParticles(dt);
  }

  render(): void {
    const speed = computeSpeed(this.score);
    this.renderer.draw(this.elapsed, this.player, this.pipes, this.particles, speed, this.shake);
    this.shake = Math.max(0, this.shake - 0.6);
  }

  resize(canvas: HTMLCanvasElement): void {
    this.renderer.resize(canvas);
  }

  private reset(nextState: GameState): void {
    this.state = nextState;
    this.score = 0;
    this.spawnTimer = 0;
    this.pipes = [];
    this.particles = [];
    this.shake = 0;
    this.player.position.y = PLAYER_START_Y;
    this.player.velocityY = 0;
    this.player.rotation = 0;
    this.pushUi();
  }

  private checkCollision(): void {
    const playerCircle = {
      x: this.player.position.x,
      y: this.player.position.y,
      radius: this.player.radius * 0.85
    };

    const hitBounds =
      this.player.position.y - this.player.radius <= CEILING_Y ||
      this.player.position.y + this.player.radius >= WORLD_HEIGHT - GROUND_HEIGHT;

    const hitPipe = this.pipes.some((pipe) => {
      const topRect = { x: pipe.x, y: 0, width: pipe.width, height: pipe.gapY - pipe.gapSize / 2 };
      const bottomRect = {
        x: pipe.x,
        y: pipe.gapY + pipe.gapSize / 2,
        width: pipe.width,
        height: WORLD_HEIGHT - GROUND_HEIGHT - (pipe.gapY + pipe.gapSize / 2)
      };
      return circleIntersectsRect(playerCircle, topRect) || circleIntersectsRect(playerCircle, bottomRect);
    });

    if (hitBounds || hitPipe) {
      this.state = 'gameover';
      this.shake = 7;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      }
      this.pushUi();
    }
  }

  private updateParticles(dt: number): void {
    this.particles.forEach((particle) => {
      particle.life -= dt;
      particle.position.x += particle.velocity.x * dt;
      particle.position.y += particle.velocity.y * dt;
      particle.velocity.y += 600 * dt;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  private spawnFlapParticles(): void {
    for (let i = 0; i < 8; i += 1) {
      const spread = (this.rng.next() - 0.5) * 180;
      this.particles.push({
        position: {
          x: this.player.position.x - this.player.radius + this.rng.next() * 10,
          y: this.player.position.y + 8
        },
        velocity: { x: -70 + spread * 0.4, y: 80 + this.rng.next() * 120 },
        life: 0.45 + this.rng.next() * 0.2,
        maxLife: 0.6,
        size: 6 + this.rng.next() * 4
      });
    }
  }

  private pushUi(): void {
    this.ui.render({
      state: this.state,
      score: this.score,
      highScore: this.highScore,
      muted: this.muted
    });
  }
}
