import React from 'react';
import { Carousel } from 'react-bootstrap';
import CarouselTopStream from '../components/Carroussel';


const HomePage = () => {
    return (
        <div>
            <h1 className='text-center'>Top Streamers</h1>
            <div>
                <CarouselTopStream />
            </div>
        
        </div>
    );
};

export default HomePage;