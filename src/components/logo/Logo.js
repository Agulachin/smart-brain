import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br3 shadow-4' options={{ max: '65', easing:"cubic-bezier(.03,.98,.52,.99)", perspective: '1000',}} style={{ height: 100, width: 100}}>
                <div className='Tilt-inner'>
                    <img src={brain} alt='logo brain' /></div>
            </Tilt>
        </div>
    )
}

export default Logo