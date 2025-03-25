import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React from 'react';
import Admin from "./components/Admin/admin";
import User from './components/User/user';
import Map from './components/Map/map';
import "./App.css";

function Home() {
  const navigate = useNavigate();  // useNavigate hook for navigation

  return (
    <>
      <h1>Hello</h1>
      <div>
        <button onClick={() => navigate("/user")}>User</button>
        <button onClick={() => navigate("/admin")}>Admin</button>
        {/* <button onClick={() => navigate("/map")}>Map</button> */}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
