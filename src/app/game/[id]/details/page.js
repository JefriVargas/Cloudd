// src/app/game/[id]/details/page.js
import ClientGameDetails from './ClientGameDetails';

export default function GameDetailsPage({ params }) {
  return <ClientGameDetails id={params.id} />;
}

export async function generateStaticParams() {
  const games = await fetchGames();
  return games.map((game) => ({
    id: game.id.toString(),
  }));
}

async function fetchGames() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}
