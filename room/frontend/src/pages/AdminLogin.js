import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [mode, setMode] = useState('otp'); // 'otp' or 'password'
  const [step, setStep] = useState('email'); // email, otp, verify (used for otp flow)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/admin/request-otp', { email });
      toast.success(response.data.message);
      setStep('otp');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to request OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/admin/verify-otp', {
        email,
        otp,
        password
      });

      // Save token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Admin login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'OTP verification failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      // Verify role is admin
      if (response.data?.user?.role !== 'admin') {
        setError('Account is not an admin');
        toast.error('Account is not an admin');
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Admin login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Room Admin</h1>
        <p className="text-center text-gray-600 mb-8">Admin Portal</p>

        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => { setMode('otp'); setStep('email'); setError(''); }}
            className={`px-3 py-1 rounded-md mr-2 ${mode === 'otp' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Login with OTP
          </button>
          <button
            type="button"
            onClick={() => { setMode('password'); setError(''); }}
            className={`px-3 py-1 rounded-md ${mode === 'password' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Login with Password
          </button>
        </div>

        {mode === 'otp' && step === 'email' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Admin Login</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">OTP will be sent to admin email</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              {loading ? 'Sending OTP...' : 'Request OTP'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="text-purple-600 hover:underline font-medium">
                Member Login
              </Link>
            </p>

            <p className="text-center text-sm text-gray-600">
              Don't have an admin account?{' '}
              <Link to="/admin-signup" className="text-purple-600 hover:underline font-medium">
                Admin Signup
              </Link>
            </p>
          </form>
        )}

        {mode === 'otp' && step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
              <CheckCircle size={18} />
              <span className="text-sm">OTP sent to {email}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setPassword('');
                setError('');
              }}
              className="w-full text-purple-600 hover:text-purple-700 font-medium py-2 text-sm"
            >
              Back to Email
            </button>
          </form>
        )}

        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Admin Password Login</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Forgot OTP or want to use OTP login?{' '}
              <button type="button" onClick={() => { setMode('otp'); setStep('email'); setError(''); }} className="text-purple-600 hover:underline font-medium">Use OTP</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
