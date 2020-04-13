import { Player } from './Player';
import { State } from './State';

export interface GameWrapper {
  state: State;
  player?: Player;
  opponents?: Player[];
}
