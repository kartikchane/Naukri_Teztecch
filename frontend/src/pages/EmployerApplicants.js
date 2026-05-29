
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { getFileUrl } from '../utils/fileUtils';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaFileAlt } from 'react-icons/fa';

const EmployerApplicants = ({ jobId, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/applications/job/${jobId}`);
      setApplicants(data);
    } catch (err) {
      setError('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative my-8">
        <button className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Job Applicants</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No applicants yet.</div>
        ) : (
          <div className="space-y-6">
            {applicants.map(app => (
              <div key={app._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Applicant Header */}
                <div
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100"
                  onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {app.applicant?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.applicant?.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>📧 {app.applicant?.email}</span>
                            {app.applicant?.phone && <span>📞 {app.applicant?.phone}</span>}
                          </div>
                        </div>
                      </div>
                      {app.applicant?.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 ml-15">
                          <FaMapMarkerAlt className="text-red-500" />
                          {app.applicant.location.city}, {app.applicant.location.state}, {app.applicant.location.country}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === app._id && (
                  <div className="border-t border-gray-200 p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Bio & Skills */}
                      <div>
                        {app.applicant?.bio && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                            <p className="text-gray-700 text-sm">{app.applicant.bio}</p>
                          </div>
                        )}

                        {app.applicant?.skills && app.applicant.skills.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {app.applicant.skills.map((skill, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cover Letter */}
                      <div>
                        {app.coverLetter && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h4>
                            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded border border-gray-200 max-h-36 overflow-y-auto">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    {app.applicant?.experience && app.applicant.experience.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaBriefcase className="text-blue-600" />
                          Work Experience
                        </h4>
                        <div className="space-y-3 ml-4 border-l-2 border-gray-300">
                          {app.applicant.experience.map((exp, idx) => (
                            <div key={idx} className="pl-4">
                              <h5 className="font-semibold text-gray-900">{exp.position}</h5>
                              <p className="text-sm text-gray-600">{exp.company}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}
                              </p>
                              {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {app.applicant?.education && app.applicant.education.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaGraduationCap className="text-green-600" />
                          Education
                        </h4>
                        <div className="space-y-3 ml-4 border-l-2 border-gray-300">
                          {app.applicant.education.map((edu, idx) => (
                            <div key={idx} className="pl-4">
                              <h5 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h5>
                              <p className="text-sm text-gray-600">{edu.school}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(edu.from).toLocaleDateString()} - {edu.to ? new Date(edu.to).toLocaleDateString() : 'Present'}
                              </p>
                              {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resume & Documents */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaFileAlt className="text-purple-600" />
                        Documents
                      </h4>
                      {app.resume ? (
                        <div className="flex gap-2">
                          <a
                            href={getFileUrl(app.resume)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            <FaFileAlt /> View Resume
                          </a>
                          <a
                            href={getFileUrl(app.resume)}
                            download
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            ⬇️ Download Resume
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm italic">No resume uploaded</span>
                      )}
                    </div>

                    {/* Status Update Form */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h4>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setUpdatingId(app._id);
                          const form = e.target;
                          const status = form.status.value;
                          const notes = form.notes.value;
                          try {
                            await API.put(`/applications/${app._id}/status`, { status, notes });
                            toast.success('Status updated successfully!');
                            fetchApplicants();
                            setExpandedId(null);
                          } catch (err) {
                            toast.error('Failed to update status');
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select name="status" defaultValue={app.status} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="Applied">Applied</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notes/Reply (Optional)</label>
                          <textarea
                            name="notes"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add any notes or reply to the applicant..."
                            rows="3"
                            defaultValue={app.notes || ''}
                          />
                        </div>
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold" type="submit" disabled={updatingId === app._id}>
                          {updatingId === app._id ? 'Updating...' : 'Update Status'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApplicants;

