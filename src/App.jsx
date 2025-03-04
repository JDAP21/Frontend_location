import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Admin from "./components/Admin/admin";
import User from './components/User/user';
import "./App.css";

function App() {
  return (<>
  <h1>Hello</h1>
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
