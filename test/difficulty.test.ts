import { describe, expect, it } from 'vitest';
import { PIPE_GAP_MIN, SPEED_MAX, SPEED_START } from '../src/game/config';
import { computeGap, computeSpeed } from '../src/game/difficulty';

describe('difficulty scaling', () => {
  it('verhoogt speed en capped op max', () => {
    expect(computeSpeed(0)).toBe(SPEED_START);
    expect(computeSpeed(1000)).toBe(SPEED_MAX);
  });

  it('verkleint gap en respecteert minimum', () => {
    expect(computeGap(0)).toBeGreaterThan(PIPE_GAP_MIN);
    expect(computeGap(1000)).toBe(PIPE_GAP_MIN);
  });
});
