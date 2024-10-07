"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchGameDetails, assignAchievement } from "@/lib/api";

export default function ClientGameAchievements({ id }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      router.push("/auth/login");
      return;
    }

    setUserId(storedUserId);

    const loadGameDetails = async () => {
      try {
        const gameData = await fetchGameDetails(id);
        setGame(gameData);
      } catch (error) {
        setError("Hubo un problema al cargar los detalles del juego.");
      } finally {
        setLoading(false);
      }
    };

    loadGameDetails();
  }, [id, router]);

  const handleAssignAchievement = async (achievementId) => {
    try {
      await assignAchievement(userId, achievementId);
      const updatedAchievements = game.achievements.map((achievement) =>
        achievement.id === achievementId
          ? {
              ...achievement,
              userAchievements: [
                { id: { userId: Number(userId), achievementId } },
              ],
            }
          : achievement
      );
      setGame({ ...game, achievements: updatedAchievements });
    } catch (error) {
      console.error("Error al asignar el logro:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando logros...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {game?.name} - Logros
      </h1>
      {game?.achievements && game.achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {game.achievements.map((achievement) => {
            const userHasAchievement = achievement.userAchievements.some(
              (ua) => ua.id.userId === Number(userId)
            );

            return (
              <div
                key={achievement.id}
                className={`bg-white shadow-lg rounded-lg p-4 ${
                  userHasAchievement ? "bg-green-100" : ""
                }`}
              >
                <h2 className="text-xl font-semibold text-black">
                  {achievement.name}
                </h2>
                <p className="text-gray-700">Rareza: {achievement.rarity}</p>
                {userHasAchievement ? (
                  <p className="text-green-600 font-semibold">Logro obtenido</p>
                ) : (
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => handleAssignAchievement(achievement.id)}
                  >
                    Obtener Logro
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No hay logros disponibles para este juego.
        </p>
      )}
    </div>
  );
}
