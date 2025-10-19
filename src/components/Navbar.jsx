import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-600">Bloo Degitally</h1>
        <ul className="hidden md:flex gap-8 font-medium">
          <li><a href="#home" className="hover:text-blue-600">Home</a></li>
          <li><a href="#about" className="hover:text-blue-600">About</a></li>
          <li><a href="#services" className="hover:text-blue-600">Services</a></li>
          <li><a href="#portfolio" className="hover:text-blue-600">Portfolio</a></li>
          <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
