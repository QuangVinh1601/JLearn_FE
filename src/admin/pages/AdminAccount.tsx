import React, { useState } from "react";
// import { NavLink } from 'react-router-dom';

const AdminAccount = () => {
  const [accounts] = useState([
    {
      id: 1,
      name: "Jesse Thomas",
      email: "jesse@example.com",
      role: "User",
      status: "Active",
      points: 637,
      percentage: 98,
    },
    {
      id: 2,
      name: "Thilsal Mathiyazhagan",
      email: "thilsal@example.com",
      role: "User",
      status: "Active",
      points: 637,
      percentage: 98,
    },
    // Thêm dữ liệu mẫu khác
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>
      <div className="flex space-x-2 mb-4">
        <select className="border p-2 rounded">
          <option>Tất cả thời gian</option>
          <option>30 ngày gần nhất</option>
        </select>
        <select className="border p-2 rounded">
          <option>Tất cả</option>
          <option>Admin</option>
        </select>
        <select className="border p-2 rounded">
          <option>Tất cả</option>
          <option>Chủ đề</option>
        </select>
        <button className="bg-blue-500 text-white p-2 rounded">
          Thêm tài khoản
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Vai trò</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="p-2 border">{account.name}</td>
              <td className="p-2 border">{account.email}</td>
              <td className="p-2 border">{account.role}</td>
              <td className="p-2 border">{account.status}</td>
              <td className="p-2 border">
                <button className="bg-yellow-500 text-white p-1 rounded mr-2">
                  Chỉnh sửa
                </button>
                <button className="bg-red-500 text-white p-1 rounded">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAccount;
