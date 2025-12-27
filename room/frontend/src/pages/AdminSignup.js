import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Mail, Phone, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSignup = () => {
  const [step, setStep] = useState('details'); // details, otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSentTo, setOtpSentTo] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/admin/request-otp-signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      toast.success(response.data.message);
      setOtpSentTo(response.data.otpSentTo);
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
      const response = await axiosInstance.post('/auth/admin/verify-otp-signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        otp: formData.otp,
        password: formData.password
      });

      // Save token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success('Admin account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'OTP verification failed';
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
        <p className="text-center text-gray-600 mb-8">Admin Registration Portal</p>

        {step === 'details' && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Create Admin Account</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
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
              {loading ? 'Sending OTP...' : 'Request OTP'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an admin account?{' '}
              <Link to="/admin-login" className="text-purple-600 hover:underline font-medium">
                Login here
              </Link>
            </p>

            <p className="text-center text-sm text-gray-600">
              Member?{' '}
              <Link to="/login" className="text-purple-600 hover:underline font-medium">
                Member Signup
              </Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
              <CheckCircle size={18} />
              <span className="text-sm">OTP sent to {otpSentTo}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6-Digit OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) => handleInputChange({ target: { name: 'otp', value: e.target.value.slice(0, 6) } })}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
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
              {loading ? 'Creating Account...' : 'Complete Admin Registration'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('details');
                setError('');
              }}
              className="w-full text-purple-600 hover:text-purple-700 font-medium py-2 text-sm"
            >
              Back to Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSignup;
