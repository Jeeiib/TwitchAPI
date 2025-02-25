import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container } from 'react-bootstrap';
import { getTopStreamers } from '../services/twitchService';

const CarouselTopStream = () => {
    const [topStreamers, setTopStreamers] = useState([]);
    const [error, setError] = useState(null);
    const [index, setIndex] = useState(0);
    const iframeRefs = useRef([]);

    // Récupération des top streamers
    const fetchTopStreamers = async () => {
        try {
            const response = await getTopStreamers();
            console.log("Réponse complète :", response);
            if (response && response) {
                setTopStreamers(response);
                // Initialiser les références pour chaque iframe
                iframeRefs.current = new Array(response.length).fill(null).map(() => React.createRef());
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

    // Gérer le changement de slide et activer le son
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
        
        // Désactiver le son de tous les iframes
        iframeRefs.current.forEach((ref, i) => {
            if (ref && ref.current) {
                // Si ce n'est pas l'iframe actif, mettre en sourdine
                if (i !== selectedIndex) {
                    const iframe = ref.current;
                    try {
                        // Utiliser l'API postMessage de Twitch pour mettre en sourdine
                        iframe.contentWindow.postMessage(
                            JSON.stringify({ type: 'setMuted', value: true }),
                            '*'
                        );
                    } catch (e) {
                        console.error("Impossible de mettre en sourdine l'iframe", e);
                    }
                }
            }
        });
        
        // Activer le son de l'iframe actif
        if (iframeRefs.current[selectedIndex] && iframeRefs.current[selectedIndex].current) {
            const iframe = iframeRefs.current[selectedIndex].current;
            try {
                // Utiliser l'API postMessage de Twitch pour activer le son
                iframe.contentWindow.postMessage(
                    JSON.stringify({ type: 'setMuted', value: false }),
                    '*'
                );
            } catch (e) {
                console.error("Impossible d'activer le son de l'iframe", e);
            }
        }
    };

    return (
        <Container fluid style={{ 
            backgroundColor: "#0e0e10", 
            color: 'white', 
            width: '100vw', 
            padding: '0',
            margin: '0',
            maxWidth: '100%'
        }}>
            <Carousel 
                fade 
                activeIndex={index}
                onSelect={handleSelect}
                interval={null} 
            >
                {error ? (
                    <Carousel.Item>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '90vh' 
                        }}>
                            <p>{error}</p>
                        </div>
                    </Carousel.Item>
                ) : topStreamers.length > 0 ? (
                    topStreamers.map((streamer, idx) => (
                        <Carousel.Item key={idx}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                height: '90vh' 
                            }}>
                                <iframe
                                    ref={el => iframeRefs.current[idx] = el}
                                    src={`https://player.twitch.tv/?channel=${streamer.user_name}&parent=localhost&muted=${idx !== index}`}
                                    height="70%"
                                    width="70%"
                                    frameBorder="0"
                                    allowFullScreen={true}
                                />
                            </div>
                            
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '90vh' // Utilise 90% de la hauteur de la fenêtre
                        }}>
                            <p>Aucun streamer en direct pour le moment...</p>
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
        </Container>
    );
};

export default CarouselTopStream;