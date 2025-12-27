import React from 'react';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Room Admin</h1>
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Signup Disabled</h2>
          <p className="text-sm text-yellow-700">Member self-signup has been disabled. Accounts are created by administrators only.</p>
          <p className="mt-4 text-sm">If you need an account, please contact your admin. If you are the admin, you can create member accounts from the <a href="/dashboard" className="text-blue-600 underline">Admin Dashboard</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
