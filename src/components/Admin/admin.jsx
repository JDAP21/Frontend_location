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

const Admin = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/v1/message/locations")
            .then(response => setLocations(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer center={[23.0225, 72.5714]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds locations={locations} />
                {locations.map((location) => (
                    <Marker key={location._id} position={[location.lat, location.lng]}>
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
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

