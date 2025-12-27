import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import { Upload, Loader } from 'lucide-react';

const ExpenseForm = ({ members, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    description: '',
    invoiceImage: null,
    splitWith: []
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          invoiceImage: reader.result
        }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberToggle = (member) => {
    setFormData(prev => {
      const isSelected = prev.splitWith.some(m => m.memberId === member._id);
      if (isSelected) {
        return {
          ...prev,
          splitWith: prev.splitWith.filter(m => m.memberId !== member._id)
        };
      } else {
        return {
          ...prev,
          splitWith: [...prev.splitWith, { memberId: member._id, name: member.name }]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.productName || !formData.amount || !formData.invoiceImage || formData.splitWith.length === 0) {
        toast.error('Please fill all fields and select members');
        setLoading(false);
        return;
      }

      await axiosInstance.post('/expenses/post', {
        productName: formData.productName,
        amount: parseFloat(formData.amount),
        description: formData.description,
        invoiceImage: formData.invoiceImage,
        splitWith: formData.splitWith
      });

      toast.success('Expense posted successfully');
      setFormData({
        productName: '',
        amount: '',
        description: '',
        invoiceImage: null,
        splitWith: []
      });
      setPreview(null);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Post New Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="e.g., Groceries"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add any notes about this expense"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Invoice Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                <label className="block">
                  <span className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition">
                    <Upload size={18} />
                    Change Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block text-center">
                <div className="cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-600">Click to upload invoice image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Select Members */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Split With (Select Members)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {members.map(member => (
              <label key={member._id} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={formData.splitWith.some(m => m.memberId === member._id)}
                  onChange={() => handleMemberToggle(member)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">{member.name}</span>
              </label>
            ))}
          </div>
          {formData.splitWith.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              {formData.amount && formData.splitWith.length > 0
                ? `₹${(parseFloat(formData.amount) / formData.splitWith.length).toFixed(2)} per person`
                : ''}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={18} />
              Posting...
            </>
          ) : (
            'Post Expense'
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
