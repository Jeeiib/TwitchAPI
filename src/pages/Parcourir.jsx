// src/pages/Parcourir.jsx
import React, { useState, useEffect } from "react";
import { getTopGames, getViewersByGame } from "../services/twitchService"; 
import GameCard from "../components/GameCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import predefinedGameCategories from "../services/gameCategories";

function Parcourir() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationCursor, setPaginationCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const gamesPerPage = 48;

  useEffect(() => {
    const fetchInitialGames = async () => {
      try {
        const { data, pagination } = await getTopGames();
        console.log("Initial games loaded:", data.length, "Pagination:", pagination);
        const initialGames = data.map((game) => ({
          id: game.id,
          name: game.name,
          imageUrl: game.box_art_url,
          viewers: 0,
          categories: predefinedGameCategories[game.id] || ["Jeux vidéo"], // Utiliser les catégories prédéfinies
          gameId: game.id,
        }));
        setGames(initialGames);
        setPaginationCursor(pagination);
        setHasMore(!!pagination);
        console.log("Has more after initial load:", !!pagination);

        // Charger les spectateurs en arrière-plan
        initialGames.forEach(async (game) => {
          try {
            const viewers = await getViewersByGame(game.id);
            setGames((prevGames) =>
              prevGames.map((g) =>
                g.id === game.id ? { ...g, viewers } : g
              )
            );
          } catch (error) {
            console.error(`Erreur pour ${game.name}:`, error);
          }
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des top jeux :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialGames();
  }, []);

  const loadMoreGames = async () => {
    if (!hasMore || loading) {
      console.log("loadMoreGames skipped: hasMore=", hasMore, "loading=", loading);
      return;
    }
    setLoading(true);
    try {
      console.log("Loading more with cursor:", paginationCursor);
      const { data, pagination } = await getTopGames(paginationCursor);
      console.log("Additional games loaded:", data.length, "New pagination:", pagination);
      const newGames = data.map((game) => ({
        id: game.id,
        name: game.name,
        imageUrl: game.box_art_url,
        viewers: 0,
        categories: predefinedGameCategories[game.id] || ["Jeux vidéo"], // Utiliser les catégories prédéfinies
        gameId: game.id,
      }));
      setGames((prev) => {
        const updatedGames = [...prev, ...newGames];
        console.log("Total games after load:", updatedGames.length);
        return updatedGames;
      });
      setPaginationCursor(pagination);
      setHasMore(!!pagination);
      console.log("Has more after load:", !!pagination);

      // Charger les spectateurs pour les nouveaux jeux
      newGames.forEach(async (game) => {
        try {
          const viewers = await getViewersByGame(game.id);
          setGames((prevGames) =>
            prevGames.map((g) =>
              g.id === game.id ? { ...g, viewers } : g
            )
          );
        } catch (error) {
          console.error(`Erreur pour ${game.name}:`, error);
        }
      });
    } catch (error) {
      console.error("Erreur lors du chargement des jeux suivants :", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const indexOfFirstGame = (currentPage - 1) * gamesPerPage;
  const indexOfLastGame = currentPage * gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(games.length / gamesPerPage);

  useEffect(() => {
    if (currentGames.length < gamesPerPage && hasMore && !loading) {
      console.log("Page incomplete, triggering loadMoreGames");
      loadMoreGames();
    }
  }, [currentGames, hasMore, loading]);

  console.log("Current page:", currentPage, "Total pages:", totalPages, "Current games:", currentGames.length);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      console.log("Navigated to previous page:", currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages || (currentGames.length < gamesPerPage && hasMore)) {
      setCurrentPage(currentPage + 1);
      console.log("Navigated to next page:", currentPage + 1);
    } else if (hasMore) {
      setCurrentPage(currentPage + 1);
      loadMoreGames();
      console.log("Triggered loadMoreGames for page:", currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    console.log("Page clicked:", page);
    setCurrentPage(page);
    if (page > totalPages && hasMore) {
      loadMoreGames();
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages + (hasMore ? 1 : 0); i++) {
    pageNumbers.push(i);
  }

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#9147FF",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4B367C",
    cursor: "not-allowed",
    opacity: 0.6,
  };

  const pageNumberStyle = (isActive) => ({
    color: "white",
    fontSize: "1rem",
    padding: "6px 12px",
    backgroundColor: isActive ? "#9147FF" : "#2A2A2E",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  });

  return (
    <Container fluid className="px-2 py-4" style={{ backgroundColor: "#18181B" }}>
      <h1
        className="text-center mb-3 text-white fw-bold"
        style={{ fontSize: "50px" }}
      >
        Parcourir
      </h1>
      {loading && games.length === 0 ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row xs={2} sm={3} md={4} lg={6} xl={8} className="g-2">
            {currentGames.map((game) => (
              <Col key={game.id}>
                <GameCard
                  name={game.name}
                  imageUrl={game.imageUrl}
                  viewers={game.viewers}
                  categories={game.categories}
                  gameId={game.id}
                />
              </Col>
            ))}
          </Row>
          <div style={paginationStyle}>
            <button
              style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              onMouseOver={(e) =>
                currentPage !== 1 && (e.target.style.backgroundColor = "#A970FF")
              }
              onMouseOut={(e) =>
                currentPage !== 1 && (e.target.style.backgroundColor = "#9147FF")
              }
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
                !(!hasMore && currentPage === totalPages) &&
                (e.target.style.backgroundColor = "#A970FF")
              }
              onMouseOut={(e) =>
                !(!hasMore && currentPage === totalPages) &&
                (e.target.style.backgroundColor = "#9147FF")
              }
            >
              Suivant
            </button>
            {loading && games.length > 0 && (
              <Spinner animation="border" size="sm" className="ms-3" style={{ color: "#9147FF" }} />
            )}
          </div>
        </>
      )}
    </Container>
  );
}

export default Parcourir;