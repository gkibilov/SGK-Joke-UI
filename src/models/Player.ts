import { Card } from './Card';

export interface Player {
  id?: string;
  name?: string;
  tempName?: string;
  position?: number;
  cards?: Array<Card>;
  cantCallNumer?: boolean;
  taken?: number;
  calls?: Array<string>;
  scores?: Array<string>;
  bonusMultiplier?: number;
  totalScore?: number;
  bonusMultipliers?: Array<number>;
  pulkaScores?: Array<number>;
}
