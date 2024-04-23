import { Cell, GameState } from "@/types/custom-types";

const compareTwoObjects = (object1: any, object2: any) => {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

// returns true if both game states have same values
export const compareGameStates = (gameState1: GameState, gameState2: GameState) => {
  const comparedCurrentMove = compareTwoObjects(gameState1.currentMove, gameState2.currentMove);
  const comparedGameArray = compareTwoObjects(gameState1.gameArray, gameState2.gameArray);
  const comparedState = compareTwoObjects(gameState1.state, gameState2.state);
  const comparedWinner = compareTwoObjects(gameState1.winner, gameState2.winner);
  const result = comparedCurrentMove && comparedGameArray && comparedState && comparedWinner;
  return result;
}

export const hasGameConcluded = (gameArray: Array<Cell>) => {
  // Check rows
  for (let i = 0; i < 9; i += 3) {
    if (gameArray[i] === gameArray[i + 1] && gameArray[i + 1] === gameArray[i + 2] && gameArray[i] !== '') {
      return true;
    }
  }
  // Check columns
  for (let i = 0; i < 3; i++) {
    if (gameArray[i] === gameArray[i + 3] && gameArray[i + 3] === gameArray[i + 6] && gameArray[i] !== '') {
      return true;
    }
  }
  // Check diagonals
  if ((gameArray[0] === gameArray[4] && gameArray[4] === gameArray[8] && gameArray[0] !== '') ||
    (gameArray[2] === gameArray[4] && gameArray[4] === gameArray[6] && gameArray[2] !== '')) {
    return true;
  }

  return false;
}