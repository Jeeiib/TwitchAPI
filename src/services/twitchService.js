import axios from "axios";

const CLIENT_ID = "w7jrk3kepcklxgzvfpjbrkzajy7o4w";
const CLIENT_SECRET = "2dkfcn3im8ztu8559kijhu6qt3ld4i";

const twitchApi = axios.create({
  baseURL: "https://api.twitch.tv/helix/",
  headers: {
    "Client-ID": CLIENT_ID,
  },
});

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
    throw error;
  }
};

twitchApi.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const getTopGames = async (limit = 20) => {
  try {
    const response = await twitchApi.get(`games/top?first=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    throw error;
  }
};

export const getTopStreamers = async (limit=20) => {
  try {
    const response = await twitchApi.get(`streams?first=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des top streamers :", error);
    throw error;
  }
};

export const getViewersByGame = async (gameId) => {
  try {
    const response = await twitchApi.get(`streams?game_id=${gameId}&first=100`);
    const streams = response.data.data;
    const totalViewers = streams.reduce(
      (sum, stream) => sum + stream.viewer_count,
      0
    );
    return totalViewers;
  } catch (error) {
    console.error("Erreur lors de la récupération des spectateurs :", error);
    throw error;
  }
};

const predefinedGameCategories = {
  "21779": ["Action", "FPS", "Battle Royale"], // Fortnite
  "33214": ["Sport", "Simulation", "Football"], // FIFA
  "32982": ["MOBA", "Stratégie", "Compétitif"], // League of Legends
  "32399": ["FPS", "Compétitif", "Action"], // Counter-Strike
  "27471": ["Sandbox", "Aventure", "Survie"], // Minecraft
  "32982": ["MOBA", "Stratégie", "Action"], // DOTA 2
  "516575": ["FPS", "Compétitif", "Action"], // VALORANT
  "33214": ["Sport", "Simulation", "Football"], // FIFA
  "512710": ["Battle Royale", "FPS", "Action"], // Call of Duty: Warzone
  // Ajoutez d'autres jeux populaires selon vos besoins...
};

// Fonction pour récupérer les catégories d'un jeu spécifique
export const getGameCategories = async (gameId) => {
  console.log(`Récupération des catégories pour le jeu ID: ${gameId}`);
  try {
    // Vérifier si nous avons des catégories prédéfinies pour ce jeu
    if (predefinedGameCategories[gameId]) {
      console.log("Catégories récupérées (prédéfinies):", predefinedGameCategories[gameId]);
      return predefinedGameCategories[gameId];
    }
    
    // Si nous n'avons pas de catégories prédéfinies, essayons d'obtenir le nom du jeu
    const response = await twitchApi.get(`games?id=${gameId}`);
    if (response.data && response.data.data && response.data.data.length > 0) {
      const gameName = response.data.data[0].name.toLowerCase();
      
      // Essayer de déterminer les catégories en fonction du nom
      let defaultCategories = ['Jeux vidéo'];
      
      // Logique pour déterminer les catégories en fonction du nom du jeu
      if (gameName.includes('shooter') || gameName.includes('fps')) {
        defaultCategories = ['FPS', 'Action', 'Tir'];
      } else if (gameName.includes('strategy') || gameName.includes('stratégie')) {
        defaultCategories = ['Stratégie', 'Réflexion'];
      } else if (gameName.includes('rpg') || gameName.includes('role-playing')) {
        defaultCategories = ['RPG', 'Aventure'];
      } else if (gameName.includes('sport') || gameName.includes('racing') || gameName.includes('course')) {
        defaultCategories = ['Sport', 'Simulation'];
      }
      
      console.log("Catégories récupérées (déduites):", defaultCategories);
      return defaultCategories;
    }

    return ['Jeux vidéo']; // Catégorie par défaut
  } catch (error) {
    console.error("Erreur dans getGameCategories:", error);
    return ['Jeux vidéo']; // Catégorie par défaut en cas d'erreur
  }
};

export const checkStreamStatus = async (streamerName) => {
  const response = await fetch(
    "https://api.twitch.tv/helix/streams?user_login=${streamerName}"
  );
  const data = await response.json();
  return data.data.length > 0; // Retourne true si en direct, false sinon
};

export const getStreamsByGame = async (gameId) => {
  try {
    const response = await twitchApi.get(`streams?game_id=${gameId}&first=100`);
    return response.data.data; // Retourne les 100 premiers streams pour ce jeu
  } catch (error) {
    console.error("Erreur lors de la récupération des streams par jeu :", error);
    throw error;
  }
};

export default twitchApi;
