import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { TrendingUp, TrendingDown, Loader } from 'lucide-react';

const ExpenseSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axiosInstance.get('/expenses/summary/user');
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch summary', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-blue-600">₹{summary.totalSpent.toFixed(2)}</p>
          </div>
          <TrendingUp className="text-blue-600" size={40} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-2">Total Owed</p>
            <p className="text-3xl font-bold text-red-600">₹{summary.totalOwed.toFixed(2)}</p>
          </div>
          <TrendingDown className="text-red-600" size={40} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
