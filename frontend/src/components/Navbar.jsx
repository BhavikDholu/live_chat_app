import React from "react";
import { Box } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-evenly"}
        bgColor={"teal.300"}
        h='40px'
        alignItems={'center'}
      >
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Signup</NavLink>
      </Box>
    </>
  );
}

export default Navbar;
