import { Game } from "@/types/custom-types";
import { useRouter } from "next/navigation";
import React from "react";

type RecentlyCreatedGameProps = {
  game: Game;
  isDisabled: boolean;
};

export default function RecentlyCreatedGame({
  game,
  isDisabled,
}: RecentlyCreatedGameProps) {
  const router = useRouter();

  const onClickHandler = () => {
    if (isDisabled) return;
    router.push(`/joingame/?gameId=${game.id}`);
  };
  return (
    <li className="border rounded-md py-2 px-4 flex flex-col gap-2">
      <p>Game room id: {game.id}</p>
      <p>Created by: {game.createdBy}</p>
      <p>
        Status:{" "}
        {game.gameState.state === "won"
          ? `${game.gameState.winner} is the winner!`
          : game.gameState.state}
      </p>
      <p>Password protected: {game.password === "" ? "No" : "Yes"}</p>
      <p>Players: {game.players.map((player) => player.username).join(", ")}</p>
      <button
        onClick={onClickHandler}
        className={`border disab bg-lime-600 py-1 px-2 rounded-sm text-center disabled:bg-zinc-500`}
        disabled={isDisabled}
      >
        Join
      </button>
    </li>
  );
}
