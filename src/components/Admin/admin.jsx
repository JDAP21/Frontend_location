import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
    width: "100%",
    height: "100vh",
};

const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Default location (Ahmedabad example)

const Admin = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapapi = import.meta.env.VITE_MAP_API_KEY;

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/locations`)
            .then(response => setLocations(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        // <LoadScript googleMapsApiKey=(`${mapapi}`)>
        <LoadScript googleMapsApiKey={mapapi}>

            <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={12}>
                {locations.map((location) => (
                    <Marker 
                        key={location._id} 
                        position={{ lat: location.lat, lng: location.lng }}
                        onClick={() => setSelectedLocation(location)}
                    />
                ))}

                {selectedLocation && (
                    <InfoWindow 
                        position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        onCloseClick={() => setSelectedLocation(null)}
                    >
                        <div>
                            <h4>{selectedLocation.name}</h4>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
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

