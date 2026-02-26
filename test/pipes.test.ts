import { describe, expect, it } from 'vitest';
import { GROUND_HEIGHT, WORLD_HEIGHT } from '../src/game/config';
import { generateGapY } from '../src/game/pipes';

describe('generateGapY', () => {
  it('blijft binnen min/max grenzen', () => {
    const gapSize = 180;
    const minY = gapSize * 0.5 + 40;
    const maxY = WORLD_HEIGHT - GROUND_HEIGHT - gapSize * 0.5 - 40;

    for (const random of [0, 0.2, 0.5, 0.99, 1]) {
      const y = generateGapY(gapSize, () => random);
      expect(y).toBeGreaterThanOrEqual(minY);
      expect(y).toBeLessThanOrEqual(maxY);
    }
  });
});
