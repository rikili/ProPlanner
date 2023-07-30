import React from 'react';
import {useState} from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    MarkerF as Marker,
} from '@react-google-maps/api';
import {useSelector} from 'react-redux';
// require('dotenv').config();

const containerStyle = {
    width: '2000px',
    height: '400px',
};

const apiKey = process.env.REACT_APP_API_KEY;
const getLatLng = address => {
    return new Promise((resolve, reject) => {
        fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${apiKey}`
        )
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const {lat, lng} = data.results[0].geometry.location;
                    resolve({lat, lng});
                } else {
                    console.log('No results found.');
                    reject(new Error('no result found.'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
};

const Map = () => {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: ['places'],
    });

    //Hard-coded now for testing / demo purposes
    // const location = useSelector(state => state.planParameters.location);
    const location = 'Vancouver';
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    getLatLng(location).then(({lat, lng}) => {
        setLat(lat);
        setLng(lng);
    });

    return (
        <div className="d-flex justify-content-center">
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{lat, lng}}
                    zoom={6.5}
                >
                    <Marker position={{lat, lng}}/>
                </GoogleMap>
            )}
        </div>
    );
};
export default Map;
