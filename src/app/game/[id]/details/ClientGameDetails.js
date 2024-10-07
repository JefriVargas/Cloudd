"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchGameDetails_more } from "@/lib/api";

export default function ClientGameDetails({ id }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      router.push("/auth/login");
      return;
    }

    const loadGameDetails = async () => {
      try {
        const data = await fetchGameDetails_more(id);
        setGame(data.game);
      } catch (error) {
        setError("Hubo un problema al cargar los detalles del juego.");
      } finally {
        setLoading(false);
      }
    };

    loadGameDetails();
  }, [id, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando detalles del juego...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">{game.name}</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Juego</h2>
        <p className="text-gray-700"><strong className="text-gray-900">Categoría:</strong> {game.category}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Fecha de Publicación:</strong> {new Date(game.publicationDate).toLocaleDateString()}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Tamaño:</strong> {game.size} MB</p>
        <p className="text-gray-700"><strong className="text-gray-900">Número de Logros:</strong> {game.achievements_count}</p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Logros:</h3>
        <ul className="list-disc ml-4">
          {game.achievements.map((achievement) => (
            <li key={achievement.id} className="text-gray-700">
              <strong className="text-gray-900">Nombre:</strong> {achievement.name} <span className="italic">({achievement.rarity})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información de la Compañía que lo produce</h2>
        <p className="text-gray-700"><strong className="text-gray-900">Nombre:</strong> {game.company.name}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Correo Electrónico:</strong> {game.company.email}</p>
        <p className="text-gray-700"><strong className="text-gray-900">RUC:</strong> {game.company.RUC}</p>
        <p className="text-gray-700"><strong className="text-gray-900">País de Origen:</strong> {game.company.country_origin}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Juegos Publicados:</strong> {game.company.published_games_count}</p>
        <p className="text-gray-700"><strong className="text-gray-900">Fecha de Registro:</strong> {new Date(game.company.registration_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
