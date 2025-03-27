import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Logo và thông tin công ty */}
          <div>
            <img src="/logo.png" alt="JLearn Logo" className="h-8 mb-4" />
            <p className="text-gray-400 text-sm">
              Nền tảng học tiếng Nhật và lập trình hàng đầu Việt Nam
            </p>
            <div className="mt-4 flex space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white">
                <i className="fab fa-youtube"></i>
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
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
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt w-5"></i>
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone w-5"></i>
                <span>1900 1234 567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope w-5"></i>
                <span>contact@jlearn.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 JLearn. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
                Điều khoản
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
                Bảo mật
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
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
