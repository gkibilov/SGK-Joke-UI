import { Player } from './Player';
export interface Game {
  gameId?: string;
  gameName: string;
  roundNumber?: number;
  status?: string;
  players?: Array<Player>;
  me?: Player;
}