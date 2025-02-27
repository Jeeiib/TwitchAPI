import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStreamerInfo } from '../services/twitchService';
import '../pages/StreamerPage.css';

const StreamerPage = () => {
    const { streamerName } = useParams();
    const [streamerInfo, setStreamerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStreamerInfo = async () => {
            try {
                setIsLoading(true);
                const data = await getStreamerInfo(streamerName);
                console.log("Données du streamer récupérées:", data);
                setStreamerInfo(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations du streamer:", error);
                setError("Impossible de charger les informations du streamer");
                setIsLoading(false);
            }
        };

        if (streamerName) {
            fetchStreamerInfo();
        }
    }, [streamerName]);

    if (isLoading) {
        return <div className="loading-container">Chargement du stream...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="streamer-page">
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

                    {/* Section d'informations du streamer */}
                    {streamerInfo && (
                        <div className="streamer-info">
                            <div className="streamer-header">
                                <img
                                    src={streamerInfo.profile_image_url}
                                    alt={`${streamerInfo.display_name} avatar`}
                                    className="streamer-avatar"
                                    loading="lazy"
                                    width="64"
                                    height="64"
                                />
                                <div className="streamer-titles">
                                    <h2 className="streamer-name">{streamerInfo.display_name}</h2>
                                    <div className="streamer-status-container">
                                        {streamerInfo.isLive && (
                                            <div className="live-indicator">EN DIRECT</div>

                                        )}
                                        {streamerInfo.tags && streamerInfo.tags.length > 0 && (
                                            <div className="tags-container">
                                                {Array.isArray(streamerInfo.tags) ?
                                                    streamerInfo.tags.map((tag, index) => (
                                                        <span key={index} className="tag-indicator">{tag}</span>
                                                    ))
                                                    :
                                                    <span className="tag-indicator">{streamerInfo.tags}</span>
                                                }
                                            </div>
                                        )}

                                    </div>
                                    {streamerInfo.stream?.title && (
                                        <h3 className="stream-title">{streamerInfo.stream.title}</h3>
                                    )}
                                </div>
                            </div>

                            <div className="streamer-stats">
                                {streamerInfo.stream?.viewer_count && (
                                    <div className="stat-item">
                                        <span className="stat-value">{streamerInfo.stream.viewer_count.toLocaleString()}</span>
                                        <span className="stat-label">spectateurs</span>
                                    </div>
                                )}
                                
                                {streamerInfo.stream?.game_name && (
                                    <div className="stat-item">
                                        <span className="stat-value">{streamerInfo.stream.game_name}</span>
                                        <span className="stat-label">jeu</span>
                                    </div>
                                )}
                            </div>

                            {streamerInfo.description && (
                                <div className="streamer-bio">
                                    <p>{streamerInfo.description}</p>
                                </div>
                            )}
                             

                        </div>
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