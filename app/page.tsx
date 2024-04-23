import TicTacToeGame from "@/components/tictac/TicTacToeGame";
import { getServerSession } from "next-auth";


import UserSignedIn from "@/components/homepage/UserSignedIn";
import UserNotSignedIn from "@/components/homepage/UserNotSignedIn";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="h-full min-h-full flex flex-col justify-center gap-4">
      {/* <TicTacToeGame /> */}
      {!session && <UserNotSignedIn />}
      {session && <UserSignedIn username={session?.user?.name}/>}
    </main>
  );
}
