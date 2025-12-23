
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

const initialUserState = {
  name: '',
  email: '',
  password: '',
  role: 'jobseeker',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState(initialUserState);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const { data } = await API.post('/admin/users', newUser);
      setUsers([data, ...users]);
      setShowAdd(false);
      setNewUser(initialUserState);
    } catch (error) {
      alert('Error adding user');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button className="btn-primary" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? 'Cancel' : 'Add User'}
        </button>
      </div>
      {showAdd && (
        <form className="bg-white rounded shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddUser}>
          <input className="input-field" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
          <input className="input-field" placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
          <input className="input-field" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
          <select className="input-field" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} required>
            <option value="jobseeker">Jobseeker</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-primary md:col-span-2" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add User'}</button>
        </form>
      )}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Joined</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b">
                <td className="py-2 px-4 font-semibold">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-2 px-4">
                  <button className="btn-secondary" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
