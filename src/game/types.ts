export type GameState = 'intro' | 'playing' | 'paused' | 'gameover';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vec2;
  velocityY: number;
  radius: number;
  rotation: number;
}

export interface PipePair {
  id: number;
  x: number;
  width: number;
  gapY: number;
  gapSize: number;
  passed: boolean;
}

export interface Particle {
  position: Vec2;
  velocity: Vec2;
  life: number;
  maxLife: number;
  size: number;
}
