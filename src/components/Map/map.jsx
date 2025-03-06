import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
    width: "100%",
    height: "100vh",
};

const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad example

const Map = () => {
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [directions, setDirections] = useState(null);
    const mapApi = import.meta.env.VITE_MAP_API_KEY;

    useEffect(() => {
        // Fetch locations from API
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/locations`)
            .then(response => setLocations(response.data))
            .catch(error => console.log(error));

        // Watch user's live location
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.log("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 1000 }
            );

            // Cleanup function to stop tracking when component unmounts
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    useEffect(() => {
        if (userLocation && destination) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userLocation,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error("Error fetching directions:", status);
                    }
                }
            );
        }
    }, [userLocation, destination]);

    return (
        <LoadScript googleMapsApiKey={mapApi}>
            <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                center={userLocation || defaultCenter} // Center on user's location
                zoom={14}
            >
                {/* Show live user location */}
                {userLocation && (
                    <Marker 
                        position={userLocation} 
                        label="You"
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                    />
                )}

                {/* Show saved locations */}
                {locations.map((location) => (
                    <Marker
                        key={location._id}
                        position={{ lat: location.lat, lng: location.lng }}
                        onClick={() => setDestination({ lat: location.lat, lng: location.lng })}
                    />
                ))}

                {/* Show route if a destination is selected */}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
