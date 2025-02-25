// src/pages/ParcourirDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Pour récupérer l'ID du jeu depuis l'URL
import { getStreamsByGame } from "../services/twitchService"; // Nouvelle fonction à ajouter
import StreamerCard from "../components/StreamerCard";

function ParcourirDetails() {
  const { gameId } = useParams(); // Récupérer l'ID du jeu depuis l'URL
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const data = await getStreamsByGame(gameId); // Récupérer les streams pour ce jeu
        setStreamers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des streamers :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamers();
  }, [gameId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Streamers pour le jeu (ID: {gameId})</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : streamers.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {streamers.map((streamer) => (
            <StreamerCard
              key={streamer.id}
              name={streamer.user_name}
              thumbnailUrl={streamer.thumbnail_url}
              viewers={streamer.viewer_count}
              categories={[streamer.game_name]} // Le nom du jeu comme catégorie
            />
          ))}
        </div>
      ) : (
        <p>Aucun streamer en live pour ce jeu actuellement.</p>
      )}
    </div>
  );
}

export default ParcourirDetails;