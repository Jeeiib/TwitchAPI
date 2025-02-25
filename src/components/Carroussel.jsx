import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getTopStreamers } from '../services/twitchService'; 
const CarouselTopStream = () => {
    const [topStreamers, setTopStreamers] = useState([]);

    const fetchTopStreamers = async () => {
        try {
            const response = await getTopStreamers();
            console.log(response.data);
            setTopStreamers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des top streamers :", error);
        }
    }

    useEffect(() => {
        fetchTopStreamers();
    }, []);

    return (
        <Container fluid style={{ backgroundColor: "#0e0e10", color: 'white', width: '100vw', padding: '20px 0' }}>
            <Carousel fade>
                {topStreamers.map((streamer, index) => (
                    <Carousel.Item key={index}>
                        <video className="d-block w-100" controls>
                            <source src={streamer.video_url} type="video/mp4" /> 
                            Votre navigateur ne supporte pas la balise vidéo.
                        </video>
                        <Carousel.Caption>
                            <h3>{streamer.user_name}</h3>
                            <p>{streamer.description} viewers</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
}

export default CarouselTopStream;