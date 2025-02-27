import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Remplacer useHistory par useNavigate
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      const clientId = "vxdclru1cktj87ls7rmhoybi5c4os1";
      const clientSecret = "osro5gs6xqimw83jti7z6yj8h0p11g";
      const redirectUri = "http://localhost:5173/auth/twitch/callback";

      axios
        .post(
          "https://id.twitch.tv/oauth2/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((response) => {
          localStorage.setItem("twitchAccessToken", response.data.access_token);
          navigate("/"); // Utiliser navigate au lieu de history.push
        })
        .catch((err) => {
          console.error("Erreur lors de l’échange du code :", err);
          navigate("/?error=auth_failed"); // Redirection en cas d'erreur
        });
    }
  }, [navigate]);

  return <div>Authentification en cours...</div>;
};

export default AuthCallback;