import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

function Layout({ children }) {
  return (
    <>
      {/* Neural Network Background - Full Screen */}
      <NeuralNetworkBackground />
      
      {/* Layout Structure untuk SPA */}
      <div className="d-flex flex-column min-vh-100 position-relative">
        <Navbar />
        <main className="flex-grow-1 container mt-4">
          {children}
        </main>
         <Footer />
      </div>
    </>
  );
}

export default Layout;
