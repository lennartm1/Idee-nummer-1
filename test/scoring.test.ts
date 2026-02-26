import { describe, expect, it } from 'vitest';
import { collectPassedPipes } from '../src/game/scoring';
import { PipePair, Player } from '../src/game/types';

describe('collectPassedPipes', () => {
  it('telt een pipe maar één keer', () => {
    const player: Player = {
      position: { x: 100, y: 200 },
      velocityY: 0,
      radius: 20,
      rotation: 0
    };
    const pipes: PipePair[] = [
      { id: 1, x: 50, width: 40, gapY: 300, gapSize: 180, passed: false },
      { id: 2, x: 140, width: 40, gapY: 300, gapSize: 180, passed: false }
    ];

    expect(collectPassedPipes(pipes, player)).toBe(1);
    expect(collectPassedPipes(pipes, player)).toBe(0);
  });
});
