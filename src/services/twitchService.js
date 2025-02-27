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

export const getTopGames = async (pagination = "") => {
  try {
    const response = await twitchApi.get(
      `games/top?first=100${pagination ? `&after=${pagination}` : ""}`
    );
    return {
      data: response.data.data, // Liste des jeux
      pagination: response.data.pagination.cursor, // Curseur pour la page suivante
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des top jeux :", error);
    throw error;
  }
};

export const getTopStreamers = async (limit = 20) => {
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

// Fonction pour récupérer les catégories d'un jeu spécifique
export const getGameCategories = async (gameId) => {
  console.log(`Récupération des catégories pour le jeu ID: ${gameId}`);
  try {
    // Vérifier si nous avons des catégories prédéfinies pour ce jeu
    if (predefinedGameCategories[gameId]) {
      console.log(
        "Catégories récupérées (prédéfinies):",
        predefinedGameCategories[gameId]
      );
      return predefinedGameCategories[gameId];
    }

    // Si nous n'avons pas de catégories prédéfinies, essayons d'obtenir le nom du jeu
    const response = await twitchApi.get(`games?id=${gameId}`);
    if (response.data && response.data.data && response.data.data.length > 0) {
      const gameName = response.data.data[0].name.toLowerCase();

      // Essayer de déterminer les catégories en fonction du nom
      let defaultCategories = ["Jeux vidéo"];

      // Logique pour déterminer les catégories en fonction du nom du jeu
      if (gameName.includes("shooter") || gameName.includes("fps")) {
        defaultCategories = ["FPS", "Action", "Tir"];
      } else if (
        gameName.includes("strategy") ||
        gameName.includes("stratégie")
      ) {
        defaultCategories = ["Stratégie", "Réflexion"];
      } else if (
        gameName.includes("rpg") ||
        gameName.includes("role-playing")
      ) {
        defaultCategories = ["RPG", "Aventure"];
      } else if (
        gameName.includes("sport") ||
        gameName.includes("racing") ||
        gameName.includes("course")
      ) {
        defaultCategories = ["Sport", "Simulation"];
      }

      console.log("Catégories récupérées (déduites):", defaultCategories);
      return defaultCategories;
    }

    return ["Jeux vidéo"]; // Catégorie par défaut
  } catch (error) {
    console.error("Erreur dans getGameCategories:", error);
    return ["Jeux vidéo"]; // Catégorie par défaut en cas d'erreur
  }
};

export const getGameNameById = async (gameId) => {
  try {
    const response = await twitchApi.get(`games?id=${gameId}`);
    const game = response.data.data[0]; // Le premier résultat correspond au gameId
    return game ? game.name : "Jeu inconnu"; // Retourne le nom ou une valeur par défaut
  } catch (error) {
    console.error("Erreur lors de la récupération du nom du jeu :", error);
    return "Jeu inconnu";
  }
};

export const getStreamsByGame = async (gameId, pagination = "") => {
  try {
    const response = await twitchApi.get(
      `streams?game_id=${gameId}&first=100${
        pagination ? `&after=${pagination}` : ""
      }`
    );
    return {
      data: response.data.data, // Les 100 streams de cette page
      pagination: response.data.pagination.cursor, // Curseur pour la page suivante
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des streams par jeu :",
      error
    );
    throw error;
  }
};

export default twitchApi;
