import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; // Import useAuth

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả sử dữ liệu đăng nhập thành công cho người dùng
    if (email === "example@example.com" && password === "123") {
      alert("Đăng nhập thành công!");
      login();
      navigate("/profile");
      // Đảm bảo rằng sau khi đăng nhập thành công, người dùng sẽ được điều hướng đến một trang khác
      window.location.href = "/home";
    }
    // Giả sử dữ liệu đăng nhập thành công cho admin
    else if (email === "admin@example.com" && password === "admin123") {
      alert("Đăng nhập thành công!");
      login();
      navigate("/admin");
      // Đảm bảo rằng sau khi đăng nhập thành công, admin sẽ được điều hướng đến một trang khác
      window.location.href = "/admin-dashboard";
    } else {
      alert("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-cover bg-center">
      <div className="max-w-md w-full space-y-8 bg-white border border-gray-300 rounded-md p-4 shadow-lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-teal-900 leading-tight">
            HỌC TIẾNG NHẬT CÙNG
            <br />
            JLEARN NÀO!
          </h1>
          <p className="mt-2 text-gray-700">Đăng nhập ngay !</p>
          <p className="text-gray-700">
            Hành trình chinh phục tiếng Nhật đang chờ bạn !
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Email hoặc tên đăng nhập"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-full text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Đăng nhập
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
            <img
              src="/facebook-icon.png"
              alt="Facebook"
              className="h-5 w-5 mr-2"
            />
            Facebook
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
            <img src="/google-icon.png" alt="Google" className="h-5 w-5 mr-2" />
            Google
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
