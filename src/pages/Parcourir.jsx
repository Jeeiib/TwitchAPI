// src/pages/Parcourir.jsx
import React, { useState, useEffect } from 'react';
import { getTopGames, getViewersByGame, getGameCategories } from '../services/twitchService';
import GameCard from '../components/GameCard';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Parcourir() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const topGames = await getTopGames(40);
        // Initialiser avec 0 spectateurs et catégories vides
        const initialGames = topGames.map((game) => ({
          id: game.id,
          name: game.name,
          imageUrl: game.box_art_url,
          viewers: 0, // Valeur par défaut
          categories: ['Jeux vidéo'],
          gameId: game.id, // Pour la navigation
        }));
        setGames(initialGames);
        setLoading(false);

       
        // Charger les spectateurs et les catégories en arrière-plan
        initialGames.forEach(async (game) => {
            try {
              // Récupérer le nombre de spectateurs
              const viewers = await getViewersByGame(game.id);
              
              // Récupérer les catégories du jeu
              const categories = await getGameCategories(game.id);
              console.log(`Catégories pour ${game.name}:`, categories); // Debug
              // Si aucune catégorie n'est trouvée, utiliser une catégorie générique
              const finalCategories = categories && categories.length > 0 ? 
                categories.slice(0, 3) : // Limiter à 3 catégories maximum pour l'affichage
                ['Jeux vidéo']; 
              
              // Mettre à jour le jeu avec les spectateurs et les catégories
              setGames((prevGames) =>
                prevGames.map((g) =>
                  g.id === game.id ? { ...g, viewers, categories: finalCategories } : g
                )
              );
            } catch (error) {
              console.error(`Erreur lors de la récupération des données pour ${game.name}:`, error);
            }
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des top jeux :', error);
          setLoading(false);
        }
      };

    fetchTopGames();
  }, []);

  return (
    <Container fluid className='px-2, py-4'>
      <h1 className="text-center mb-3">Parcourir les Top Jeux</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <Row xs={2} sm={3} md={4} lg={6} xl={8}  className="g-2">
          {games.map((game) => (
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
      )}
    </Container>
  );
}

export default Parcourir;