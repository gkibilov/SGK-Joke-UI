import { Action } from './Action';
import { Card } from './Card';

export interface CurrentPlay {
  kozyr: Card;
  actions: Array<Action>;
  winningAction: string;
  actingSuite: string;
  jokerActionWant: boolean;
  jokerActionTake: boolean;
  position: number;
}
