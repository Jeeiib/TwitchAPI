// src/pages/ParcourirDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStreamsByGame } from "../services/twitchService";
import StreamerCard from "../components/StreamerCard";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ParcourirDetails() {
  const { gameId } = useParams();
  const [streamers, setStreamers] = useState([]); // Streams actuellement chargés
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [paginationCursor, setPaginationCursor] = useState(""); // Curseur pour l'API
  const [hasMore, setHasMore] = useState(true); // Plus de streams à charger ?
  const streamersPerPage = 50; // 50 streamers par page

  // Charger les premiers streams
  useEffect(() => {
    const fetchInitialStreamers = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }
      try {
        const { data, pagination } = await getStreamsByGame(gameId);
        console.log("Initial streams:", data); // Debug
        setStreamers(data); // Charger les 100 premiers streams
        setPaginationCursor(pagination);
        setHasMore(!!pagination && data.length === 100); // Vérifier s'il y a plus
      } catch (error) {
        console.error("Erreur lors de la récupération initiale :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialStreamers();
  }, [gameId]);

  // Charger plus de streamers
  const loadMoreStreamers = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const { data, pagination } = await getStreamsByGame(gameId, paginationCursor);
      console.log("Additional streams:", data); // Debug
      setStreamers((prev) => [...prev, ...data]); // Ajouter les nouveaux streams
      setPaginationCursor(pagination);
      setHasMore(!!pagination && data.length === 100); // Mise à jour de hasMore
    } catch (error) {
      console.error("Erreur lors du chargement des streams suivants :", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les streamers à afficher pour la page actuelle
  const indexOfLastStreamer = currentPage * streamersPerPage;
  const indexOfFirstStreamer = indexOfLastStreamer - streamersPerPage;
  const currentStreamers = streamers.slice(indexOfFirstStreamer, indexOfLastStreamer);

  // Calculer le nombre total de pages basé sur les streams chargés
  const totalPages = Math.ceil(streamers.length / streamersPerPage);

  // Handlers pour la pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (hasMore) {
      setCurrentPage(currentPage + 1);
      loadMoreStreamers(); // Charger plus si on atteint la fin des streams actuels
    }
  };

  return (
    <Container fluid className="px-2 py-4">
      <h1 className="text-center mb-3">Streamers pour le jeu (ID: {gameId || "Non défini"})</h1>
      {loading && streamers.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : streamers.length > 0 ? (
        <>
          <Row xs={2} sm={3} md={4} lg={6} xl={8} className="g-2">
            {currentStreamers.map((streamer) => (
              <Col key={streamer.id}>
                <StreamerCard
                  name={streamer.user_name}
                  thumbnailUrl={streamer.thumbnail_url}
                  viewers={streamer.viewer_count}
                  categories={[streamer.game_name]}
                />
              </Col>
            ))}
          </Row>
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1} />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next onClick={handleNext} disabled={!hasMore && currentPage === totalPages} />
            </Pagination>
            <span className="ms-3 align-self-center">
              Page {currentPage} / {totalPages} ({streamers.length} streamers chargés)
              {hasMore ? " - Plus à charger" : ""}
            </span>
          </div>
          {loading && streamers.length > 0 && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Chargement des streams suivants...</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-center">Aucun streamer en live pour ce jeu actuellement.</p>
      )}
    </Container>
  );
}

export default ParcourirDetails;