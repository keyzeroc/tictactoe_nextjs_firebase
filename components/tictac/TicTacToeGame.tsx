"use client";
import { useEffect, useState } from "react";
import { Cell, CellId, Game } from "@/types/custom-types";
import { makeAMove } from "@/app/actions";
import { database } from "@/firebase/firebase-config";
import { ref, onValue, off } from "firebase/database";
import { GameState } from "@/types/custom-types";
import { compareGameStates } from "@/lib/helpers";

type TicTacToeGameProps = {
  playerCharacter: Cell;
  gameId: string;
};

export default function TicTacToeGame({
  playerCharacter,
  gameId,
}: TicTacToeGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    gameArray: [
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
      Cell.EMPTY,
    ],
    currentMove: Cell.X,
    state: "ongoing",
    winner: null,
  });

  useEffect(() => {
    const gameStateRef = ref(database, `games/${gameId}/gameState`);
    try {
      onValue(gameStateRef, (snapshot) => {
        const currentStateInDB: GameState = snapshot.val();
        if (!currentStateInDB) return;
        setGameState((prevGameState) => {
          const isGameStateTheSame = compareGameStates(
            currentStateInDB,
            prevGameState
          );
          // if theres no change - don't update state so there's no infinite loop
          if (isGameStateTheSame) return prevGameState;
          // if there is however - update state
          const newGameState = {
            winner: currentStateInDB.winner,
            state: currentStateInDB.state,
            gameArray: currentStateInDB.gameArray,
            currentMove: currentStateInDB.currentMove,
          };
          return newGameState;
        });
      });
    } catch (err) {
      console.log(err);
    }

    return () => off(gameStateRef);
  }, [gameState]);

  useEffect(() => {
    if (gameState.state === "won") {
      alert(`The game has concluded, ${gameState.winner} has won the game!`);
    } else if (gameState.state === "draw") {
      alert(`The game has concluded, it is a draw!`);
    }
  }, [gameState.state, gameState.winner]);

  const onPlayerMoveHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const clickedCell: HTMLInputElement = e.target as HTMLInputElement;

    const newMove = {
      gameId,
      playerCharacter,
      cellId: Number(clickedCell.id) as CellId,
    };
    const result = await makeAMove(newMove);
    if (result !== "success") alert(result);
  };

  const mappedGameArray = gameState.gameArray.map((cell, index) => {
    let borderRadius = "";

    if (index === 0) borderRadius = "rounded-tl-md";
    else if (index === 2) borderRadius = "rounded-tr-md";
    else if (index === 6) borderRadius = "rounded-bl-md";
    else if (index === 8) borderRadius = "rounded-br-md";

    return (
      <button
        id={index.toString()}
        className={`border border-gray-200 flex justify-center items-center ${borderRadius}`}
        key={"cell:" + index}
        onClick={onPlayerMoveHandler}
      >
        {cell}
      </button>
    );
  });

  return (
    <div>
      <div>You are playing as {playerCharacter}</div>
      <div className="grid grid-rows-3 grid-cols-3 w-96 h-96">
        {mappedGameArray}
      </div>
      <div>
        {gameState.winner && `GG! The Winner is : ${gameState.winner} !`}
      </div>
      <div>
        {!gameState.winner && gameState.state === "draw" && `GG. It's a draw!`}
      </div>
      <div>
        <p>
          Do you wish to restart the game? {"("}both players have to agree{")"}
        </p>
        <button>YES</button>
      </div>
    </div>
  );
}
