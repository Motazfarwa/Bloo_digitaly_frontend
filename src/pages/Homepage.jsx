import React, { useEffect, useState, useRef } from "react";
import "./Homepage.css";
import bloo1 from "../assets/bloo1.jpg";
import bloo2 from "../assets/bloo2.jpg";
import bloo3 from "../assets/bloo3.jpg";
import bloo4 from "../assets/bloo4.jpg";
import bloo5 from "../assets/bloo5.jpg";
import bloo6 from "../assets/bloo6.jpg";
import oumaima from "../assets/oumaima.png";
import logo from "../assets/logo.jpg";

const Homepage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    message: "",
    resume: null,
    cin: null,
    passport: null,
    poste: "",
    frenchLevel: "",
    englishLevel: "",
    interestedCountries: "",
    dateNaissance: "",
    acceptTerms: false,
    service: "",
  });
  const [dobError, setDobError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [scroll, setScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRefs = {
    Home: useRef(null),
    about: useRef(null),
    services: useRef(null),
    portfolio: useRef(null),
    contact: useRef(null)
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScroll(true);
      else setScroll(false);

      // Update active section based on scroll position
      const sections = Object.keys(sectionRefs);
      const current = sections.find(section => {
        const element = sectionRefs[section].current;
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          setActiveSection(targetId);
        }
      });
    });
  }, []);


  const scrollToService = (service) => {
  // Set the form's service type
  setFormData((prev) => ({
    ...prev,
    service,
    packType: "",
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    poste: "",
    interestedCountries: "",
    frenchLevel: "",
    englishLevel: "",
    dateNaissance: "",
    message: "",
    files: [],
  }));

  // Scroll to the contact form
  sectionRefs.contact.current.scrollIntoView({ behavior: "smooth" });
};

  // Handle input change
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({ ...formData, [name]: value });
    if (name === "phone") {
    if (!/^\d*$/.test(value)) { // only digits
      setPhoneError("Phone number must be numeric");
    } else if (value.length > 8) {
      setPhoneError("Phone number cannot exceed 8 digits");
    } else {
      setPhoneError(""); // valid
    }
  }

  if (name === "dateNaissance" && formData.service === "Volunteer Registration") {
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 30) {
      setDobError("Age must be under 30 for Volunteer Registration.");
    } else {
      setDobError("");
    }
  } else if (name === "dateNaissance") {
    setDobError("");
  }
};

const handleFileChange = (e) => {
  const newFiles = Array.from(e.target.files); // get new selected files
  setFormData((prev) => ({
    ...prev,
    files: [...(prev.files || []), ...newFiles], // merge with existing
  }));
  e.target.value = null; // reset input to allow selecting the same file again
};

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const data = new FormData();

  // Append all text fields
  for (const key in formData) {
    if (
      formData[key] !== null &&
      formData[key] !== "" &&
      key !== "files" // exclude files for now
    ) {
      data.append(key, formData[key]);
    }
  }

  // Append multiple files with the key "files"
  if (formData.files && formData.files.length > 0) {
    formData.files.forEach((file) => {
      data.append("files", file); // must match backend
    });
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/send-email`, {
     method: "POST",
     body: data,
     });
    const result = await res.json();
    alert(result.message);

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      message: "",
      resume: null,
      cin: null,
      passport: null,
      poste: "",
      frenchLevel: "",
      englishLevel: "",
      interestedCountries: "",
      dateNaissance: "",
      acceptTerms: false,
      files: [], // reset files
      service: "",
    });
  } catch (err) {
    console.error(err);
    alert("Failed to submit form. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div>
          {/* Enhanced Navbar */}
<nav
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    padding: "15px 8%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    background: "rgba(230, 230, 230, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    transition: "all 0.3s ease-in-out",
  }}
>
  <div
    className="navbar-container"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // logo left, links center
      width: "100%",
      maxWidth: "2000px",
    }}
  >
    {/* Logo */}
    <div
      className="logo-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flex: "1", // keep logo on left
      }}
    >
      <img
        src={logo}
        alt="Bloo Digitally"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      />
      <span
        style={{
          color: "#333",
          fontWeight: "600",
          fontSize: "1.2rem",
          letterSpacing: "0.5px",
        }}
      >
        Bloo Digitally
      </span>
    </div>

    {/* Centered Navigation Links */}
    <ul
      className={`nav-links ${menuOpen ? "nav-active" : ""}`}
      style={{
        display: "flex",
        listStyle: "none",
        gap: "35px",
        margin: 0,
        padding: 0,
        flex: "2", // give it more space
        justifyContent: "center", // center links
      }}
    >
      {["Home", "about", "services", "portfolio", "contact"].map((section) => (
        <li key={section}>
          <a
            href={`#${section}`}
            className={activeSection === section ? "active" : ""}
            style={{
              color: activeSection === section ? "#fdffffff" : "#f1f1f1ff",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              padding: "8px 14px",
              borderRadius: activeSection === section ? "20px" : "0",
              background:
                activeSection === section
                  ? "rgba(0, 188, 212, 0.15)"
                  : "transparent",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#000000ff")}
            onMouseLeave={(e) =>
              (e.target.style.color =
                activeSection === section ? "#11120eff" : "#333")
            }
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>


      <div className="homepage">


      {/* Enhanced Home Section */}
<section id="Home" className="home-section">
  <div className="home-content">
    <div className="text-content">
      <h1 className="title">
        Bloo Digitally
      </h1>
      <div className="highlight">DOLOR FITBOREN GOT</div>
      
      <h2 className="subtitle-heading">MEETING PEOPLE</h2>
      <p className="subtitle">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud
      </p>
  
    </div>

    <div className="image-content">
      <div class="animated-text-container">
     <div class="animated-text">Career Growth</div>
    
       </div>
      <div className="image-wrapper">
        <img src={oumaima} alt="HR Managers Meeting" className="main-image" />
      </div>
    </div>
  </div>

  <div className="curved-background"></div>
</section>

      {/* Enhanced About Section */}
      <section id="about" className="about" ref={sectionRefs.about}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Us</h2>
            <div className="section-divider"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-intro">
                We are a premier job search consulting service dedicated to helping you discover 
                the right career opportunities and achieve your professional goals.
              </p>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <h3>Targeted Approach</h3>
                  <p>Personalized strategies for your career growth</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h3>Quick Results</h3>
                  <p>Fast-track your job search with our expertise</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌐</div>
                  <h3>Global Network</h3>
                  <p>Access opportunities worldwide</p>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <img src={bloo1} alt="About Us" className="about-img" />
              <div className="experience-badge">
                <span className="years">1+</span>
                <span className="text">Job Search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="services" ref={sectionRefs.services}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Comprehensive solutions to boost your career and digital presence
            </p>
          </div>
          <div className="service-carousel">
            <div className="service-track">
              {[1, 2, 3, 1, 2, 3].map((item, index) => (
                <div className="card" key={index}>
                  <div className="card-icon">💼</div>
                  <img src={item === 1 ? bloo3 : item === 2 ? bloo4 : bloo5} alt={`Service ${item}`} />
                  <h3>{item === 1 ? "Digital Strategy" : item === 2 ? "Web Development" : "Marketing Solutions"}</h3>
                  <p>
                    {item === 1 ? "Comprehensive strategies to boost your online presence" :
                     item === 2 ? "Modern, responsive, and scalable websites" :
                     "Targeted campaigns to drive measurable results"}
                  </p>
                  <div className="card-overlay">
                    <button className="btn-outline">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Portfolio Section */}
      <section id="portfolio" className="portfolio" ref={sectionRefs.portfolio}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Portfolio</h2>
            <div className="section-divider"></div>
          </div>
          <div className="portfolio-grid">
            {[bloo3, bloo4, bloo5, bloo2].map((img, index) => (
              <div className="portfolio-item" key={index}>
                <img src={img} alt={`Portfolio ${index + 1}`} />
                <div className="portfolio-overlay">
                  <h3>Project {index + 1}</h3>
                  <p>Successfully delivered digital solution</p>
                  <button className="btn-outline">View Case Study</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Clients Say</h2>
            <div className="section-divider"></div>
          </div>
          <div className="testimonial-carousel">
            <div className="testimonial-track">
              {[1, 2, 3, 1, 2].map((item, index) => (
                <div className="testimonial-card" key={index}>
                  <div className="testimonial-content">
                    <div className="quote-icon">❝</div>
                    <p>
                      {item === 1 ? "Bloo Digitally transformed our online presence. Their team is amazing!" :
                       item === 2 ? "Professional and reliable digital solutions. Highly recommended!" :
                       "Our website traffic increased by 300% thanks to their strategy."}
                    </p>
                    <div className="client-info">
                      <div className="client-avatar">
                        {item === 1 ? "JD" : item === 2 ? "SL" : "AK"}
                      </div>
                      <div>
                        <h4>
                          {item === 1 ? "John Doe, CEO of TechCorp" :
                           item === 2 ? "Sarah Lee, Marketing Director" :
                           "Ahmed Khan, Founder of StartUpX"}
                        </h4>
                        <div className="rating">★★★★★</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
<section className="statistics">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Our Achievements</h2>
      <div className="section-divider"></div>
    </div>
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🚀</div>
        <h3 data-count="500">0+</h3>
        <p>Projects Completed</p>
      </div>
      <div className="stat-card">
        <div className="stat-icon">😊</div>
        <h3 data-count="120">0+</h3>
        <p>Happy Clients</p>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <h3 data-count="5">0+</h3>
        <p>Years of Experience</p>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <h3 data-count="10">0+</h3>
        <p>Awards Won</p>
      </div>
    </div>
  </div>
</section>

      {/* Enhanced Contact Section */}
{/* Enhanced Contact Section */}
<section id="contact" className="contact" ref={sectionRefs.contact}>
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Get In Touch</h2>
      <div className="section-divider"></div>
      <p className="section-subtitle">
        Ready to take the next step in your career? Contact us today!
      </p>
    </div>

    <form className="contact-form-modern" onSubmit={handleSubmit}>
      {/* Step 1: Select Service */}
      <div className="input-group">
        <select
          name="service"
          value={formData.service || ""}
          onChange={(e) => {
            handleChange(e);
            // Reset dependent fields
            setFormData({
              ...formData,
              service: e.target.value,
              packType: "",
              fullName: "",
              email: "",
              phone: "",
              linkedin: "",
              poste: "",
              interestedCountries: "",
              frenchLevel: "",
              englishLevel: "",
              dateNaissance: "",
              message: "",
              files: [],
            });
          }}
          required
        >
          <option value="">Select a Service</option>
          <option value="Job Search">Job Search</option>
          <option value="Study Abroad">Study Abroad</option>
          <option value="Volunteer Registration">Volunteer Registration</option>
        </select>
        <label>Select Service</label>
      </div>

      {/* Step 3: Show common fields */}
      {formData.service && (
        <>
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <label>Full Name</label>
            </div>
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email Address</label>
            </div>
          </div>

          <div className="form-row">
           <div className="input-group">
  <input
    type="text"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    required
    className={phoneError ? "input-error" : ""}
  />
  <label>Phone Number</label>
  {phoneError && <span className="error-text">{phoneError}</span>}
</div>

            <div className="input-group">
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
              <label>LinkedIn URL</label>
            </div>
          </div>

         {/* Job Search Specific Field */}
{formData.service === "Job Search" && (
  <div className="form-row">
    <div className="input-group">
      <input
        type="text"
        name="poste"
        value={formData.poste}
        onChange={handleChange}
        required
      />
      <label>Desired Position</label>
    </div>
  </div>
)}

       {/* Services with language and birth fields */}
{["Job Search", "Study Abroad", "Volunteer Registration"].includes(formData.service) && (
  <>
    {/* Common Fields for these services */}
    <div className="form-row">


      <div className="input-group">
        <input
          type="date"
          name="dateNaissance"
          value={formData.dateNaissance}
          onChange={handleChange}
          required={formData.service === "Volunteer Registration"}
          className={dobError ? "input-error" : ""}
        />
        <label>Date of Birth</label>
        {dobError && formData.service === "Volunteer Registration" && (
          <span className="error-text">{dobError}</span>
        )}
      </div>
    </div>

    <div className="form-row">
      <div className="input-group">
        <select
          name="interestedCountries"
          value={formData.interestedCountries}
          onChange={handleChange}
          required
        >
          <option value="">Select Preferred Region</option>
          <option value="Anglophone">Anglophone</option>
          <option value="Francophone">Francophone</option>
        </select>
        <label>Preferred Country</label>
      </div>

      <div className="input-group">
        <select
          name="frenchLevel"
          value={formData.frenchLevel}
          onChange={handleChange}
          required
        >
          <option value="">French Level</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
        <label>French Level</label>
      </div>

      <div className="input-group">
        <select
          name="englishLevel"
          value={formData.englishLevel}
          onChange={handleChange}
          required
        >
          <option value="">English Level</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
        <label>English Level</label>
      </div>
    </div>
  </>
)}


       
          {/* Message Field */}
          <div className="input-group">
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label>Your Message</label>
          </div>

          {/* File Uploads */}
          <div className="file-row">
            <div className="file-upload-group">
              <label className="file-label">
                <input type="file" multiple onChange={handleFileChange} />
                <span className="file-custom">📄 Upload your files here</span>
              </label>
            </div>
          </div>

          {/* Display selected files immediately */}
          {formData.files && formData.files.length > 0 && (
            <div className="uploaded-files-list">
              {formData.files.map((file, index) => (
                <div className="file-card" key={index}>
                  <span>{file.name}</span>
                  {(file.type.startsWith("image/") ||
                    file.type === "application/pdf") && (
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedFiles = formData.files.filter(
                        (_, i) => i !== index
                      );
                      setFormData({ ...formData, files: updatedFiles });
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Terms */}
          <label className="terms">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <span className="checkmark"></span>
            I accept the terms and conditions of job search consulting service and inscription
          </label>

          <button
            type="submit"
            className={`btn-primary ${isSubmitting ? "submitting" : ""}`}
            disabled={isSubmitting || !!dobError}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </>
      )}
    </form>
  </div>
</section>


      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-container">
                <img src={logo} alt="Bloo Digitally" className="logo-img" />
                <span className="logo-text">Bloo Digitally</span>
              </div>
              <p>Your trusted partner in digital consulting and career advancement</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <a href="#Home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#portfolio">Portfolio</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy;  Bloo Digitally. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </div>
 
  );
};

export default Homepage;
