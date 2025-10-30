import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidates`);
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, startIndex + candidatesPerPage);

  // -------------------------------
  // Inline styles
  // -------------------------------
  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#f3f4f6" },
    sidebar: {
      backgroundColor: "#111827",
      color: "white",
      width: sidebarOpen ? "250px" : "0",
      overflow: "hidden",
      transition: "width 0.3s ease",
    },
    sidebarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", fontWeight: "bold", fontSize: "1.2rem" },
    toggleSidebar: { background: "none", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" },
    sidebarLinks: { listStyle: "none", padding: 0, margin: "1rem 0" },
    sidebarLinkItem: { padding: "0.75rem 1rem", cursor: "pointer", transition: "background 0.3s ease" },
    main: { flex: 1, padding: "2rem" },
    title: { fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" },
    searchInput: { padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", marginBottom: "1rem", width: "100%", maxWidth: "400px", outline: "none" },
    tableContainer: { overflowX: "auto", background: "white", borderRadius: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "0.75rem 1rem", textAlign: "left", backgroundColor: "#f9fafb", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    td: { padding: "0.75rem 1rem", textAlign: "left" },
    btnView: { color: "#3b82f6", fontWeight: "600", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s ease-in-out" },
    btnDownload: { display: "inline-block", marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "white", borderRadius: "0.5rem", textDecoration: "none", fontWeight: "600" },
    btnClose: { marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#d1d5db", color: "#374151", border: "none", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" },
    pagination: { display: "flex", justifyContent: "center", marginTop: "1rem" },
    paginationBtn: { margin: "0 0.25rem", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "none", cursor: "pointer", backgroundColor: "#e5e7eb", color: "#374151", transition: "all 0.2s ease-in-out" },
    modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50 },
    modal: { background: "white", padding: "2rem", borderRadius: "1rem", width: "90%", maxWidth: "700px", maxHeight: "90%", overflowY: "auto", boxShadow: "0 15px 40px rgba(0,0,0,0.2)" },
    modalTitle: { fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" },
    fileItem: { backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem", marginBottom: "0.75rem" },
    fileActions: { display: "flex", gap: "0.5rem", marginTop: "0.75rem", alignItems: "center" },
  };

  return (
    <div style={styles.container}>
      {/* Main */}
      <div style={styles.main}>
        <h1 style={styles.title}>Candidate Applications</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>{["Full Name", "Email", "Phone", "Service", "Country", "Actions"].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {currentCandidates.length > 0 ? currentCandidates.map((c) => (
                <tr key={c._id}>
                  <td style={styles.td}>{c.fullName}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.phone || "-"}</td>
                  <td style={styles.td}>{c.poste || c.service || "-"}</td>
                  <td style={styles.td}>{c.interestedCountries?.length ? c.interestedCountries.join(", ") : "-"}</td>
                  <td style={styles.td}>
                    <button style={styles.btnView} onClick={() => setSelectedCandidate(c)}>View</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>No candidates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.paginationBtn} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                style={{ ...styles.paginationBtn, backgroundColor: currentPage === i + 1 ? "#3b82f6" : "#e5e7eb", color: currentPage === i + 1 ? "white" : "#374151" }}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button style={styles.paginationBtn} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
{selectedCandidate && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease-in-out",
    }}
    onClick={() => setSelectedCandidate(null)}
  >
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff, #f8fafc)",
        borderRadius: "20px",
        padding: "30px 40px",
        width: "90%",
        maxWidth: "700px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        position: "relative",
        color: "#1e293b",
        animation: "slideUp 0.4s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedCandidate(null)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          color: "#64748b",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
        onMouseLeave={(e) => (e.target.style.color = "#64748b")}
      >
        ✕
      </button>

      {/* Candidate Title */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#0f172a",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "10px",
        }}
      >
        {selectedCandidate.fullName}
      </h2>

      {/* Candidate Info */}
      <div style={{ lineHeight: "1.8", fontSize: "1rem", marginBottom: "20px" }}>
        <p><strong>Email:</strong> {selectedCandidate.email}</p>
        <p><strong>Phone:</strong> {selectedCandidate.phone || "N/A"}</p>
        <p><strong>Service:</strong> {selectedCandidate.poste || "N/A"}</p>
        <p>
          <strong>LinkedIn:</strong>{" "}
          {selectedCandidate.linkedin ? (
            <a
              href={selectedCandidate.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              {selectedCandidate.linkedin}
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p><strong>Message:</strong> {selectedCandidate.message || "No message provided."}</p>
      </div>

      {/* Uploaded Files */}
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: "600",
          marginBottom: "10px",
          color: "#1e3a8a",
        }}
      >
        Uploaded Files
      </h3>

      {selectedCandidate.files?.length ? (
        selectedCandidate.files.map((file, idx) => (
          <div
            key={idx}
            style={{
              background: "#f1f5f9",
              borderRadius: "12px",
              padding: "15px 20px",
              marginBottom: "10px",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>File:</strong> {file.filename}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Type:</strong> {file.contentType}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                style={{
                  background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  padding: "8px 16px",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "linear-gradient(90deg, #1d4ed8, #2563eb)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "linear-gradient(90deg, #2563eb, #3b82f6)")
                }
                onClick={() =>
                  setPreviewFile({
                    url: `${process.env.REACT_APP_API_URL}/uploads/${file.filename}`,
                    type: file.contentType,
                    name: file.filename,
                  })
                }
              >
                👁️ Preview
              </button>

              <a
                href={`${process.env.REACT_APP_API_URL.replace(/\/$/, "")}/${file.path}`}
                download={file.filename}
                style={{
                  background: "linear-gradient(90deg, #16a34a, #22c55e)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "linear-gradient(90deg, #15803d, #16a34a)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "linear-gradient(90deg, #16a34a, #22c55e)")
                }
              >
                ⬇ Download
              </a>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: "#475569" }}>No documents uploaded.</p>
      )}

      {/* Close Button */}
      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <button
          onClick={() => setSelectedCandidate(null)}
          style={{
            background: "#e2e8f0",
            color: "#1e293b",
            border: "none",
            borderRadius: "12px",
            padding: "10px 25px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#cbd5e1")}
          onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* File Preview Modal */}
       {previewFile && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(6px)",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease-in-out",
    }}
    onClick={() => setPreviewFile(null)}
  >
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
        borderRadius: "20px",
        width: "80%",
        maxWidth: "800px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        padding: "25px",
        position: "relative",
        animation: "slideUp 0.4s ease",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setPreviewFile(null)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          background: "transparent",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
          color: "#555",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
        onMouseLeave={(e) => (e.target.style.color = "#555")}
      >
        ✕
      </button>

      {/* Title */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#1e293b",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "10px",
        }}
      >
        {previewFile.name}
      </h2>

      {/* File Preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "12px",
          background: "#f8fafc",
          padding: "15px",
          height: "600px",
          overflow: "hidden",
        }}
      >
        {previewFile.type.includes("pdf") ? (
          <object
            data={previewFile.url}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
          >
            <p style={{ textAlign: "center", color: "#475569" }}>
              PDF preview not available.{" "}
              <a
                href={previewFile.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb", fontWeight: "500" }}
              >
                Download
              </a>
            </p>
          </object>
        ) : previewFile.type.includes("image") ? (
          <img
            src={previewFile.url}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "12px",
              objectFit: "contain",
            }}
          />
        ) : (
          <p
            style={{
              fontSize: "1rem",
              color: "#475569",
              textAlign: "center",
            }}
          >
            Preview not available for this file type.
          </p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
