import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo/logo.png"; // Added logo import

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo và thông tin công ty */}
          <div>
            <img
              src={logo} // Changed logo source to the imported logo
              alt="JLearn Logo"
              className="h-16 w-20 sm:h-20 w-24"
            />
            <p className="text-gray-400 text-sm">
              Nền tảng học tiếng Nhật và lập trình hàng đầu Việt Nam
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
          </div>

          {/* Khóa học */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Khóa học</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Tiếng Nhật N5
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Tiếng Nhật N4
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Lập trình Java
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Lập trình Web
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <span>1900 1234 567</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                <span>contact@jlearn.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 JLearn. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                Điều khoản
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                Bảo mật
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
