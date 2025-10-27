import React, { useEffect, useState } from "react";
import { Users, Search, FileText, X, Download, Mail, Phone, Linkedin, Calendar, Globe, MessageSquare, CreditCard, FileCheck } from "lucide-react";
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    withResume: 0,
    withPassport: 0,
    acceptedTerms: 0
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/candidates?page=${page}&limit=${limit}`
      );
      const data = await res.json();
      const candidates = data.candidates || data;
      setUsers(candidates);
      setTotal(data.total || candidates.length);
      
      // Calculate stats
      setStats({
        total: candidates.length,
        withResume: candidates.filter(u => u.resume).length,
        withPassport: candidates.filter(u => u.passport).length,
        acceptedTerms: candidates.filter(u => u.acceptTerms).length
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const downloadFile = (file) => {
    const blob = new Blob([new Uint8Array(file.data.data)], {
      type: file.contentType,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.filename;
    link.click();
  };

  const previewFileHandler = (file, type) => {
    if (!file) return;
    
    const blob = new Blob([new Uint8Array(file.data.data)], {
      type: file.contentType,
    });
    const url = URL.createObjectURL(blob);
    setPreviewFile({ url, type: file.contentType, name: file.filename, fileType: type });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage candidate applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {filteredUsers.length} Candidates
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-8 py-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} label="Total Candidates" value={stats.total} color="bg-gradient-to-br from-blue-500 to-blue-600" />
          <StatCard icon={FileText} label="With Resume" value={stats.withResume} color="bg-gradient-to-br from-green-500 to-green-600" />
          <StatCard icon={CreditCard} label="With Passport" value={stats.withPassport} color="bg-gradient-to-br from-purple-500 to-purple-600" />
          <StatCard icon={FileCheck} label="Accepted Terms" value={stats.acceptedTerms} color="bg-gradient-to-br from-orange-500 to-orange-600" />
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2" />
                          {user.phone || "N/A"}
                        </div>
                        {user.linkedin && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Linkedin className="w-3 h-3 mr-2" />
                            <span className="truncate max-w-[150px]">LinkedIn</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.poste || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        {user.resume && (
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center" title="Resume">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        {user.cin && (
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center" title="CIN">
                            <CreditCard className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        {user.passport && (
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center" title="Passport">
                            <CreditCard className="w-4 h-4 text-orange-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
              </p>
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detailed View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
                  <p className="text-blue-100 text-sm">{selectedUser.poste || "Position not specified"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.phone || "N/A"}</p>
                      </div>
                    </div>
                    {selectedUser.linkedin && (
                      <div className="flex items-start">
                        <Linkedin className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">LinkedIn</p>
                          <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline break-all">
                            {selectedUser.linkedin}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedUser.dateNaissance ? new Date(selectedUser.dateNaissance).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Languages</p>
                        <p className="text-sm font-medium text-gray-900">
                          French: {selectedUser.languages?.french || "N/A"}, English: {selectedUser.languages?.english || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Interested Countries</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedUser.interestedCountries?.join(", ") || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedUser.message && (
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    Message
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedUser.message}</p>
                </div>
              )}

              {/* Documents Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  Documents & Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedUser.resume && (
                    <div className="bg-white rounded-lg p-4 border-2 border-green-200 hover:border-green-400 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">Resume</p>
                            <p className="text-xs text-gray-500">{selectedUser.resume.filename}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewFileHandler(selectedUser.resume, 'resume')}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => downloadFile(selectedUser.resume)}
                          className="px-3 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedUser.cin && (
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">CIN</p>
                            <p className="text-xs text-gray-500">{selectedUser.cin.filename}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewFileHandler(selectedUser.cin, 'cin')}
                          className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-xs font-semibold hover:bg-purple-600 transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => downloadFile(selectedUser.cin)}
                          className="px-3 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedUser.passport && (
                    <div className="bg-white rounded-lg p-4 border-2 border-orange-200 hover:border-orange-400 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">Passport</p>
                            <p className="text-xs text-gray-500">{selectedUser.passport.filename}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => previewFileHandler(selectedUser.passport, 'passport')}
                          className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => downloadFile(selectedUser.passport)}
                          className="px-3 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="mt-6 flex items-center justify-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-lg ${selectedUser.acceptTerms ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">
                    Terms {selectedUser.acceptTerms ? 'Accepted' : 'Not Accepted'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5" />
                <div>
                  <h3 className="font-bold">{previewFile.name}</h3>
                  <p className="text-xs text-gray-300">{previewFile.fileType.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {previewFile.type.includes('pdf') ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full min-h-[600px] rounded-lg"
                  title="PDF Preview"
                />
              ) : previewFile.type.includes('image') ? (
                <img
                  src={previewFile.url}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Preview not available for this file type</p>
                    <p className="text-sm text-gray-500 mt-2">Please download the file to view it</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
