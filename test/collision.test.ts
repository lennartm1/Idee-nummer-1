import { describe, expect, it } from 'vitest';
import { circleIntersectsRect } from '../src/game/collision';

describe('circleIntersectsRect', () => {
  it('detecteert overlap', () => {
    expect(circleIntersectsRect({ x: 10, y: 10, radius: 5 }, { x: 12, y: 7, width: 8, height: 8 })).toBe(
      true
    );
  });

  it('detecteert geen overlap', () => {
    expect(circleIntersectsRect({ x: 5, y: 5, radius: 2 }, { x: 20, y: 20, width: 4, height: 4 })).toBe(
      false
    );
  });
});
