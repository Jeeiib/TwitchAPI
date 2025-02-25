// src/pages/Parcourir.jsx
import React, { useEffect, useState } from 'react';
import { getTopGames, getViewersByGame } from '../services/twitchService';
import GameCard from '../components/GameCard';

function Parcourir() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const topGames = await getTopGames(10);
        // Initialiser avec 0 spectateurs
        const initialGames = topGames.map((game) => ({
          id: game.id,
          name: game.name,
          imageUrl: game.box_art_url,
          viewers: 0, // Valeur par défaut
        }));
        setGames(initialGames);
        setLoading(false);

        // Charger les spectateurs en arrière-plan
        initialGames.forEach(async (game, index) => {
          const viewers = await getViewersByGame(game.id);
          setGames((prevGames) =>
            prevGames.map((g) =>
              g.id === game.id ? { ...g, viewers } : g
            )
          );
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des top jeux :', error);
        setLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Parcourir les Top Jeux</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {games.map((game) => (
            <GameCard
              key={game.id}
              name={game.name}
              imageUrl={game.imageUrl}
              viewers={game.viewers}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Parcourir;