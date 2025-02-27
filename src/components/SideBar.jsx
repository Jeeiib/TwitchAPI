// src/components/Sidebar.jsx (extrait modifié)
import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSidebar } from "../context/SidebarContext"; // Importer useSidebar
import axios from "axios"; // Pour les requêtes HTTP

const Sidebar = () => {
  const { isSidebarHovered, setIsSidebarHovered } = useSidebar();
  const [followedChannels, setFollowedChannels] = useState([]);
  const [showMoreChannels, setShowMoreChannels] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Stocker le token

  // Remplace ces valeurs par tes credentials Twitch
  const clientId = "w7jrk3kepcklxgzvfpjbrkzajy7o4w";
  const clientSecret = "2dkfcn3im8ztu8559kijhu6qt3ld4i";
  const redirectUri = "http://localhost:5173/auth/twitch/callback";

  // Générer une chaîne aléatoire pour state
  const generateState = () => Math.random().toString(36).substring(2, 15);

  const handleAuthClick = () => {
    const state = generateState();
    const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:read:follows&state=${state}`;
    window.location.href = authUrl; // Rediriger l’utilisateur vers Twitch
  };

  useEffect(() => {
    const fetchFollowedChannels = async () => {
      try {
        // Vérifier si un token existe dans localStorage ou état
        const storedToken = localStorage.getItem("twitchAccessToken");
        if (storedToken) {
          setAccessToken(storedToken);
          await fetchChannelsWithToken(storedToken);
          return;
        }

        // Si pas de token, vérifier les paramètres d’URL pour un code d’autorisation
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (code && state) {
          // Échanger le code contre un token
          const tokenResponse = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            {
              grant_type: "authorization_code",
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const newAccessToken = tokenResponse.data.access_token;
          setAccessToken(newAccessToken);
          localStorage.setItem("twitchAccessToken", newAccessToken); // Stocker temporairement
          await fetchChannelsWithToken(newAccessToken);
        } else {
          // Pas de code, pas de token – afficher un bouton pour authentifier
          setLoadingChannels(false);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des chaînes suivies:", err);
        setError("Impossible de charger les chaînes suivies. Vérifie ton token ou tes credentials.");
        setLoadingChannels(false);
      }
    };

    const fetchChannelsWithToken = async (token) => {
      try {
        // Obtenir l’ID de l’utilisateur authentifié
        const userResponse = await axios.get("https://api.twitch.tv/helix/users", {
          headers: {
            "Client-ID": clientId,
            "Authorization": `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.data[0].id;
        console.log("Utilisateur ID:", userId);

        // Obtenir la liste des chaînes suivies
        let allFollows = [];
        let cursor = null;

        do {
          const followsResponse = await axios.get(
            `https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=100${cursor ? `&after=${cursor}` : ""}`,
            {
              headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${token}`,
              },
            }
          );

          allFollows = [...allFollows, ...followsResponse.data.data];
          cursor = followsResponse.data.pagination?.cursor;
        } while (cursor);

        console.log("Chaînes suivies:", allFollows);

        // Filtrer les chaînes en live
        const liveChannels = [];
        for (const follow of allFollows) {
          const streamResponse = await axios.get(
            `https://api.twitch.tv/helix/streams?user_id=${follow.to_id}`,
            {
              headers: {
                "Client-ID": clientId,
                "Authorization": `Bearer ${token}`,
              },
            }
          );

          if (streamResponse.data.data.length > 0) {
            const stream = streamResponse.data.data[0];
            liveChannels.push({
              id: follow.to_id,
              name: follow.to_name,
              game: stream.game_name || "Non spécifié",
              viewers: stream.viewer_count || 0,
              isLive: true,
              thumbnail: stream.thumbnail_url
                .replace("{width}", "70")
                .replace("{height}", "70"),
            });
          } else {
            liveChannels.push({
              id: follow.to_id,
              name: follow.to_name,
              game: "Non spécifié",
              viewers: 0,
              isLive: false,
              thumbnail: `https://via.placeholder.com/70x70?text=Offline`,
            });
          }
        }

        setFollowedChannels(liveChannels);
      } catch (err) {
        console.error("Erreur lors de la récupération des chaînes avec token:", err);
        setError("Erreur lors de la récupération des chaînes. Vérifie ton token.");
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchFollowedChannels();
  }, [clientId, clientSecret]);

  const sidebarStyle = {
    width: isSidebarHovered ? "300px" : "70px",
    backgroundColor: "#18181B",
    color: "white",
    padding: "10px",
    transition: "width 0.3s ease",
    position: "fixed",
    top: "60px", // Commencer en dessous de la Navbar (hauteur approximative de 60px, ajuste si nécessaire)
    bottom: 0,
    left: 0,
    overflowY: "auto",
    zIndex: 1000,
  };

  const sidebarChannelStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "5px",
    backgroundColor: isSidebarHovered ? "#2A2A2E" : "transparent",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const sidebarChannelImage = {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    marginRight: isSidebarHovered ? "10px" : "0",
    borderRadius: "5px",
  };

  const sidebarChannelText = {
    display: isSidebarHovered ? "block" : "none",
    marginLeft: "10px",
    color: "white",
  };

  const showMoreButtonStyle = {
    backgroundColor: "#9147FF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 15px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s ease",
  };

  const handleShowMore = () => {
    setShowMoreChannels(true);
    setFollowedChannels((prev) =>
      prev.map((channel) => ({
        ...channel,
        isLive: true, // Pour simuler, mais tu peux ajuster pour les offline
      }))
    );
  };

  // Filtrer les chaînes suivies pour n'afficher que celles en live, sauf si "Show More" est activé
  const visibleFollowedChannels = showMoreChannels
    ? followedChannels
    : followedChannels.filter((channel) => channel.isLive).slice(0, 5); // Limiter à 5 chaînes live par défaut

  if (loadingChannels) {
    return (
      <div style={sidebarStyle}>
        <h4 style={{ marginBottom: "15px", color: "#9147FF" }}>Chaînes suivies</h4>
        <p style={{ color: "white" }}>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={sidebarStyle}>
        <h4 style={{ marginBottom: "15px", color: "#9147FF" }}>Chaînes suivies</h4>
        <p style={{ color: "red" }}>{error}</p>
        <Button onClick={handleAuthClick} style={showMoreButtonStyle}>
          Authentifier avec Twitch
        </Button>
      </div>
    );
  }

  return (
    <div
      style={sidebarStyle}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <h4 style={{ marginBottom: "15px", color: "#9147FF" }}>Chaînes suivies</h4>
      {visibleFollowedChannels.map((channel) => (
        <div
          key={channel.id}
          style={sidebarChannelStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4B367C")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isSidebarHovered ? "#2A2A2E" : "transparent")}
          onClick={() => window.location.href = `/streamer/${channel.name.toLowerCase().replace(/\s/g, "")}`} // Rediriger vers la page du streamer
        >
          <img src={channel.thumbnail} alt={`${channel.name}`} style={sidebarChannelImage} />
          <div style={sidebarChannelText}>
            <p>{channel.name}</p>
            <p style={{ fontSize: "0.8rem", color: channel.isLive ? "#A970FF" : "#808080" }}>
              {channel.isLive ? `${channel.viewers.toLocaleString()} spectateurs - ${channel.game}` : "Hors ligne"}
            </p>
          </div>
        </div>
      ))}
      {!showMoreChannels && followedChannels.some((channel) => !channel.isLive) && (
        <button onClick={handleShowMore} style={showMoreButtonStyle}>
          Afficher plus
        </button>
      )}
    </div>
  );
};

export default Sidebar;