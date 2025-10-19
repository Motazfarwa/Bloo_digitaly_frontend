import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import bloo6 from "../assets/bloo6.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bloo6})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/70"></div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center text-white px-6"
      >
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
          Empowering <span className="text-blue-300">Digital Growth</span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Bloo Degitally helps businesses transform with innovative strategies,
          smart technologies, and powerful digital experiences.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-lg rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Let’s Talk <FaArrowRight />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
