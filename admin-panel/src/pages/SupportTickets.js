import React, { useState } from 'react';
import { FaHeadset, FaClock, FaCheckCircle, FaReply, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([
    { _id: 1, id: 'TKT-001', subject: 'Job posting not approved', user: 'John', priority: 'high', status: 'open', createdAt: new Date(Date.now() - 3600000) },
    { _id: 2, id: 'TKT-002', subject: 'Payment issue', user: 'Jane', priority: 'medium', status: 'in_progress', createdAt: new Date(Date.now() - 7200000) },
    { _id: 3, id: 'TKT-003', subject: 'Account verification', user: 'Mike', priority: 'low', status: 'resolved', createdAt: new Date(Date.now() - 86400000) }
  ]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');

  const closeTicket = (ticketId) => {
    toast.success('Ticket closed');
  };

  const sendReply = (ticketId) => {
    if (!reply.trim()) return;
    toast.success('Reply sent to user');
    setReply('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaHeadset className="text-blue-600" />
          Support Tickets
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Open', count: 5, color: 'red' },
            { label: 'In Progress', count: 3, color: 'yellow' },
            { label: 'Resolved', count: 12, color: 'green' }
          ].map(stat => (
            <div key={stat.label} className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}>
              <p className={`text-${stat.color}-800 font-semibold`}>{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Recent Tickets</h2>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                <FaPlus /> New
              </button>
            </div>
            <div className="divide-y">
              {tickets.map(ticket => (
                <button
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 hover:bg-gray-50 border-l-4 ${
                    ticket.status === 'open' ? 'border-red-500' :
                    ticket.status === 'in_progress' ? 'border-yellow-500' :
                    'border-green-500'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{ticket.id}</div>
                  <p className="text-sm text-gray-600">{ticket.subject}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>{ticket.priority}</span>
                    <span className="text-gray-500">{ticket.user}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Details */}
          {selectedTicket ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedTicket.id}</h3>
              <p className="text-gray-700 mb-4">{selectedTicket.subject}</p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">From: {selectedTicket.user}</p>
                <p className="text-xs text-gray-500">{selectedTicket.createdAt.toLocaleString()}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Reply</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  rows="4"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => sendReply(selectedTicket._id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
                >
                  <FaReply /> Send Reply
                </button>
                <button
                  onClick={() => closeTicket(selectedTicket._id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Close Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
