import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { loginUser, getCollections } from "../api/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Định nghĩa schema validation với yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [animateForm, setAnimateForm] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Khởi tạo react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateForm(true);
  }, []);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data.email, data.password);
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
        console.log("Collections API response:", collectionsResponse);
        const collectionsResponseUpcase = Array.isArray(collectionsResponse)
          ? collectionsResponse.map((id) =>
              typeof id === "string" ? id.toUpperCase() : id
            )
          : collectionsResponse;
        localStorage.setItem(
          "purchasedCourses",
          JSON.stringify(collectionsResponseUpcase)
        );
        console.log("Purchased courses:", collectionsResponseUpcase);
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
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[rgb(248,241,229)]">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-red-100 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-red-100 to-transparent"></div>
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

      <div className="w-full max-w-xl space-y-8 relative z-10">
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
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={animateForm ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100"
        >
          <div className="px-8 py-10 bg-gradient-to-r from-red-500 to-red-400 text-white">
            <h2 className="text-2xl font-bold">ようこそ! (Yokoso!)</h2>
            <p className="text-base text-white/90 mt-1">
              Chào mừng bạn đến hành trình học tiếng Nhật
            </p>
          </div>
          <div className="p-8">
            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
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
                      icon={faUser}
                      className="text-gray-400 text-lg"
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`block w-full pl-12 pr-4 py-4 text-base border ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="example@gmail.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
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
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`block w-full pl-12 pr-12 py-4 text-base border ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-red-500 focus:border-red-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200`}
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
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
                <div className="text-base">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-red-600 hover:text-red-500 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative w-full flex justify-center py-4 px-5 rounded-lg text-white text-lg ${
                    isSubmitting ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-medium shadow-md`}
                >
                  {isSubmitting ? (
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center pt-6"
        >
          <p className="text-gray-700 text-base">
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