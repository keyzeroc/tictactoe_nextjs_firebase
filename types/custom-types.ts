export interface Game {
  id: string;
  password?: string;
  createdBy: string;
  players: Array<Player>;
  gameState: GameState
}
export interface GameState {
  state: 'ongoing' | 'draw' | 'won';
  winner: null | string;
  currentMove: Cell;
  gameArray: Array<Cell>
}
export enum CellId {
  "c0" = 0,
  "c1" = 1,
  "c2" = 2,
  "c3" = 3,
  "c4" = 4,
  "c5" = 5,
  "c6" = 6,
  "c7" = 7,
  "c8" = 8
}

export interface NewMove {
  gameId: string,
  playerCharacter: Cell,
  cellId: CellId
}

export interface Player {
  username: string;
  playerCharacter: Cell;
}

export enum Cell {
  O = "0",
  X = "X",
  EMPTY = "",
}