import { Player } from './Player';
import { CurrentPlay } from './CurrentPlay';

export interface State {
  version?: number;
  tableName?: string;
  tableId?: string;
  roundNumber?: number;
  numCards?: number;
  players?: Array<Player>;
  me?: Player;
  actingPlayerPosition?: number;
  currentTurnPosition?: number;
  status?: string;
  gameOn?: boolean;
  currentPlay?: CurrentPlay;
}
