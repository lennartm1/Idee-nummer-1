import { GROUND_HEIGHT, WORLD_HEIGHT } from './config';

export const generateGapY = (gapSize: number, random: () => number): number => {
  const margin = 40;
  const minY = gapSize * 0.5 + margin;
  const maxY = WORLD_HEIGHT - GROUND_HEIGHT - gapSize * 0.5 - margin;
  return minY + random() * (maxY - minY);
};
