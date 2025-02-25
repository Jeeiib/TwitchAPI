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

export const getTopGames = async () => {
  try {
    const response = await twitchApi.get(`games/top?first=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux :", error);
    throw error;
  }
};

export const getTopStreamers = async () => {
  try {
    const response = await twitchApi.get(`streams?first=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des top streamers :', error);
    throw error;
  }
};

export default twitchApi;
