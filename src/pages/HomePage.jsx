import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import CarouselTopStream from '../components/Carroussel';
import RecommendedStreams from '../components/Streamrecommandé';

const GAME_ID = "21779";
const GAME_TITLE = 'League of Legends';
const HomePage = () => {
    return (
        <Container fluid className="px-2 py-4">
        <div>
            <CarouselTopStream />
        </div>
        
        <div className="mt-5">
            <RecommendedStreams gameId={GAME_ID} gameTitle={GAME_TITLE} />
        </div>
    </Container>
    );
};

export default HomePage;