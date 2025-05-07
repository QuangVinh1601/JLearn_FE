import React, { useState, useEffect } from "react";
import japancastle from "../assets/images/image1.png";
import itCareer from "../assets/images/image2.png";
import jobOpportunity from "../assets/images/image3.png";
import japancastle2 from "../assets/images/canhdepjp.jpg";
import itCareer2 from "../assets/images/itjapan.png";
import jobOpportunity2 from "../assets/images/vieclamitjp.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const videos = ["sKPCZPSrDXs", "johSrXAdtsM", "Y6AHHCq6Mp0", "wWzHTRePd8c"];

const imageSets = [
  [japancastle, itCareer, jobOpportunity],
  [japancastle2, itCareer2, jobOpportunity2],
];

const Home: React.FC = () => {
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setCurrentSetIndex((prevIndex) =>
          prevIndex === imageSets.length - 1 ? 0 : prevIndex + 1,
        );

        setTimeout(() => {
          setFadeState(true);
        }, 100);
      }, 500);
    }, 4000);

    return () => clearInterval(fadeInterval);
  }, []);

  const currentImages = imageSets[currentSetIndex];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#F8F1E5] text-center py-2">
        <h1 className="text-xl sm:text-2xl font-bold mt-4 mb-4">
          Lập trình tinh anh, tiếng Nhật đồng hành
          <br />
          Đón đầu xu thế, tương lai vững bền !
        </h1>
        <h2 className="text-base sm:text-lg mb-4">
          Nắm vững tiếng Nhật - Cùng nhau bước vào thế giới IT triệu đô !
        </h2>

        {/* Grid với 3 ảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-6xl mx-auto px-4">
          <img
            src={currentImages[0]}
            alt="Japan Castle"
            className={`rounded-lg shadow-lg w-full h-64 sm:h-80 object-cover transition-opacity duration-500 ${fadeState ? "opacity-100" : "opacity-30"}`}
          />
          <img
            src={currentImages[1]}
            alt="IT Career"
            className={`rounded-lg shadow-lg w-full h-64 sm:h-80 object-cover transition-opacity duration-500 ${fadeState ? "opacity-100" : "opacity-30"}`}
          />
          <img
            src={currentImages[2]}
            alt="Job Opportunity"
            className={`rounded-lg shadow-lg w-full h-64 sm:h-80 object-cover transition-opacity duration-500 ${fadeState ? "opacity-100" : "opacity-30"}`}
          />
        </div>
      </div>

      {/* Recommended Courses Section */}
      <section className="bg-[#F8F1E5] py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-8">
          Có thể bạn quan tâm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
          {videos.slice(0, showAllVideos ? videos.length : 2).map((id) => (
            <iframe
              key={id}
              width="100%"
              height="auto"
              className="aspect-video"
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
            className="bg-[#888888] text-white font-semibold w-32 sm:w-36 py-2 rounded-3xl hover:bg-[#AAAAAA]"
            onClick={() => setShowAllVideos(!showAllVideos)}
          >
            {showAllVideos ? "Ẩn bớt" : "Xem tất cả"}
          </button>
        </div>
        {!isLoggedIn && (
          <div className="text-center mt-8">
            <button
              className="bg-red-500 text-white px-8 sm:px-12 py-2 rounded-3xl text-base sm:text-lg hover:bg-red-600"
              onClick={() => navigate("/login")}
            >
              Bắt đầu ngay
            </button>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#FFFFFF] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Bình luận
          </h2>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_10px_50px_10px_rgba(0,0,0,0.25)]">
            <div className="flex items-center">
              <img
                src="/avatar.jpg"
                alt="Customer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
              />
              <div className="ml-3 sm:ml-4">
                <h3 className="font-bold text-base sm:text-lg">
                  Samuel Namogles
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Front-end Developer
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 text-sm sm:text-base">
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
