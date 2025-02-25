// src/pages/ParcourirDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStreamsByGame } from "../services/twitchService";
import StreamerCard from "../components/StreamerCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ParcourirDetails() {
  const { gameId } = useParams();
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationCursor, setPaginationCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const streamersPerPage = 50;

  useEffect(() => {
    const fetchInitialStreamers = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }
      try {
        const { data, pagination } = await getStreamsByGame(gameId);
        console.log("Initial streams:", data);
        setStreamers(data);
        setPaginationCursor(pagination);
        setHasMore(!!pagination && data.length === 100);
      } catch (error) {
        console.error("Erreur lors de la récupération initiale :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialStreamers();
  }, [gameId]);

  const loadMoreStreamers = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const { data, pagination } = await getStreamsByGame(gameId, paginationCursor);
      console.log("Additional streams:", data);
      setStreamers((prev) => [...prev, ...data]);
      setPaginationCursor(pagination);
      setHasMore(!!pagination && data.length === 100);
    } catch (error) {
      console.error("Erreur lors du chargement des streams suivants :", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastStreamer = currentPage * streamersPerPage;
  const indexOfFirstStreamer = indexOfLastStreamer - streamersPerPage;
  const currentStreamers = streamers.slice(indexOfFirstStreamer, indexOfLastStreamer);
  const totalPages = Math.ceil(streamers.length / streamersPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (hasMore) {
      setCurrentPage(currentPage + 1);
      loadMoreStreamers();
    }
  };

  const handlePageClick = (page) => {
    if (page <= totalPages) {
      setCurrentPage(page);
    } else if (hasMore) {
      setCurrentPage(page);
      loadMoreStreamers();
    }
  };

  // Styles Twitch pour la pagination
  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#9147FF", // Violet Twitch
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4B367C", // Violet sombre pour désactivé
    cursor: "not-allowed",
    opacity: 0.6,
  };

  const pageNumberStyle = (isActive) => ({
    color: "white",
    fontSize: "1rem",
    padding: "6px 12px",
    backgroundColor: isActive ? "#9147FF" : "#2A2A2E", // Violet si actif, gris sinon
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  });

  // Générer les numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= totalPages + (hasMore ? 1 : 0); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container fluid className="px-2 py-4">
      <h1 className="text-center mb-3 text-white">Streamers pour le jeu (ID: {gameId || "Non défini"})</h1>
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
          {/* Pagination stylée Twitch sans fond */}
          <div style={paginationStyle}>
            <button
              style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              onMouseOver={(e) => currentPage !== 1 && (e.target.style.backgroundColor = "#A970FF")}
              onMouseOut={(e) => currentPage !== 1 && (e.target.style.backgroundColor = "#9147FF")}
            >
              Précédent
            </button>
            {pageNumbers.map((number) => (
              <span
                key={number}
                style={pageNumberStyle(number === currentPage)}
                onClick={() => handlePageClick(number)}
                onMouseOver={(e) =>
                  number !== currentPage && (e.target.style.backgroundColor = "#A970FF")
                }
                onMouseOut={(e) =>
                  number !== currentPage && (e.target.style.backgroundColor = "#2A2A2E")
                }
              >
                {number}
              </span>
            ))}
            <button
              style={!hasMore && currentPage === totalPages ? disabledButtonStyle : buttonStyle}
              onClick={handleNext}
              disabled={!hasMore && currentPage === totalPages}
              onMouseOver={(e) =>
                !(!hasMore && currentPage === totalPages) && (e.target.style.backgroundColor = "#A970FF")
              }
              onMouseOut={(e) =>
                !(!hasMore && currentPage === totalPages) && (e.target.style.backgroundColor = "#9147FF")
              }
            >
              Suivant
            </button>
            {loading && streamers.length > 0 && (
              <Spinner animation="border" size="sm" className="ms-3" style={{ color: "#9147FF" }} />
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-white">Aucun streamer en live pour ce jeu actuellement.</p>
      )}
    </Container>
  );
}

export default ParcourirDetails;