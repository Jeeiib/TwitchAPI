import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container } from 'react-bootstrap';
import { getTopStreamers } from '../services/twitchService';

const CarouselTopStream = () => {
    const [topStreamers, setTopStreamers] = useState([]);
    const [error, setError] = useState(null); // Ajout pour gérer les erreurs

    const fetchTopStreamers = async () => {
        try {
            const response = await getTopStreamers();
            console.log("Réponse complète :", response);
            if (response && response) {
                setTopStreamers(response); // Met à jour si données valides
            } else {
                console.warn("Aucune donnée valide dans la réponse :", response);
                setTopStreamers([]);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des top streamers :", error);
            setError("Impossible de charger les streamers.");
            setTopStreamers([]);
        }
    };

    useEffect(() => {
        fetchTopStreamers();
    }, []);

    return (
        <Container fluid style={{ backgroundColor: "#0e0e10", color: 'white', width: '100vw', padding: '20px 0' }}>
            <Carousel fade>
                {error ? (
                    <Carousel.Item>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                            <p>{error}</p>
                        </div>
                    </Carousel.Item>
                ) : topStreamers.length > 0 ? (
                    topStreamers.map((streamer, index) => (
                        <Carousel.Item key={index}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <iframe
                                    src={`https://player.twitch.tv/?channel=${streamer.user_name}&parent=localhost`}
                                    height="400"
                                    width="100%"
                                    frameBorder="0"
                                    allowFullScreen={true}
                                />
                            </div>
                            <Carousel.Caption>
                                <h3>{streamer.user_name || 'Streamer inconnu'}</h3>
                                <p>{streamer.viewer_count ? `${streamer.viewer_count} viewers` : 'Pas de viewers'}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                            <p>Aucun streamer en direct pour le moment...</p>
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
        </Container>
    );
};

export default CarouselTopStream;