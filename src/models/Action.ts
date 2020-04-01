export interface Action {
  cardId: number;
  jokerAction: string;
  jokerReaction: string;
  playerPosition: number;
  type: string;
  suite: string;
  jokerActionTake: boolean;
}
