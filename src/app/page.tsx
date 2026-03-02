"use client";

import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    window.location.href = "/como-voto";
  }, []);
  return "redirigiendo...";
};

export default HomePage;
