// import React, { useEffect, useState } from "react";
// import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//     width: "100%",
//     height: "100vh",
// };

// const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Default location (Ahmedabad example)

// const Admin = () => {
//     const [locations, setLocations] = useState([]);
//     const [selectedLocation, setSelectedLocation] = useState(null);
//     const mapapi = import.meta.env.VITE_MAP_API_KEY;

//     useEffect(() => {
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/locations`)
//             .then(response => setLocations(response.data))
//             .catch(error => console.log(error));
//     }, []);

//     return (
//         // <LoadScript googleMapsApiKey=(`${mapapi}`)>
//         <LoadScript googleMapsApiKey={mapapi}>

//             <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={12}>
//                 {locations.map((location) => (
//                     <Marker 
//                         key={location._id} 
//                         position={{ lat: location.lat, lng: location.lng }}
//                         onClick={() => setSelectedLocation(location)}
//                     />
//                 ))}

//                 {selectedLocation && (
//                     <InfoWindow 
//                         position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
//                         onCloseClick={() => setSelectedLocation(null)}
//                     >
//                         <div>
//                             <h4>{selectedLocation.name}</h4>
//                         </div>
//                     </InfoWindow>
//                 )}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default Admin;






import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Custom icon for stored locations
const locationIcon = new L.Icon({
    iconUrl: "https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png",
    iconSize: [40, 40],  
    iconAnchor: [20, 40], 
    popupAnchor: [0, -40], 
});

// Custom icon for user’s current location
const userLocationIcon = new L.Icon({
    iconUrl: "https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png",
    iconSize: [40, 40],  
    iconAnchor: [20, 40], 
    popupAnchor: [0, -40], 
});

// Fit map to include all markers
const FitBounds = ({ locations }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const bounds = locations.map(loc => [loc.lat, loc.lng]);
            map.fitBounds(bounds);
        }
    }, [locations, map]);
    return null;
};

// Component to handle routing
const RouteLayer = ({ userLocation, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (!userLocation || !destination) return;

        // Remove existing routes before adding a new one
        map.eachLayer(layer => {
            if (layer instanceof L.Routing.Control) {
                map.removeLayer(layer);
            }
        });

        // Create and add the route
        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation.lat, userLocation.lng),
                L.latLng(destination.lat, destination.lng),
            ],
            routeWhileDragging: true,
            show: true,
            createMarker: () => null, // Hide default markers
            lineOptions: {
                styles: [{ color: "blue", weight: 6, opacity: 0.7 }], // Change route color to blue
            },
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [userLocation, destination, map]);

    return null;
};

// Load API keys from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Admin = () => {
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null); // Store selected destination

    // Fetch stored locations from API
    useEffect(() => {
        axios.get(`${BACKEND_URL}/admin/locations`)
            .then(response => setLocations(response.data))
            .catch(error => console.log(error));
    }, []);

    // Get user's live location
    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.log("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 1000 }
            );
        }

        // Cleanup function to stop tracking when component unmounts
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer center={[23.0225, 72.5714]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds locations={[...locations, userLocation].filter(Boolean)} />

                {/* Show user's live location */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                        <Popup>My Current Location</Popup>
                    </Marker>
                )}

                {/* Show stored locations */}
                {locations.map((location) => (
                    <Marker 
                        key={location._id} 
                        position={[location.lat, location.lng]} 
                        icon={locationIcon}
                        eventHandlers={{
                            click: () => setDestination(location) // Set destination on click
                        }}
                    >
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}

                {/* Display route when a destination is selected */}
                {userLocation && destination && (
                    <RouteLayer userLocation={userLocation} destination={destination} />
                )}
            </MapContainer>
        </div>
    );
};

export default Admin;







// import React from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// // Location Data
// const locations = [
//     { id: 1, name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
//     { id: 2, name: "Thaltej", lat: 23.0504, lng: 72.4991 },
//     { id: 3, name: "Adalaj", lat: 23.17, lng: 72.58 },
// ];

// // Google Maps API Key (Replace with your key)
// // const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 
// const GOOGLE_MAPS_API_KEY = "AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe";

// const containerStyle = {
//     width: "100%",
//     height: "100vh",
// };

// const Map = () => {
//     return (
//         <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={{ lat: 23.05, lng: 72.55 }}
//                 zoom={12}
//             >
//                 {locations.map((location) => (
//                     <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} />
//                 ))}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default Map;

