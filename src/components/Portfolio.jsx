import React from "react";
import { motion } from "framer-motion";
import bloo4 from "../assets/bloo4.jpg";
import bloo1 from "../assets/bloo1.jpg";
import bloo3 from "../assets/bloo3.jpg";
import bloo2 from "../assets/bloo2.jpg";

const images = [bloo4, bloo1, bloo3, bloo2];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-16">Our Portfolio</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <img src={img} alt="Portfolio Project" className="w-full h-72 object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
