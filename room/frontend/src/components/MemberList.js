import React from 'react';
import { User, Mail, Phone, Trash2 } from 'lucide-react';

const MemberList = ({ members, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {members.map(member => (
        <div key={member._id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
            </div>
            <button
              onClick={() => onRemove(member._id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
              title="Remove member"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>{member.phone}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
