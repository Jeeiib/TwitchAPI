import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';
import { useEffect } from 'react';
import twitchService from 'services/twitchService';

const CarouselTopStream = () => {

    const [topStreamers, setTopStreamers] = useState([]);


    const fetchTopStreamers = async () => {
        try {
            const response = await twitchService.getTopStreamers();
            console.log(response.data);
            setTopStreamers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des top streamers :", error);
        }
    }

    useEffect(() => {
        fetchTopStreamers();
    }, []);


    return <>

        <Carousel fade>
            {topStreamers.map((streamer, index) => (
                <Carousel.Item key={index}>
                    <img src="" alt="" />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>



    </>;
}

export default CarouselTopStream;