import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import CarouselTopStream from '../components/Carroussel';
import RecommendedStreams from '../components/Streamrecommandé';

const popularGames = [
    { id: '21779', title: "League of Legends" },
    { id: '509658', title: "Just Chatting" },
    { id: '516575', title: "VALORANT" },
    { id: '32982', title: "Grand Theft Auto V" }
];





const HomePage = () => {
    return (
        <Container fluid className="px-2 py-4">
            <div>
                <CarouselTopStream />
            </div>
            {popularGames.map((game) => (
                <div className="mt-5" key={game.id}>
                    <RecommendedStreams gameId={game.id} gameTitle={game.title} limit={4} />
                </div>
            ))};
        </Container>
    );

};

export default HomePage;