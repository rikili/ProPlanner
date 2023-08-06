import React from 'react';
import { useState } from 'react';
import {
	GoogleMap,
	useJsApiLoader,
	MarkerF as Marker,
} from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../redux/errorSlice';
import { ERR_TYPE, MAP_LIBRARIES } from '../constants';

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
					const { lat, lng } = data.results[0].geometry.location;
					resolve({ lat, lng });
				} else {
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
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: apiKey,
		libraries: MAP_LIBRARIES,
	});

	const location = useSelector(state => state.planParameters.location);
	const [lat, setLat] = useState(0);
	const [lng, setLng] = useState(0);
	const dispatch = useDispatch();

	getLatLng(location)
		.then(({ lat, lng }) => {
			setLat(lat);
			setLng(lng);
		})
		.catch((err) => {
			if (err.message === 'no result found.') {
				dispatch(
					setError({
						errType: ERR_TYPE.INFO,
						message: 'The location of this plan could not be found.',
					})
				);
			} else {
				dispatch(
					setError({
						errType: ERR_TYPE.WARN,
						message: 'Maps has failed to load properly. Please try again later.',
					})
				);
			}
		});

	return (
		<div className="d-flex justify-content-center">
			{!isLoaded ? (
				<h1>Loading...</h1>
			) : (
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={{ lat, lng }}
					zoom={6.5}
				>
					<Marker position={{ lat, lng }} />
				</GoogleMap>
			)}
		</div>
	);
};
export default Map;
