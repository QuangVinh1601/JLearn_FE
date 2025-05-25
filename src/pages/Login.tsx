import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { loginUser, getCollections } from "../api/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";


// Import icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateForm(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);

      const { refreshToken, role, userID } = response;
      console.log("Login API response:", response);

      if (!userID) {
        console.warn("userID not found in response:", response);
        throw new Error("User ID not received from API");
      }

      login(refreshToken, role);
      localStorage.setItem("userID", userID);

      if (role !== "admin") {
        const collectionsResponse = await getCollections(userID);
        localStorage.setItem("purchasedCourses", JSON.stringify(collectionsResponse.collections));
        console.log("Collections:", collectionsResponse.collections);
      }

      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        if (role === "admin") {
          console.log("Navigate to admin dashboard");
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[rgb(248,241,229)]">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-100 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-red-100 to-transparent"></div>

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
            {["日", "本", "語", "学", "習", "漢", "字", "平", "仮", "名"][i]}
          </motion.div>
        ))}
      </div>

      <ToastContainer />

      <div className="w-full max-w-xl space-y-8 relative z-10"> {/* Increased width from max-w-md to max-w-xl */}
        {/* Logo and branding section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="mt-6 text-5xl font-extrabold text-red-800 tracking-tight"> {/* Increased text size */}
            JLEARN
          </h1>
          <div className="mt-3 flex items-center justify-center">
            <div className="h-1 w-16 bg-red-400 rounded-full"></div>
            <p className="mx-3 text-lg text-red-800/80 font-medium"> {/* Increased text size */}
              Japanese Learning Platform
            </p>
            <div className="h-1 w-16 bg-red-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Main login card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={
            animateForm ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100"
        >
          {/* Card header */}
          <div className="px-8 py-10 bg-gradient-to-r from-red-500 to-red-400 text-white"> {/* Increased padding */}
            <h2 className="text-2xl font-bold">ようこそ! (Yokoso!)</h2> {/* Increased text size */}
            <p className="text-base text-white/90 mt-1"> {/* Increased text size */}
              Chào mừng bạn đến hành trình học tiếng Nhật
            </p>
          </div>

          {/* Login form */}
          <div className="p-8"> {/* Increased padding */}
            <form className="space-y-7" onSubmit={handleSubmit}> {/* Increased spacing */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                >
                  <span className="block sm:inline text-base">{error}</span> {/* Increased text size */}
                </motion.div>
              )}

              {/* Email field */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative rounded-lg shadow-sm"> {/* Changed to rounded-lg */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-lg" /> {/* Increased icon size */}
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
                <div className="relative rounded-lg shadow-sm"> {/* Changed to rounded-lg */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 text-lg" /> {/* Increased icon size */}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="••••••••"
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
              </div>

              {/* Remember me & forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-base text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-base"> {/* Increased text size */}
                  <Link
                    to="/forgot-password"
                    className="font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2"> {/* Added top padding */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative w-full flex justify-center py-4 px-5 rounded-lg text-white text-lg ${loading
                      ? "bg-red-400"
                      : "bg-red-600 hover:bg-red-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-medium shadow-md`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24"> {/* Increased size and spacing */}
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
                      Đang đăng nhập...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Đăng nhập
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

        {/* Registration link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-6"
        >
          <p className="text-gray-700 text-base"> {/* Increased text size */}
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;