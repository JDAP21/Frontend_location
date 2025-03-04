import React, { useState } from "react";
import axios from "axios";

const User = () => {
    const [name, setName] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState(""); 

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude.toString());
                    setLng(position.coords.longitude.toString());
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Failed to get current location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !lat || !lng) {
            alert("Please enter all fields or fetch current location.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/v1/user/locations", { name, lat, lng });
            console.log("Location added:", response.data);
            alert("Location added successfully!");
            setName(""); 
            setLat("");
            setLng("");
        } catch (error) {
            console.error("Error adding location:", error);
            alert("Failed to add location.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Add Location</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter location name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                    type="number"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    disabled
                />
                <input
                    type="number"
                    placeholder="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                    disabled
                />
                <button type="button" onClick={getCurrentLocation} style={{ padding: "10px", margin: "10px", cursor: "pointer" }}>
                    Use Current Location
                </button>
                <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
                    Add Location
                </button>
            </form>
        </div>
    );
};

export default User;
