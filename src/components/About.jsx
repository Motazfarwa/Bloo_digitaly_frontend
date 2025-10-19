import React from "react";
import { motion } from "framer-motion";
import bloo1 from "../assets/bloo1.jpg";

const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          src={bloo1}
          alt="About"
          className="rounded-3xl shadow-2xl"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are a consulting center committed to crafting digital strategies,
            driving efficiency, and fueling innovation. Our team empowers
            businesses to navigate the future with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
