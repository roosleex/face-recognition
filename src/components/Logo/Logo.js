import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
           <Tilt className='logoTilt'>  
                 <img src={brain} alt='brain' style={{paddingTop: '5px'}}/>
            </Tilt>
    
    );
}

export default Logo;