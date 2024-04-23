import { joinGame } from "@/app/actions";
import TicTacToeGame from "@/components/tictac/TicTacToeGame";
import { database } from "@/firebase/firebase-config";
import { Cell, Player } from "@/types/custom-types";
import { get, ref } from "firebase/database";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type GameProps = {
  params: {
    gameId: string;
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Game({ params, searchParams }: GameProps) {
  const session = await getServerSession();
  const gameId = params.gameId as string;
  if (!gameId || !session) redirect("/");

  const allowedPlayers: Array<Player> = (await get(ref(database, `games/${gameId}/players`))).val();
  const player = allowedPlayers.find((player) => player.username === session.user?.name);
  if (!player) redirect("/");

  return (
    <div className="w-2/3">
      <TicTacToeGame playerCharacter={player.playerCharacter} gameId={gameId} />
    </div>
  );
}
