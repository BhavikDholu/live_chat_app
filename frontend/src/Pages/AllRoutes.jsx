import {Routes,Route} from "react-router-dom";
import React from 'react'
import Home from "./Home";
import Chat from "./Chat";
import Login from "./Login";
import Signup from "./Signup";

function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/chat" element={<Chat/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
    </Routes>
  );
}

export default AllRoutes