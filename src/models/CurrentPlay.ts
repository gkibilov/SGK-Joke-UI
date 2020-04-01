import { Action } from './Action';

export interface CurrentPlay {
  kozyr: string;
  actions: Array<Action>;
  winningAction: string;
  actingSuite: string;
  jokerActionWant: boolean;
  jokerActionTake: boolean;
}
