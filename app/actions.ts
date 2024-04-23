'use server'
import { database } from "@/firebase/firebase-config";
import { Cell, Game, GameState, NewMove } from "@/types/custom-types";
import { child, get, ref, set, update } from "firebase/database";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';
import { hasGameConcluded } from "@/lib/helpers";

/*
  SEND:
    request to firebase to create new document in games collection
  PASS:
    username of user who has created such request
    rounds to be played
    password?
  RECEIVE:
    new game id, to be able to join (or append it in real time to all open games in joingame)
*/
export async function createGame(formData: FormData) {
  console.log("* entered creategame action");
  const user = await getUser();
  if (!user || !user.name) return;

  let password = formData.get('password');
  if (!password) {
    password = "";
  }

  const hashedPassword = await hash(password?.toString(), 8);
  console.log(hashedPassword);

  const payload: Game = {
    id: uuidv4(),
    password: hashedPassword,
    createdBy: user.name,
    players: [{ username: user.name, playerCharacter: Cell.X }],
    gameState: {
      state: 'ongoing',
      winner: null,
      currentMove: Cell.X,
      gameArray: [Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY, Cell.EMPTY]
    }
  }
  set(ref(database, `games/${payload.id}`), payload);

  // redirect(`/game/${payload.id}?password=${payload.password}`);
  redirect(`/game/${payload.id}`);
}

export async function joinGame(formData: FormData) {
  console.log("* entered joingame action");
  const user = await getUser();
  if (!user) return;

  const gameId = formData.get('gameId');
  let password = formData.get('password');
  const hashedPass = formData.get('hashedPass');
  if (!gameId) return;
  // console.log(gameId);
  // console.log(password);

  const snapshot = await get(ref(database, `games/${gameId}`));
  const gameInfo: Game = snapshot.val();
  // console.log(gameInfo);

  const playerAlready = gameInfo.players.find(player => player.username === user.name);
  //max player limit reached
  if (!playerAlready && gameInfo.players.length === 2) return;

  if (!password) password = "";
  const passwordsMatch = await compare(password as string, gameInfo.password as string);
  console.log(`Passwords match: ${passwordsMatch}`);

  if (!passwordsMatch) return;

  let joinedPlayerCharacter;
  if (playerAlready) {
    joinedPlayerCharacter = playerAlready.playerCharacter;
  } else {
    joinedPlayerCharacter = gameInfo.players[0].playerCharacter === Cell.X ? Cell.O : Cell.X;
  }

  if (!playerAlready) {
    const newPlayer = { username: user.name as string, playerCharacter: joinedPlayerCharacter };
    const secondPlayerInfoRef = ref(database, `games/${gameId}/players/1`);
    await set(secondPlayerInfoRef, newPlayer);
  }

  // redirect(`/game/${gameInfo.id}?password=${gameInfo.password}`);
  redirect(`/game/${gameInfo.id}`);
  
}

const getUser = async () => {
  const session = await getServerSession();
  return session?.user;
}


export const makeAMove = async (newMove: NewMove): Promise<string> => {
  const user = await getUser();
  if (!user || !user.name) return `Please log in lol`;
  // console.log(newMove);

  const gameStateRef = ref(database, `games/${newMove.gameId}/gameState`);
  const snapshot = await get(gameStateRef);

  const gameState: GameState = snapshot.val();

  if (gameState.state === 'won' || gameState.state === 'draw') {
    return `This game has concluded.`;
  }
  if (newMove.playerCharacter !== gameState.currentMove) {
    return `Please wait for your turn, currently it is ${gameState.currentMove} move`;
  };
  if (gameState.gameArray[newMove.cellId] !== Cell.EMPTY) {
    return `Cell is already filled, please choose another cell`;
  }

  gameState.gameArray[newMove.cellId] = newMove.playerCharacter;
  const isGameWon = hasGameConcluded(gameState.gameArray);
  const isDraw = !isGameWon && gameState.gameArray.indexOf(Cell.EMPTY) === -1;

  const newGameState: GameState = {
    state: isGameWon ? 'won' : isDraw ? 'draw' : 'ongoing',
    winner: isGameWon ? user.name : null,
    gameArray: gameState.gameArray,
    currentMove: newMove.playerCharacter === Cell.X ? Cell.O : Cell.X
  }
  await set(gameStateRef, newGameState);

  // if (newGameState.state === 'draw') {
  //   return `The game has concluded, it's a draw`;
  // }
  // if (newGameState.state === 'won') {
  //   return `The game has concluded, ${newMove.playerCharacter} has won the game!`;
  // }

  return "success";
}