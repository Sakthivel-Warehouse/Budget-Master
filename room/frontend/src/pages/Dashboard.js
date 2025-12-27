import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import MemberDashboard from '../components/MemberDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { Loader } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [componentLoading, setComponentLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user) {
      setComponentLoading(false);
    }
  }, [user, loading, navigate]);

  if (loading || componentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {user?.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
