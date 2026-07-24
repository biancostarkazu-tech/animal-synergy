export type AnimalType = 'lion' | 'monkey' | 'sheep' | 'owl';

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  emoji: string;
  catchphrase: string;
  reframedTalent: string;
  interactionTip: string;
  praiseWord: string;
  angleRange: [number, number];
  color: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
  };
}

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    scoreX: number;
    scoreY: number;
  }[];
  isGesture?: boolean;
}

export interface ScoreResult {
  x: number;
  y: number;
  animal: Animal;
}
