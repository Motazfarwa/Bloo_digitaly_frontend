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
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span>Admin Panel</span>
          <button style={styles.toggleSidebar} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        </div>
        <ul style={styles.sidebarLinks}>
          {["Dashboard", "Candidates", "Settings"].map((link) => (
            <li
              key={link}
              style={styles.sidebarLinkItem}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {link}
            </li>
          ))}
        </ul>
      </div>

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
        <div style={styles.modalBackdrop} onClick={() => setSelectedCandidate(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{selectedCandidate.fullName}</h2>
            <p><strong>Email:</strong> {selectedCandidate.email}</p>
            <p><strong>Phone:</strong> {selectedCandidate.phone || "N/A"}</p>
            <p><strong>Service:</strong> {selectedCandidate.poste || "N/A"}</p>
            <p><strong>LinkedIn:</strong> {selectedCandidate.linkedin ? <a href={selectedCandidate.linkedin} target="_blank" rel="noreferrer">{selectedCandidate.linkedin}</a> : "N/A"}</p>
            <p><strong>Message:</strong> {selectedCandidate.message || "No message provided."}</p>

            <h3>Uploaded Files</h3>
            {selectedCandidate.files?.length ? selectedCandidate.files.map((file, idx) => (
              <div key={idx} style={styles.fileItem}>
                <p><strong>File:</strong> {file.filename}</p>
                <p><strong>Type:</strong> {file.contentType}</p>
                <div style={styles.fileActions}>
                  <button style={styles.btnView}  onClick={() =>
                 setPreviewFile({
                  url: `${process.env.REACT_APP_API_URL}/uploads/${file.filename}`,
                  type: file.contentType,
                 name: file.filename
                  })
               }>Preview</button>
                  <a href={`${process.env.REACT_APP_API_URL.replace(/\/$/, "")}/${file.path}`} download={file.filename} style={styles.btnDownload}>Download</a>
                </div>
              </div>
            )) : <p>No documents uploaded.</p>}
            <button style={styles.btnClose} onClick={() => setSelectedCandidate(null)}>Close</button>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div style={styles.modalBackdrop} onClick={() => setPreviewFile(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{previewFile.name}</h2>
            {previewFile.type.includes("pdf") ? (
              <object data={previewFile.url} type="application/pdf" width="100%" height="600px">
                <p>
                  PDF preview not available.{" "}
                  <a href={previewFile.url} target="_blank" rel="noreferrer">Download</a>
                </p>
              </object>
            ) : previewFile.type.includes("image") ? (
              <img src={previewFile.url} alt="Preview" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            ) : (
              <p>Preview not available for this file type.</p>
            )}
            <button style={styles.btnClose} onClick={() => setPreviewFile(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
