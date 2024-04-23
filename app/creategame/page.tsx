import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createGame } from "@/app/actions";
import Input from "@/components/UI/Input";

export default async function Home() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/");
  }

  // somehow make button disabled when inputs are not filled ???
  return (
    <div className="w-2/3">
      <h1 className="text-2xl font-bold text-center mb-4">Create game</h1>
      <form className="flex flex-col gap-2" action={createGame}>
        <Input
          label="Please enter game room password (leave empty if you want anybody to be able to join):"
          name="password"
          canBeEmpty={true}
        />
        <button className="w-48 border bg-lime-600 py-1 px-2 rounded-sm text-center self-center">
          Click to create game
        </button>
      </form>
    </div>
  );
}
