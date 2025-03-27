import React, { useState } from "react";
import japancastle from "../assets/images/image1.png";
import itCareer from "../assets/images/image2.png";
import jobOpportunity from "../assets/images/image3.png";

const Home: React.FC = () => {
  const [showAllVideos, setShowAllVideos] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#F8F7F0] text-center py-2">
        <h1 className="text-2xl font-bold mt-4 mb-4">
          Lập trình tinh anh, tiếng Nhật đồng hành
          <br />
          Đón đầu xu thế, tương lai vững bền !
        </h1>
        <h2 className="mb-4">
          Nắm vững tiếng Nhật - Cùng nhau bước vào thế giới IT triệu đô !
        </h2>
        <button className="bg-red-500 text-white px-12 py-2 rounded-3xl text-lg hover:bg-red-600">
          Bắt đầu ngay
        </button>
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
      <section className="bg-[#F8F7F0] py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-8">
          Có thể bạn quan tâm
        </h2>
        <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/sKPCZPSrDXs?si=bg79QaBmoyq43y0U"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/johSrXAdtsM?si=jP6qnlOIvXcw_iMC"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          {showAllVideos && (
            <>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Y6AHHCq6Mp0?si=VjPo2KM9nkp1Vya6"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/SdLHV1jxb7g?si=y-udFvx8yPiwIkk8"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            className="text-red-500 font-semibold w-36 border-red-500 border-2 rounded-3xl hover:bg-red-500 hover:text-white"
            onClick={() => setShowAllVideos(!showAllVideos)}
          >
            {showAllVideos ? "Ẩn bớt" : "Xem tất cả"}
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-pink-100 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
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
