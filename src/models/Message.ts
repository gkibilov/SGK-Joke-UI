import { Card } from './Card';

export enum ActionType {
  START = 'START',
  CALL = 'CALL',
  SET_KOZYR = 'SET_KOZYR',
  ACTION = 'ACTION',
  REACTION = 'REACTION',
  MESSAGE = 'MESSAGE',
  FF = 'FF',
}

export interface Message {
  type?: ActionType;
  playerId?: string;
  gameId?: string;
  existingId?: string;
  kozyrSuite?: Card;
  wantQty?: number;
  cardId?: number;
  jokerReaction?: string;
  jokerAction?: string;
  message?: string;
  roundNumber?: string;
}
