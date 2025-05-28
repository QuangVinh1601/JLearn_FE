import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// Import icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faChevronRight,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  const navigate = useNavigate();

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateForm(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!userName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các trường!");
      toast.error("Vui lòng điền đầy đủ các trường!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      toast.error("Mật khẩu không khớp!");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(userName)) {
      setError("Tên người dùng chỉ được chứa chữ cái và số!");
      toast.error("Tên người dùng chỉ được chứa chữ cái và số!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = {
        userName,
        email,
        password,
        confirmPassword,
      };

      console.log("userData:", userData);
      await registerUser(userData);

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Lỗi đăng ký:", err.response?.data, err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[rgb(248,241,229)]">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-red-100 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-red-100 to-transparent"></div>

        {/* Pattern elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-6xl text-red-800/5 font-bold"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.05,
            }}
            animate={{
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {["登", "録", "新", "規", "会", "員", "作", "成", "始", "開"][i]}
          </motion.div>
        ))}
      </div>

      <ToastContainer />

      <div className="w-full max-w-xl space-y-8 relative z-10">
        {/* Logo and branding section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="mt-6 text-5xl font-extrabold text-red-800 tracking-tight">
            JLEARN
          </h1>
          <div className="mt-3 flex items-center justify-center">
            <div className="h-1 w-16 bg-red-400 rounded-full"></div>
            <p className="mx-3 text-lg text-red-800/80 font-medium">
              Japanese Learning Platform
            </p>
            <div className="h-1 w-16 bg-red-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Main register card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={animateForm ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100"
        >
          {/* Card header */}
          <div className="px-8 py-8 bg-gradient-to-r from-red-500 to-red-400 text-white">
            <h2 className="text-2xl font-bold">新規登録 (Shinki tōroku)</h2>
            <p className="text-base text-white/90 mt-1">
              Tạo tài khoản để bắt đầu hành trình học tiếng Nhật của bạn
            </p>
          </div>

          {/* Register form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                >
                  <span className="block sm:inline text-base">{error}</span>
                </motion.div>
              )}

              {/* Username field */}
              <div className="relative">
                <label
                  htmlFor="userName"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Tên người dùng
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Tên người dùng"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-lg"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  Mật khẩu phải có ít nhất 6 ký tự
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-12 pr-12 py-4 text-base border ${
                      confirmPassword && password === confirmPassword
                        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {confirmPassword &&
                      (password === confirmPassword ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 mr-2"
                        />
                      ) : null)}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="text-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative w-full flex justify-center py-4 px-5 rounded-lg text-white text-lg ${
                    loading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-medium shadow-md`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-6 w-6 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Đang đăng ký...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Đăng ký
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="ml-2 text-sm"
                      />
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Login link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-6"
        >
          <p className="text-gray-700 text-base">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
