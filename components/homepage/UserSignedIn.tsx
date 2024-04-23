import React from "react";
import Link from "next/link";

type Props = {
  username: string | null | undefined;
};

export default function UserSignedIn({ username }: Props) {
  return (
    <>
      <h1 className="font-bold self-center">
        Welcome <span className="text-orange-400">{username}</span>
      </h1>
      {/* MAKE BUTTONS SAME SIZE FOR FUCKS SAKE */}
      <div className="flex justify-center gap-[10%]">
        <Link
          className="w-48 border bg-orange-500 py-1 px-2 rounded-sm text-center"
          href="/creategame"
        >
          Create new game!
        </Link>
        <Link
          className="w-48 border bg-lime-600 py-1 px-2 rounded-sm text-center"
          href="/joingame"
        >
          Join existing game!
        </Link>
      </div>
    </>
  );
}
