// src/pages/Skills.tsx
import React from "react";
import { Link } from "react-router-dom";

const Skills: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Phát triển Kỹ năng Tiếng Nhật
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Card 1: Speaking Test */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300 ease-in-out border border-gray-200">
          <div className="text-6xl mb-5">🎙️</div>
          <h2 className="text-2xl font-semibold mb-4 text-[#f04532]">
            Kiểm tra Nói (Speaking Test)
          </h2>
          <p className="text-gray-600 mb-8 flex-grow">
            Chọn chủ đề và luyện tập trả lời câu hỏi bằng tiếng Nhật.
          </p>
          <Link
            to="/speaking-topics"
            className="mt-auto bg-[#f04532] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#d03e2c] transition-colors duration-200 shadow-md"
          >
            Chọn chủ đề
          </Link>
        </div>

        {/* Card 2: Pronunciation Test (remains the same) */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300 ease-in-out border border-gray-200">
          <div className="text-6xl mb-5">🗣️</div>
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Kiểm tra Phát âm (Pronunciation Test)
          </h2>
          <p className="text-gray-600 mb-8 flex-grow">
            Đọc các từ hoặc câu được cung cấp và nhận đánh giá về độ chính xác
            trong phát âm của bạn.
          </p>
          <button
            disabled
            className="mt-auto bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg cursor-not-allowed shadow-md"
            title="Tính năng đang được phát triển"
          >
            Sắp ra mắt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skills;
