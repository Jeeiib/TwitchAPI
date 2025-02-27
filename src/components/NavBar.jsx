import React, { useState, useEffect } from 'react';
import axios from 'axios';
import twitchLogo from './twitch-logo.png'; // Assurez-vous d'avoir ce fichier dans votre projet
import './Navbar.css';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [streamers, setStreamers] = useState([]);

  useEffect(() => {
    const fetchStreamers = async () => {
      if (search.trim() === '') return;
      try {
        const clientId = 'VOTRE_CLIENT_ID';
        const clientSecret = 'VOTRE_CLIENT_SECRET';

        //Token d'accès
        const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
        const accessToken = tokenResponse.data.access_token;

        //Obtenir les streamers
        const response = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${search}`, {
          headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setStreamers(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des streamers:', error);
      }
    };

    fetchStreamers();
  }, [search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <nav>
      <div className="navbar">
        <img src={twitchLogo} alt="Twitch Logo" className="twitch-logo" />
        <h1>Twitch Streamers</h1>
        <input
          type="text"
          placeholder="Recherche des streamers..."
          value={search}
          onChange={handleSearch}
        />
        <a href="/browse" className="browse-link">Parcourir</a>

      </div>
      <ul>
        {streamers.map((streamer) => (
          <li key={streamer.id}>
            <a href={`https://www.twitch.tv/${streamer.display_name}`} target="_blank" rel="noopener noreferrer">
              {streamer.display_name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

