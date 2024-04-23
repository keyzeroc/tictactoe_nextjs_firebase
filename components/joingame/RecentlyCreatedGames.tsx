"use client";
import { useEffect, useState } from "react";
import { database } from "@/firebase/firebase-config";
import { ref, onValue, get, child, off } from "firebase/database";
import { Game } from "@/types/custom-types";
import RecentlyCreatedGame from "./RecentlyCreatedGame";

type RecentlyCreatedGamesProps = {
  username: string;
};

export default function RecentlyCreatedGames({username}: RecentlyCreatedGamesProps) {
  // const [currentGames, setCurrentGames] = useState<Array<Game>>([]);
  const [currentGames, setCurrentGames] = useState<Array<Game>>([]);

  useEffect(() => {
    const gamesRef = ref(database, "games/");
    try {
      onValue(gamesRef, (snapshot) => {
        let activeGames = new Array<Game>();
        if (!snapshot.val()) {
          setCurrentGames(activeGames);
          return;
        }
        activeGames = Object.values(snapshot.val());
        if (currentGames.length !== activeGames.length)
          setCurrentGames(activeGames);
      });
    } catch (err) {
      console.log(err);
    }
    return () => off(gamesRef);
  }, [currentGames]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-4 mt-6">
        Recently created games
      </h1>
      <div className="">
        <ul className="flex flex-row flex-wrap gap-4 justify-center">
          {currentGames.map((game: Game) => (
            <RecentlyCreatedGame
              key={"game:" + game.id}
              game={game}
              isDisabled={game.players.length == 2 && !(game.players.find(player=>player.username == username))}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
