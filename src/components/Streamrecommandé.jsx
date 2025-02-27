import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { getRecommendedStreamsByGame } from '../services/twitchService';
import '../components/streamrecommandé.css';


const RecommendedStreams = ({ gameId, gameTitle, limit = 4 }) => {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredStream, setHoveredStream] = useState(null);
    const [previewTimeout, setPreviewTimeout] = useState(null);

    useEffect(() => {
        const fetchRecommendedStreams = async () => {
            try {
                setLoading(true);
                const data = await getRecommendedStreamsByGame(gameId);
                setStreams(data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des streams recommandés:", error);
                setError("Impossible de charger les streams recommandés");
                setLoading(false);
            }
        };

        if (gameId) {
            fetchRecommendedStreams();
        }
    }, [gameId]);

    // Fonction pour transformer l'URL de la miniature
    const formatThumbnailUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/440x248?text=No+live+Image';
        return url.replace('{width}', '440').replace('{height}', '248');
    };


    const handleMouseEnter = (streamId) => {
        const timeout = setTimeout(() => {
            setHoveredStream(streamId);
        }, 500);
        setPreviewTimeout(timeout);
    };

    const handleMouseLeave = () => {
        if (previewTimeout) {
            clearTimeout(previewTimeout);
        }
        setHoveredStream(null);
    };

    if (error) {
        return <div className="text-danger text-center my-4">{error}</div>;
    }

    if (streams.length === 0) {
        return null;
    }

    return (
        <div className="recommended-streams my-4">
            <h3 className="mb-3">{gameTitle}</h3>
            <br />
            <Row className="stream-row">
                {streams.slice(0, 4).map((stream) => (
                    <Col key={stream.id} md={3} className="stream-col">
                        <div className="stream-card-wrapper">
                            <Link to={`/streamer/${stream.user_login}`} style={{ textDecoration: 'none' }}>
                                <Card className="stream-card"
                                    onMouseEnter={() => handleMouseEnter(stream.id)}
                                    onMouseLeave={handleMouseLeave}>
                                    <div className="thumbnail-container">
                                        {hoveredStream === stream.id ? (
                                            <div className="preview-container">
                                                <iframe
                                                    src={`https://player.twitch.tv/?channel=${stream.user_login}&parent=${window.location.hostname}&muted=true&autoplay=true&controls=false`}
                                                    height="248"
                                                    width="100%"
                                                    allowFullScreen={false}
                                                    frameBorder="0"
                                                    title={`Preview de ${stream.user_name}`}
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <>
                                                <Card.Img
                                                    variant="top"
                                                    src={formatThumbnailUrl(stream.thumbnail_url)}
                                                    alt={`Stream de ${stream.user_name}`}
                                                    loading="lazy"
                                                />
                                                {stream.viewer_count && (
                                                    <div className="viewer-badge">
                                                        <span>🔴 {stream.viewer_count.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <div className="stream-info">
                                            <div className="stream-title">{stream.title}</div>
                                            <div className="stream-user">{stream.user_name}</div>
                                            <div className="stream-game">{stream.game_name}</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default RecommendedStreams;