import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { joinGame } from "@/app/actions";
import Input from "@/components/UI/Input";
import RecentlyCreatedGames from "@/components/joingame/RecentlyCreatedGames";

type HomeProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: HomeProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="w-2/3">
      <h1 className="text-2xl font-bold text-center mb-4">Join game</h1>
      <form className="flex flex-col gap-2" action={joinGame}>
        <Input
          label="Game room id:"
          name="gameId"
          initValue={searchParams?.gameId?.toString()}
        />
        <Input
          label="Game room password (leave empty if game is not password protected):"
          name="password"
          canBeEmpty={true}
          type="password"
        />
        <button className="w-48 border bg-lime-600 py-1 px-2 rounded-sm text-center self-center">
          Join game!
        </button>
      </form>
      <RecentlyCreatedGames username={session.user?.name as string}/>
    </div>
  );
}
