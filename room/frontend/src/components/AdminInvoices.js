import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/invoices');
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSendReminder = async (memberId) => {
    try {
      setSending(memberId);
      const res = await axiosInstance.post('/admin/reminder', { memberId });
      toast.success(res.data.message || 'Reminder sent');
      setSending(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send reminder');
      setSending(null);
    }
  };

  const handleTogglePaid = async (expenseId, memberId, currentStatus) => {
    try {
      setUpdating(`${expenseId}-${memberId}`);
      await axiosInstance.post('/expenses/mark-paid', {
        expenseId,
        memberId
      });
      toast.success(currentStatus ? 'Marked as unpaid' : 'Marked as paid');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update payment status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading invoices...</div>;

  // Build flat view: for each invoice, for each splitWith entry render a row
  const rows = [];
  invoices.forEach(inv => {
    inv.splitWith.forEach(sw => {
      rows.push({
        invoiceId: inv.id,
        date: inv.createdAt,
        productName: inv.productName,
        postedBy: inv.postedBy?.name || 'Unknown',
        memberId: sw.memberId?._id || sw.memberId,
        memberName: sw.name,
        email: sw.email,
        share: sw.share,
        isPaid: sw.isPaid
      });
    });
  });

  // Group pending totals by member for quick reminder button
  const pendingByMember = {};
  rows.forEach(r => {
    if (!r.isPaid) {
      const id = r.memberId;
      if (!pendingByMember[id]) pendingByMember[id] = { memberId: id, memberName: r.memberName, email: r.email, total: 0 };
      pendingByMember[id].total += (r.share || 0);
    }
  });

  return (
    <div className="space-y-8">
      {/* Invoices Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Invoices & Member Shares</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Product</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Posted By</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Member</th>
                <th className="py-3 px-4 text-right font-semibold text-gray-700">Share (₹)</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Paid</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">No invoices yet</td>
                </tr>
              ) : (
                rows.map((r, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{r.productName}</td>
                    <td className="py-3 px-4">{r.postedBy}</td>
                    <td className="py-3 px-4">{r.memberName}</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{Number(r.share).toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${r.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.isPaid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePaid(r.invoiceId, r.memberId, r.isPaid)}
                        disabled={updating === `${r.invoiceId}-${r.memberId}`}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      >
                        {updating === `${r.invoiceId}-${r.memberId}` ? 'Updating...' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Dues & Reminders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Pending Dues & Send Reminders</h3>
        
        {Object.values(pendingByMember).length === 0 ? (
          <p className="text-center text-gray-500 py-8">No pending dues.</p>
        ) : (
          <div className="space-y-3">
            {Object.values(pendingByMember).map(m => (
              <div key={m.memberId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-semibold text-gray-800">{m.memberName}</div>
                  <div className="text-sm text-gray-600">{m.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-red-600">₹{m.total.toFixed(2)}</div>
                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    onClick={() => handleSendReminder(m.memberId)}
                    disabled={sending === m.memberId}
                  >
                    <Mail size={18} />
                    {sending === m.memberId ? 'Sending...' : 'Send Reminder'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;
