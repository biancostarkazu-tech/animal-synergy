import { ANIMALS } from '@/data/animals';
import { ScoreResult } from '@/types';

export function calculateResult(answers: { scoreX: number; scoreY: number }[]): ScoreResult {
  const totalX = answers.reduce((sum, a) => sum + a.scoreX, 0);
  const totalY = answers.reduce((sum, a) => sum + a.scoreY, 0);

  let degrees = Math.atan2(totalY, totalX) * (180 / Math.PI);
  if (degrees < 0) degrees += 360;

  const foundAnimal = Object.values(ANIMALS).find((animal) => {
    const [min, max] = animal.angleRange;
    return degrees >= min && degrees < max;
  }) || ANIMALS.lion;

  return { x: totalX, y: totalY, animal: foundAnimal };
}
