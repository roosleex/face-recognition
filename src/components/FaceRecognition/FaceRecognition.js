import React from 'react';

const FaceRecognition = ({imageUrl}) => {
    console.log('FaceRecognition', 'imageUrl=' + imageUrl);
    return (
    <div className='center ma'>
        <div className='absolute mt2'>
            <img src={imageUrl} alt='face-recognition' width='500px' height='auto'/>
        </div>
    </div>
    );
}

export default FaceRecognition;