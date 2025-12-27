import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Plus, DollarSign, TrendingUp, Eye, AlertCircle } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';

const MemberDashboard = () => {
  const [expenses, setExpenses] = useState({ postedExpenses: [], sharedExpenses: [] });
  const [members, setMembers] = useState([]);
  const [myTotalToPay, setMyTotalToPay] = useState({ totalToPay: 0, breakdown: [] });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesRes, membersRes, totalsRes] = await Promise.all([
        axiosInstance.get('/expenses/user'),
        axiosInstance.get('/members'),
        axiosInstance.get('/expenses/totals/members')
      ]);
      setExpenses(expensesRes.data);
      setMembers(membersRes.data.members);
      setMyTotalToPay(totalsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpensePosted = () => {
    setShowExpenseForm(false);
    fetchData();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <ExpenseSummary />

      {/* My Total to Pay Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Shares to Pay</h2>
        <div className="mb-6">
          <p className="text-lg font-semibold">
            Total Outstanding: <span className={myTotalToPay.totalToPay > 0 ? 'text-red-600' : 'text-green-600'}>
              ${myTotalToPay.totalToPay.toFixed(2)}
            </span>
          </p>
        </div>

        {myTotalToPay.breakdown.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Posted By</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Your Share</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {myTotalToPay.breakdown.map(share => (
                  <tr key={share.expenseId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{share.productName}</td>
                    <td className="px-4 py-3 text-gray-600">{share.postedBy}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-red-600">
                        ${share.userShare.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(share.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <AlertCircle className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-600">No shares to pay! You're all settled up.</p>
          </div>
        )}
      </div>

      {/* Post Expense Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          <Plus size={20} />
          Post New Expense
        </button>
      </div>

      {/* Expense Form */}
      {showExpenseForm && (
        <ExpenseForm members={members} onSuccess={handleExpensePosted} />
      )}

      {/* Posted Expenses */}
      {expenses.postedExpenses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Expenses You Posted</h2>
          <ExpenseList expenses={expenses.postedExpenses} onRefresh={fetchData} />
        </div>
      )}

      {/* Shared Expenses */}
      {expenses.sharedExpenses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Expenses Shared With You</h2>
          <ExpenseList expenses={expenses.sharedExpenses} isShared={true} onRefresh={fetchData} />
        </div>
      )}

      {expenses.postedExpenses.length === 0 && expenses.sharedExpenses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No expenses yet. Post one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
