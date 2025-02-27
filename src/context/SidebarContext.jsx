// src/context/SidebarContext.jsx
import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const value = {
    isSidebarHovered,
    setIsSidebarHovered,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};