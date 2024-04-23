"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

type Props = {};

export default function Navbar({}: Props) {
  const { data: session } = useSession();

  return (
    <nav className="h-12 border-b border-b-slate-200 rounded-b-md">
      <ul className="h-full flex flex-row gap-2 justify-around items-center">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li className="flex flex-row gap-2">
          {session && (
            <>
              <p>{session?.user?.name}</p>
              <button className="text-gray-300" onClick={() => signOut()}>Sign Out</button>
            </>
          )}
          {!session && (
            <>
              <button className="text-gray-300" onClick={() => signIn()}>Sign In</button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
