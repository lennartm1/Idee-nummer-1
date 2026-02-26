import {
  PIPE_GAP_MIN,
  PIPE_GAP_SHRINK_PER_POINT,
  PIPE_GAP_START,
  SPEED_INCREASE_PER_POINT,
  SPEED_MAX,
  SPEED_START
} from './config';

export const computeSpeed = (score: number): number =>
  Math.min(SPEED_START + score * SPEED_INCREASE_PER_POINT, SPEED_MAX);

export const computeGap = (score: number): number =>
  Math.max(PIPE_GAP_START - score * PIPE_GAP_SHRINK_PER_POINT, PIPE_GAP_MIN);
