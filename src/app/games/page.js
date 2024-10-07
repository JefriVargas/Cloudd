"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchGames } from "@/lib/api";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      router.push("/auth/login");
      return;
    }

    const loadGames = async () => {
      try {
        const gamesData = await fetchGames();
        setGames(gamesData);
      }catch (error) {
        setError("Hubo un problema al cargar los juegos.");
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando juegos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Juegos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold text-black">{game.name}</h2>
            <p className="text-gray-700">Categoría: {game.category}</p>
            <p className="text-gray-700">Tamaño: {game.size} MB</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => router.push(`/game/${game.id}`)}
            >
              Ver Logros
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
