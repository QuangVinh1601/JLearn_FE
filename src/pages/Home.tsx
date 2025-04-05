import React, { useState } from "react";
import japancastle from "../assets/images/image1.png";
import itCareer from "../assets/images/image2.png";
import jobOpportunity from "../assets/images/image3.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../components/AuthContext"; // Import useAuth

const videos = ["sKPCZPSrDXs", "johSrXAdtsM", "Y6AHHCq6Mp0", "SdLHV1jxb7g"];

const Home: React.FC = () => {
  const [showAllVideos, setShowAllVideos] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { isLoggedIn } = useAuth(); // Get the login status

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#F8F1E5] text-center py-2">
        <h1 className="text-2xl font-bold mt-4 mb-4">
          Lập trình tinh anh, tiếng Nhật đồng hành
          <br />
          Đón đầu xu thế, tương lai vững bền !
        </h1>
        <h2 className="mb-4">
          Nắm vững tiếng Nhật - Cùng nhau bước vào thế giới IT triệu đô !
        </h2>

        <div className="grid grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
          <img
            src={japancastle}
            alt="Japan Castle"
            className="rounded-lg shadow-lg w-full h-80 animate-pulse"
          />
          <img
            src={itCareer}
            alt="IT Career"
            className="rounded-lg shadow-lg w-full h-80 animate-blink"
          />
          <img
            src={jobOpportunity}
            alt="Job Opportunity"
            className="rounded-lg shadow-lg w-full h-80 animate-pulse"
          />
        </div>
      </div>

      {/* Recommended Courses Section */}
      <section className="bg-[#F8F1E5] py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-8">
          Có thể bạn quan tâm
        </h2>
        <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
          {videos.slice(0, showAllVideos ? videos.length : 2).map((id) => (
            <iframe
              key={id}
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            className="bg-[#888888] text-white font-semibold w-36 border-2 rounded-3xl hover:bg-[#AAAAAA]"
            onClick={() => setShowAllVideos(!showAllVideos)}
          >
            {showAllVideos ? "Ẩn bớt" : "Xem tất cả"}
          </button>
        </div>
        {!isLoggedIn && ( // Only show the "Start now" button if not logged in
          <div className="text-center mt-8">
            <button
              className="bg-red-500 text-white px-12 py-2 rounded-3xl text-lg hover:bg-red-600"
              onClick={() => navigate("/login")} // Redirect to login page on click
            >
              Bắt đầu ngay
            </button>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Bình luận</h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <img
                src="/avatar.jpg"
                alt="Customer"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-bold">Samuel Namogles</h3>
                <p className="text-gray-600">Front-end Developer</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
