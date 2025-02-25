// src/pages/Parcourir.jsx
import React, { useEffect, useState } from 'react';
import { getTopGames, getViewersByGame } from '../services/twitchService';
import GameCard from '../components/GameCard';

function Parcourir() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamesAndViewers = async () => {
      try {
        // Récupérer les top jeux
        const topGames = await getTopGames(10);

        // Récupérer les spectateurs pour chaque jeu
        const gamesWithViewers = await Promise.all(
          topGames.map(async (game) => {
            const viewers = await getViewersByGame(game.id);
            return {
              id: game.id,
              name: game.name,
              imageUrl: game.box_art_url,
              viewers,
            };
          })
        );

        setGames(gamesWithViewers);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamesAndViewers();
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