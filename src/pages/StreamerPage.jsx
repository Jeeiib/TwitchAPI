import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../pages/StreamerPage.css'; // Créez ce fichier CSS

const StreamerPage = () => {
    const { streamerName } = useParams();
    const location = useLocation();
    const [streamerInfo, setStreamerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStreamerInfo = async () => {
            try {
                setIsLoading(true);
                // Si vous avez besoin de données supplémentaires du streamer, vous pouvez faire une requête API ici
                // const response = await axios.get(`votre-endpoint-api/${streamerName}`);
                // setStreamerInfo(response.data);
                
                // Pour l'exemple, on utilise directement le nom du streamer
                setStreamerInfo({ username: streamerName });
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations du streamer:", error);
                setIsLoading(false);
            }
        };
        
        if (streamerName) {
            fetchStreamerInfo();
        }
    }, [streamerName]);
    
    if (isLoading) {
        return <div>Chargement du stream...</div>;
    }
    
    return (
        <div className="streamer-page">
            <h1 className="stream-title">Stream de {streamerInfo?.username}</h1>
            
            <div className="stream-layout">
                <div className="stream-container">
                    {streamerName && (
                        <iframe 
                            src={`https://player.twitch.tv/?channel=${streamerName}&parent=${window.location.hostname}`}
                            height="720"
                            width="100%"
                            allowFullScreen={true}
                            frameBorder="0"
                            title={`Stream de ${streamerName}`}
                        ></iframe>
                    )}
                </div>
                
                <div className="chat-container">
                    {streamerName && (
                        <iframe 
                            src={`https://www.twitch.tv/embed/${streamerName}/chat?parent=${window.location.hostname}`}
                            height="720"
                            width="100%"
                            frameBorder="0"
                            title={`Chat de ${streamerName}`}
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default StreamerPage;