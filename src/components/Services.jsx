import React from "react";
import { motion } from "framer-motion";
import { FaLaptopCode, FaChartLine, FaCogs } from "react-icons/fa";
import bloo2 from "../assets/bloo2.jpg";
import bloo3 from "../assets/bloo3.jpg";
import bloo5 from "../assets/bloo5.jpg";

const services = [
  { icon: <FaChartLine />, title: "Digital Strategy", img: bloo2 },
  { icon: <FaLaptopCode />, title: "Technology Consulting", img: bloo3 },
  { icon: <FaCogs />, title: "Process Optimization", img: bloo5 },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-16">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl text-blue-600 mb-6">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <p className="text-gray-600">
                Tailored solutions that ensure growth and long-term impact.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
