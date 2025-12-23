
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

const initialJobState = {
  title: '',
  description: '',
  company: '',
  category: '',
  employmentType: '',
  workMode: '',
  location: { city: '' },
  salary: { min: '', max: '' },
  experience: { min: '', max: '' },
  skills: [],
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newJob, setNewJob] = useState(initialJobState);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/jobs');
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
    } catch (error) {
      alert('Error deleting job');
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      // Convert skills to array
      const jobData = { ...newJob, skills: newJob.skills.split(',').map(s => s.trim()) };
      const { data } = await API.post('/admin/jobs', jobData);
      setJobs([data, ...jobs]);
      setShowAdd(false);
      setNewJob(initialJobState);
    } catch (error) {
      alert('Error adding job');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Jobs</h1>
        <button className="btn-primary" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? 'Cancel' : 'Add Job'}
        </button>
      </div>
      {showAdd && (
        <form className="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddJob}>
          <input className="input-field" placeholder="Title" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} required />
          <input className="input-field" placeholder="Company (ID)" value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} required />
          <input className="input-field" placeholder="Category" value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })} required />
          <input className="input-field" placeholder="Employment Type" value={newJob.employmentType} onChange={e => setNewJob({ ...newJob, employmentType: e.target.value })} required />
          <input className="input-field" placeholder="Work Mode" value={newJob.workMode} onChange={e => setNewJob({ ...newJob, workMode: e.target.value })} required />
          <input className="input-field" placeholder="City" value={newJob.location.city} onChange={e => setNewJob({ ...newJob, location: { ...newJob.location, city: e.target.value } })} required />
          <input className="input-field" placeholder="Min Salary" type="number" value={newJob.salary.min} onChange={e => setNewJob({ ...newJob, salary: { ...newJob.salary, min: e.target.value } })} required />
          <input className="input-field" placeholder="Max Salary" type="number" value={newJob.salary.max} onChange={e => setNewJob({ ...newJob, salary: { ...newJob.salary, max: e.target.value } })} required />
          <input className="input-field" placeholder="Min Exp" type="number" value={newJob.experience.min} onChange={e => setNewJob({ ...newJob, experience: { ...newJob.experience, min: e.target.value } })} required />
          <input className="input-field" placeholder="Max Exp" type="number" value={newJob.experience.max} onChange={e => setNewJob({ ...newJob, experience: { ...newJob.experience, max: e.target.value } })} required />
          <input className="input-field md:col-span-2" placeholder="Skills (comma separated)" value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} required />
          <textarea className="input-field md:col-span-2" placeholder="Description" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} required />
          <button className="btn-primary md:col-span-2" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Job'}</button>
        </form>
      )}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Company</th>
              <th className="py-2 px-4 text-left">Posted</th>
              <th className="py-2 px-4 text-left">Applications</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id} className="border-b">
                <td className="py-2 px-4 font-semibold">{job.title}</td>
                <td className="py-2 px-4">{job.company?.name || job.company || 'Unknown'}</td>
                <td className="py-2 px-4">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-2 px-4">{job.applicationsCount || 0}</td>
                <td className="py-2 px-4">
                  <button className="btn-secondary" onClick={() => handleDelete(job._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;
