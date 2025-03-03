// src/components/GameCard.js
import React from "react";
import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function GameCard({ name, imageUrl, viewers, small, categories, gameId }) {
  // Remplacer les placeholders de l'URL de l'image par des dimensions fixes
  const formattedImageUrl = imageUrl
    .replace("{width}", "285") // Largeur personnalisée
    .replace("{height}", "380"); // Hauteur personnalisée

  const cardStyle = {
    backgroundColor: "#18181B", // Noir Twitch
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s ease",
    textDecoration: "none", 
  };

  // const hoverStyle = {
  //   ":hover": {
  //     transform: "translateY(-5px)",
  //     boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  //   },
  // };

  return (
    <Link to={`/parcourir/${gameId}`} style={{ textDecoration: "none" }}> {/* Lien vers la page détails */}
    <Card 
      className={small ? "h-100 small-card" : "h-100"} 
      style={{...cardStyle}}
    >
      <Card.Img 
        variant="top" 
        src={formattedImageUrl} 
        style={small ? { height: '120px', objectFit: 'cover' } : {}}
      />
      <Card.Body 
        className={small ? "p-2" : "p-3"}
        style={{ color: 'white' }} // Texte blanc
      >
        <Card.Title 
          style={small ? 
            { fontSize: '0.9rem', marginBottom: '0.3rem', color: 'white' } : 
            { color: 'white' }
          }
        >
          {name}
        </Card.Title>
        
        <Card.Text style={small ? { fontSize: '0.8rem', color: '#A970FF' } : { color: '#A970FF' }}>
          {viewers.toLocaleString()} spectateurs
        </Card.Text>
        
        {/* Affichage des catégories */}
        <div className="mt-1">
          {categories && categories.length > 0 && categories.map((category, index) => (
            <Badge 
              key={index} 
              bg="dark" 
              text="light" 
              className="me-1 mb-1"
              style={{ fontSize: small ? '0.7rem' : '0.8rem' }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
    </Link>
  );
}

// Valeur par défaut pour éviter les erreurs si les catégories ne sont pas fournies
GameCard.defaultProps = {
    categories: [],
    small: false,
    viewers: 0,
    gameId: "",

  };
  

export default GameCard;
