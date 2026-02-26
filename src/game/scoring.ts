import { Player, PipePair } from './types';

export const collectPassedPipes = (pipes: PipePair[], player: Player): number => {
  let gained = 0;

  pipes.forEach((pipe) => {
    const rightEdge = pipe.x + pipe.width;
    if (!pipe.passed && rightEdge < player.position.x) {
      pipe.passed = true;
      gained += 1;
    }
  });

  return gained;
};
