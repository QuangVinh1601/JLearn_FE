import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  roleUser: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    userName: "admin01",
    email: "admin01@example.com",
    fullName: "Nguyễn Văn Admin",
    roleUser: "Admin",
  },
  {
    id: "2",
    userName: "user02",
    email: "user02@example.com",
    fullName: "Trần Thị User",
    roleUser: "User",
  },
  {
    id: "3",
    userName: "mod03",
    email: "mod03@example.com",
    fullName: "Lê Văn Moderator",
    roleUser: "Moderator",
  },
  // Thêm dữ liệu mẫu để test phân trang
  {
    id: "4",
    userName: "user04",
    email: "user04@example.com",
    fullName: "Phạm Hữu User",
    roleUser: "User",
  },
  {
    id: "5",
    userName: "user05",
    email: "user05@example.com",
    fullName: "Võ Thị User",
    roleUser: "User",
  },
  {
    id: "6",
    userName: "user06",
    email: "user06@example.com",
    fullName: "Đặng Văn User",
    roleUser: "User",
  },
  {
    id: "7",
    userName: "admin07",
    email: "admin07@example.com",
    fullName: "Hoàng Nguyễn Admin",
    roleUser: "Admin",
  },
  {
    id: "8",
    userName: "user08",
    email: "user08@example.com",
    fullName: "Bùi Thị User",
    roleUser: "User",
  },
  {
    id: "9",
    userName: "mod09",
    email: "mod09@example.com",
    fullName: "Đỗ Văn Moderator",
    roleUser: "Moderator",
  },
  {
    id: "10",
    userName: "user10",
    email: "user10@example.com",
    fullName: "Ngô Thị User",
    roleUser: "User",
  },
  {
    id: "11",
    userName: "user11",
    email: "user11@example.com",
    fullName: "Lý Văn User",
    roleUser: "User",
  },
];

const ITEMS_PER_PAGE = 5; // Số lượng item mỗi trang

const AdminAccount: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const updatedUser = (location.state as { updatedUser: User })?.updatedUser;
    if (updatedUser) {
      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === updatedUser.id);
        if (exists) {
          return prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          );
        } else {
          // Sắp xếp lại để user mới thêm lên đầu hoặc cuối nếu muốn
          return [updatedUser, ...prevUsers];
        }
      });
      // Xóa state sau khi sử dụng để tránh lỗi khi refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleAdd = () => {
    navigate("/admin/account/add");
  };

  const handleEdit = (user: User) => {
    navigate(`/admin/account/edit/${user.id}`, { state: { user } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      // Simulate API call for deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      // alert("Xóa người dùng thành công!"); // Có thể dùng toast notification thay thế
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-700">
        Đang tải dữ liệu người dùng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8F7F0] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {FaPlus({ className: "mr-2" })} Thêm người dùng
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tên người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Họ và tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          user.roleUser === "Admin"
                            ? "bg-red-100 text-red-800"
                            : user.roleUser === "Moderator"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.roleUser}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors"
                          aria-label="Sửa"
                        >
                          {FaEdit({ size: 16 })}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                          aria-label="Xoá"
                        >
                          {FaTrash({ size: 16 })}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang trước"
            >
              {FaAngleLeft({ size: 20 })}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    currentPage === index + 1
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang sau"
            >
              {FaAngleRight({ size: 20 })}
            </button>
          </div>
        )}
        {currentUsers.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            Không có người dùng nào để hiển thị.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccount;
