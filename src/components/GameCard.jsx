// src/components/GameCard.js
import React from 'react';

function GameCard({ name, imageUrl, viewers }) {
  // Remplacer les placeholders de l'URL de l'image par des dimensions fixes
  const formattedImageUrl = imageUrl
    .replace('{width}', '285') // Largeur personnalisée
    .replace('{height}', '380'); // Hauteur personnalisée

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        width: '300px',
        padding: '10px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={formattedImageUrl}
        alt={name}
        style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
      />
      <h3 style={{ margin: '10px 0' }}>{name}</h3>
      <p>{viewers.toLocaleString()} spectateurs</p>
    </div>
  );
}

export default GameCard;