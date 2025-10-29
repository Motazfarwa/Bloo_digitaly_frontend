import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  // Fetch candidates from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/candidates`
        );
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  // Filter by search term
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + candidatesPerPage
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <span>Admin Panel</span>
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>
        <ul className="sidebar-links">
          <li>Dashboard</li>
          <li>Candidates</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Candidate Applications</h1>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCandidates.length > 0 ? (
                currentCandidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td>{candidate.fullName}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone || "-"}</td>
                    <td>{candidate.poste || candidate.service || "-"}</td>
                    <td>
                      {candidate.interestedCountries?.length > 0
                        ? candidate.interestedCountries.join(", ")
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "page-active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCandidate(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCandidate.fullName}</h2>
            <p>
              <strong>Email:</strong> {selectedCandidate.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCandidate.phone || "N/A"}
            </p>
            <p>
              <strong>Service:</strong>{" "}
              {selectedCandidate.poste || selectedCandidate.service || "N/A"}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              {selectedCandidate.linkedin ? (
                <a
                  href={selectedCandidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedCandidate.linkedin}
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {selectedCandidate.message || "No message provided."}
            </p>

            <h3>Uploaded Files</h3>
            {selectedCandidate.files && selectedCandidate.files.length > 0 ? (
              <div className="file-list">
                {selectedCandidate.files.map((file, index) => (
                  <div key={index} className="file-item">
                    <p>
                      <strong>File:</strong> {file.filename}
                    </p>
                    <p>
                      <strong>Type:</strong> {file.contentType}
                    </p>
                    <div className="file-actions">
                      <button
                        className="btn-view"
                        onClick={() =>
                          setPreviewFile({
                            url: `${process.env.REACT_APP_API_URL}/${file.path}`,
                            type: file.contentType,
                            name: file.filename,
                          })
                        }
                      >
                        Preview
                      </button>
                      <a
                        href={`${process.env.REACT_APP_API_URL}/${file.path}`}
                        download={file.filename}
                        className="btn-download"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No documents uploaded.</p>
            )}

            <button
              onClick={() => setSelectedCandidate(null)}
              className="btn-close"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="modal-backdrop" onClick={() => setPreviewFile(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{previewFile.name}</h2>
            {previewFile.type.includes("pdf") ? (
              <iframe
                src={previewFile.url}
                title="PDF Preview"
                style={{ width: "100%", height: "600px", borderRadius: "8px" }}
              />
            ) : previewFile.type.includes("image") ? (
              <img
                src={previewFile.url}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />
            ) : (
              <p>Preview not available for this file type.</p>
            )}
            <button onClick={() => setPreviewFile(null)} className="btn-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
