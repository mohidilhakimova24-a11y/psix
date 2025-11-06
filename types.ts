
export type GameState = 'start' | 'playing' | 'analyzing' | 'result' | 'error';

export interface GameRound {
  imageUrl: string;
  words: string[];
}

export interface MoodResult {
  mood: string;
  description: string;
  colorHex: string;
}
