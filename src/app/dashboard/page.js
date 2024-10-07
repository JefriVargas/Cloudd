"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/lib/api";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      router.push("/auth/login");
      return;
    }

    const loadUserData = async () => {
      try {
        const data = await fetchUserData(userId);
        setUserData(data);
      } catch (error) {
        setError("Hubo un problema al cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-700">Cargando datos del usuario...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  const { user, data } = userData;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Dashboard de {user.username}</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Usuario</h2>
        <p className="text-gray-700"><strong className="text-gray-900">Nombre:</strong> {user.names} {user.lastnames}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Email:</strong> {user.email}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Teléfono:</strong> {user.phone_number}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Edad:</strong> {user.age}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Cumpleaños:</strong> {new Date(user.birthday).toLocaleDateString()}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tus Juegos y Logros</h2>
        {data.games.map((game) => (
          <div key={game.game_id} className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{game.game_name}</h3>
            <ul className="ml-4 list-disc">
              {game.achievements.map((achievement) => (
                <li key={achievement.achievement_id} className="text-gray-700">
                  <strong className="text-gray-900">Logro:</strong> {achievement.achievement_name} <span className="italic">({achievement.rarity})</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-x-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => router.push(`/game/${game.game_id}`)}
              >
                Obtener más logros
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => router.push(`/game/${game.game_id}/details`)}
              >
                Información del juego
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
