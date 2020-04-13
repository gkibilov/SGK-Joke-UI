import { Player } from './Player';
import { CurrentPlay } from './CurrentPlay';

export enum StateStatus {
  CALLS_MADE = 'CALLS_MADE',
  PLAY_DONE = 'PLAY_DONE',
  PLAY_STARTED = 'PLAY_STARTED',
  DEALT = 'DEALT',
}

export interface State {
  version?: number;
  tableName?: string;
  tableId?: string;
  roundNumber?: number;
  numCards?: number;
  players?: Array<Player>;
  player?: Player;
  actingPlayerPosition?: number;
  currentTurnPosition?: number;
  status?: StateStatus;
  gameOn?: boolean;
  currentPlay?: CurrentPlay;
}
