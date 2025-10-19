import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center">
      <p>&copy; {new Date().getFullYear()} Bloo Degitally. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
