// src/pages/ParcourirDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStreamsByGame } from "../services/twitchService";
import StreamerCard from "../components/StreamerCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ParcourirDetails() {
  const { gameId } = useParams(); // Récupérer l'ID du jeu depuis l'URL
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("ParcourirDetails gameId:", gameId);
  

  useEffect(() => {
    const fetchStreamers = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getStreamsByGame(gameId);
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
    <Container fluid className="px-2 py-4">
      <h1 className="text-center mb-3">Streamers pour le jeu (ID: {gameId})</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : streamers.length > 0 ? (
        <Row xs={2} sm={3} md={4} lg={6} xl={8} className="g-2">
          {streamers.map((streamer) => (
            <Col key={streamer.id}>
              <StreamerCard
                name={streamer.user_name}
                thumbnailUrl={streamer.thumbnail_url}
                viewers={streamer.viewer_count}
                categories={[streamer.game_name]}
                gameId={gameId.gameId} 
              />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">Aucun streamer en live pour ce jeu actuellement.</p>
      )}
    </Container>
  );
}

export default ParcourirDetails;