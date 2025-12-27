import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              R
            </div>
            <h1 className="text-xl font-bold text-gray-800">Room Admin</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User size={20} />
              <span>{user?.name}</span>
              {user?.role === 'admin' && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 border-t pt-4">
            <div className="text-gray-700">
              <p className="font-semibold">{user?.name}</p>
              {user?.role === 'admin' && (
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold mt-2">
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
