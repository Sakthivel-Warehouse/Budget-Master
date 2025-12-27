import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { AlertCircle, Copy, Check } from 'lucide-react';

const PendingSignups = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchPendingSignups();
  }, []);

  const fetchPendingSignups = async () => {
    try {
      const response = await axiosInstance.get('/admin/pending-signups');
      setSignups(response.data.pendingSignups);
    } catch (error) {
      toast.error('Failed to fetch pending signups');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOTP = (otp, id) => {
    navigator.clipboard.writeText(otp);
    setCopiedId(id);
    toast.success('OTP copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (signups.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-yellow-600" size={24} />
        <h2 className="text-xl font-bold text-yellow-800">Pending Signups</h2>
      </div>

      <div className="space-y-3">
        {signups.map(signup => (
          <div key={signup._id} className="bg-white rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{signup.name}</p>
              <p className="text-sm text-gray-600">{signup.email} | {signup.phone}</p>
            </div>
            <button
              onClick={() => handleCopyOTP(signup.otp, signup._id)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
            >
              {copiedId === signup._id ? (
                <>
                  <Check size={18} />
                  <span className="text-sm">OTP: {signup.otp}</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span className="text-sm font-semibold">{signup.otp}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-yellow-700 mt-4 bg-yellow-100 p-3 rounded">
        Share these OTPs with the respective users to complete their signup process.
      </p>
    </div>
  );
};

export default PendingSignups;
