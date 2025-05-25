import React, { useState, useEffect } from "react";
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
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo/logo.png"; // Đảm bảo đường dẫn này đúng

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Cập nhật màu chữ cho nền sáng
  const linkClasses =
    "text-stone-700 hover:text-red-500 transition-colors duration-300 ease-in-out";
  const socialIconClasses =
    "text-stone-600 hover:text-red-500 hover:scale-110 transform transition-all duration-300 ease-in-out text-xl";

  return (

    <footer className="bg-[F8F7F0] text-stone-800 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo và thông tin công ty */}
          <div className="mb-6 md:mb-0">
            <img
              src={logo} // Sử dụng logo đã import
              alt="JLearn Logo"
              className="h-20 w-auto mb-4" // Kích thước logo có thể cần điều chỉnh tùy theo file logo của bạn
            />
            {/* Màu chữ cho đoạn mô tả */}
            <p className="text-stone-700 text-sm leading-relaxed">
              Nền tảng học tiếng Nhật và lập trình hàng đầu Việt Nam, mang đến
              trải nghiệm học tập chất lượng và hiệu quả.
            </p>
            <div className="mt-6 flex space-x-5">
              <Link to="/" className={socialIconClasses} aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link to="/" className={socialIconClasses} aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link to="/" className={socialIconClasses} aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
          </div>

          {/* Khóa học */}
          <div>
            {/* Tiêu đề vẫn dùng màu nhấn red-500 */}
            <h3 className="text-xl font-semibold mb-5 text-red-500 border-b-2 border-red-700 pb-2 inline-block">
              Khóa học
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className={linkClasses}>Tiếng Nhật N5</Link></li>
              <li><Link to="/" className={linkClasses}>Tiếng Nhật N4</Link></li>
              <li><Link to="/" className={linkClasses}>Lập trình Java</Link></li>
              <li><Link to="/" className={linkClasses}>Lập trình Web</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-red-500 border-b-2 border-red-700 pb-2 inline-block">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className={linkClasses}>Trung tâm hỗ trợ</Link></li>
              <li><Link to="/" className={linkClasses}>Điều khoản sử dụng</Link></li>
              <li><Link to="/" className={linkClasses}>Chính sách bảo mật</Link></li>
              <li><Link to="/" className={linkClasses}>FAQ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-red-500 border-b-2 border-red-700 pb-2 inline-block">
              Liên hệ
            </h3>
            {/* Màu chữ cho thông tin liên hệ */}
            <ul className="space-y-3 text-stone-700">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-3 mt-1 text-red-500 flex-shrink-0" // Icon vẫn màu nhấn
                />
                <span>120 Hoàng Minh Thảo, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mr-3 text-red-500"
                />
                <span>0762 550 811</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-3 text-red-500"
                />
                <span>lienhe@jlearn.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider - màu cho nền sáng */}
        <div className="border-t border-stone-300 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Màu chữ cho copyright */}
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} JLearn. Đã đăng ký bản quyền.
            </p>
            <div className="flex space-x-6">
              <Link to="/" className={`${linkClasses} text-sm`}>Điều khoản</Link>
              <Link to="/" className={`${linkClasses} text-sm`}>Bảo mật</Link>
              <Link to="/" className={`${linkClasses} text-sm`}>Cookie</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Back to Top - màu sắc vẫn giữ nguyên vì bg-red-500 nổi bật trên nền sáng và tối */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none z-50"
          aria-label="Cuộn lên đầu trang"
        >
          <FontAwesomeIcon icon={faArrowUp} size="lg" />
        </button>
      )}
    </footer>
  );
};

export default Footer;