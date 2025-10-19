import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaFileUpload } from "react-icons/fa";
import bloo5 from "../assets/bloo5.jpg";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-8">Candidate Information</h2>
          <p className="text-lg mb-6 text-gray-600">
            Interested in joining the team? Fill out your details below and
            submit your resume.
          </p>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="LinkedIn Profile"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center gap-3 cursor-pointer border border-gray-300 p-4 rounded-xl hover:border-blue-500 transition">
              <FaFileUpload />
              <span>Upload Resume (PDF)</span>
              <input type="file" accept=".pdf" className="hidden" />
            </label>
            <textarea
              placeholder="Your Message or Cover Letter"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 transition"
            >
              Submit <FaEnvelope />
            </button>
          </form>
        </motion.div>
        <motion.img
          src={bloo5}
          alt="Candidate"
          className="rounded-3xl shadow-2xl"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
};

export default Contact;
