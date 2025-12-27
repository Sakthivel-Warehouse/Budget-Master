import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Users, Plus, AlertCircle, Eye } from 'lucide-react';
import PendingSignups from './PendingSignups';
import MemberList from './MemberList';
import AdminInvoices from './AdminInvoices';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalMembers: 0, pendingSignups: 0 });
  const [members, setMembers] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, membersRes, expensesRes] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/members'),
        axiosInstance.get('/expenses')
      ]);
      setStats(statsRes.data.stats);
      setMembers(membersRes.data.members);
      setAllExpenses(expensesRes.data.expenses || []);
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/members/add', newMember);
      toast.success('Member added successfully');
      setNewMember({ name: '', email: '', phone: '' });
      setShowAddMember(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axiosInstance.delete(`/members/${memberId}`);
        toast.success('Member removed successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Members</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalMembers}</p>
            </div>
            <Users className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Signups</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingSignups}</p>
            </div>
            <AlertCircle className="text-orange-600" size={40} />
          </div>
        </div>
      </div>

      {/* Pending Signups */}
      {stats.pendingSignups > 0 && <PendingSignups />}

      {/* Add Member Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Members</h2>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Add Member
              </button>
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Members List */}
        <MemberList members={members} onRemove={handleRemoveMember} />
      </div>

      {/* All Posts by Members */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Posts by Members</h2>
        
        {allExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allExpenses.map(expense => (
              <div key={expense._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{expense.productName}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        expense.status === 'settled'
                          ? 'bg-green-100 text-green-800'
                          : expense.status === 'partially_paid'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {expense.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{expense.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Posted By</p>
                        <p className="font-semibold text-gray-800">{expense.postedBy?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-800">₹{expense.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Members</p>
                        <p className="font-semibold text-gray-800">{expense.splitWith.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800">{new Date(expense.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedExpense(expandedExpense === expense._id ? null : expense._id)}
                    className="ml-4 p-2 hover:bg-gray-100 rounded transition"
                  >
                    <Eye size={20} className="text-blue-600" />
                  </button>
                </div>

                {/* Expanded Split Details */}
                {expandedExpense === expense._id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">Split Details</h4>
                    <div className="space-y-2">
                      {expense.splitWith.map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-medium text-gray-800">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-gray-800">₹{member.share.toFixed(2)}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              member.isPaid 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {member.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices & Reminders */}
      <AdminInvoices />
    </div>
  );
};

export default AdminDashboard;
