import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ExpenseList = ({ expenses, isShared, onRefresh }) => {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  const handleMarkAsPaid = async (expenseId, memberId) => {
    try {
      await axiosInstance.post('/expenses/mark-paid', {
        expenseId,
        memberId
      });
      toast.success('Marked as paid');
      onRefresh();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {expenses.map(expense => (
        <div key={expense._id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
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
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-gray-800">₹{expense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Posted by</p>
                  <p className="text-sm font-semibold text-gray-800">{expense.postedBy.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="text-sm font-semibold text-gray-800">{expense.splitWith.length}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setExpandedId(expandedId === expense._id ? null : expense._id)}
              className="ml-4 text-blue-600 hover:text-blue-700"
            >
              <Eye size={20} />
            </button>
          </div>

          {expense.invoiceImage && (
            <div className="mt-4">
              <img
                src={expense.invoiceImage}
                alt="Invoice"
                className="max-h-48 rounded cursor-pointer"
                onClick={() => window.open(expense.invoiceImage, '_blank')}
              />
            </div>
          )}

          {/* Expanded Details */}
          {expandedId === expense._id && (
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-800 mb-4">Split Details</h4>
              <div className="space-y-3">
                {expense.splitWith.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-600">₹{member.share.toFixed(2)}</p>
                    </div>
                    {member.isPaid ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={18} />
                        <span className="text-sm font-semibold">Paid</span>
                      </div>
                    ) : (
                      <>
                        {user?.role === 'admin' && !isShared ? (
                          <button
                            onClick={() => handleMarkAsPaid(expense._id, member.memberId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertCircle size={18} />
                            <span className="text-sm font-semibold">Pending</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
