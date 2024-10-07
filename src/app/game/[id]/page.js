import ClientGameAchievements from './ClientGameAchievements';

export default function GameAchievementsPage({ params }) {
  return <ClientGameAchievements id={params.id} />;
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
