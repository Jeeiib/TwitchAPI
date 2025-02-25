// src/components/StreamerCard.js
import React from "react";
import { Badge, Card } from "react-bootstrap";

function StreamerCard({ name, thumbnailUrl, viewers, categories, small }) {
  // Formater l'URL de la thumbnail du stream avec des dimensions fixes
  const formattedThumbnailUrl = thumbnailUrl
    ? thumbnailUrl
        .replace("{width}", "440") // Largeur adaptée pour une thumbnail de stream
        .replace("{height}", "248") // Hauteur adaptée
    : "https://via.placeholder.com/440x248?text=No+Live+Image"; // Image par défaut si pas de thumbnail

  const cardStyle = {
    backgroundColor: "#18181B", // Noir Twitch
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s ease",
  };

  const hoverStyle = {
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    },
  };

  return (
    <Card
      className={small ? "h-100 small-card" : "h-100"}
      style={{ ...cardStyle, ...hoverStyle }}
    >
      <Card.Img
        variant="top"
        src={formattedThumbnailUrl}
        style={small ? { height: "120px", objectFit: "cover" } : {}}
      />
      <Card.Body
        className={small ? "p-2" : "p-3"}
        style={{ color: "white" }} // Texte blanc
      >
        <Card.Title
          style={
            small
              ? { fontSize: "0.9rem", marginBottom: "0.3rem", color: "white" }
              : { color: "white" }
          }
        >
          {name}
        </Card.Title>

        <Card.Text
          style={
            small
              ? { fontSize: "0.8rem", color: "#A970FF" }
              : { color: "#A970FF" }
          }
        >
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
              style={{ fontSize: small ? "0.7rem" : "0.8rem" }}
            >
              {category}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

// Valeurs par défaut pour éviter les erreurs si des props ne sont pas fournies
StreamerCard.defaultProps = {
  categories: [],
  small: false,
  thumbnailUrl: null,
  viewers: 0,
};

export default StreamerCard;