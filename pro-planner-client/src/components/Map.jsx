

import React from 'react'
import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF as Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux';

const containerStyle = {
  width: '400px',
  height: '400px'
};




const apiKey = '*****************************************';
const getLatLng = address => {
    return new Promise((resolve, reject) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    // console.log('Latitude:', lat);
                    // console.log('Longitude:', lng);
                    resolve({ lat, lng })
                } else {
                    console.log('No results found.');
                    reject(new Error('no result found.'));
                }})
            .catch(error => {
                console.error('Error:', error);
                reject(error)
            });  
    })
}


const Map = () => {
    const { isLoaded } = useJsApiLoader({
        //NOTE: manually insert API KEY. .env file not working right now.
        googleMapsApiKey: apiKey,
        libraries: ['places'],
    });
    
    const location = useSelector(state => state.planParameters.location);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    getLatLng(location).then(({lat, lng}) => {
        setLat(lat);
        setLng(lng);
    });

    
    return (
    <>
        { !isLoaded ? (
        <h1>Loading...</h1>
        ) : (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{lat, lng}}
            zoom={11.5}
        >
            <Marker
            position={{lat, lng}}
            />
        </GoogleMap>
        )}
    </>

    )

}
export default Map;
