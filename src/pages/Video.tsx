import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getLearningContents } from "../api/apiClient";
import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface VideoContent {
  id: string;
  title: string;
  urlVideo: string;
  urlAd: string;
  createdAt: string;
  thumbnailUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const Videos: React.FC = () => {
  const [videoContents, setVideoContents] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAd, setPlayingAd] = useState<{ [key: string]: boolean }>({});
  const [isAdPlaying, setIsAdPlaying] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [showSkipAd, setShowSkipAd] = useState<{ [key: string]: boolean }>({});
  const [adPlayedSeconds, setAdPlayedSeconds] = useState<{ [key: string]: number }>({});
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
         const response = await getLearningContents();
      console.log("Fetched Video Contents:", response);
      const data = Array.isArray(response.data) ? response.data : response;
       
      setVideoContents(
        data.map((item: any) => {
          let difficulty: "beginner" | "intermediate" | "advanced" = "beginner";
          if (/sơ cấp/i.test(item.title)) difficulty = "beginner";
          else if (/trung cấp/i.test(item.title)) difficulty = "intermediate";
          else if (/cao cấp/i.test(item.title)) difficulty = "advanced";
          return {
            id: item.id,
            title: item.title,
            urlVideo: item.urlVideo,
            urlAd: item.urlAd || "",
            createdAt: item.createdAt,
            thumbnailUrl:
              item.thumbnailUrl ||
              "https://via.placeholder.com/1280x720?text=Video+Thumbnail",
            difficulty,
          };
        }),
      );
        const initialPlayingAd = data.reduce((acc: any, video: any) => {
          acc[video.id] = !isLoggedIn && video.urlAd ? true : false;
          return acc;
        }, {});
        setPlayingAd(initialPlayingAd);
        setIsAdPlaying(
          data.reduce((acc: any, video: any) => {
            acc[video.id] = false;
            return acc;
          }, {}),
        );
      } catch (error) {
        console.error("Lỗi khi lấy danh sách video:", error);
        setVideoContents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [isLoggedIn]);

  const handleVideoStart = (videoId: string) => {
    if (!isLoggedIn && playingAd[videoId]) {
      setIsAdPlaying((prev) => ({ ...prev, [videoId]: true }));
      if (timersRef.current[videoId]) {
        clearTimeout(timersRef.current[videoId]);
      }
      timersRef.current[videoId] = setTimeout(() => {
        setShowSkipAd((prev) => ({ ...prev, [videoId]: true }));
      }, 25000);
    }
  };

  const handleVideoEnd = (videoId: string) => {
    if (!isLoggedIn && playingAd[videoId]) {
      setPlayingAd((prev) => ({ ...prev, [videoId]: false }));
      setIsAdPlaying((prev) => ({ ...prev, [videoId]: false }));
      setShowSkipAd((prev) => ({ ...prev, [videoId]: false }));
      if (timersRef.current[videoId]) {
        clearTimeout(timersRef.current[videoId]);
        delete timersRef.current[videoId];
      }
    }
  };

  const handleSkipAd = (videoId: string) => {
    setPlayingAd((prev) => ({ ...prev, [videoId]: false }));
    setIsAdPlaying((prev) => ({ ...prev, [videoId]: false }));
    setShowSkipAd((prev) => ({ ...prev, [videoId]: false }));
    if (timersRef.current[videoId]) {
      clearTimeout(timersRef.current[videoId]);
      delete timersRef.current[videoId];
    }
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      timersRef.current = {};
    };
  }, []);

  const groupedVideos = {
    beginner: videoContents.filter((v) => v.difficulty === "beginner"),
    intermediate: videoContents.filter((v) => v.difficulty === "intermediate"),
    advanced: videoContents.filter((v) => v.difficulty === "advanced"),
  };

  const renderSlider = (videos: VideoContent[], title: string) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      {videos.length === 0 ? (
        <div className="text-center text-gray-500">Không có video nào.</div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 25000, disableOnInteraction: true }}
          className="mySwiper"
        >
          {videos.map((video) => (
            <SwiperSlide key={video.id}>
              <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gray-800">
                <div className="relative">
                  <ReactPlayer
                    url={
                      !isLoggedIn && playingAd[video.id] && video.urlAd
                        ? video.urlAd
                        : video.urlVideo
                    }
                    width="100%"
                    height="auto"
                    controls
                    className="react-player"
                    light={video.thumbnailUrl || true}
                    playing={
                      !isLoggedIn && playingAd[video.id] && video.urlAd
                        ? true
                        : !playingAd[video.id]
                    }
                    onStart={() => handleVideoStart(video.id)}
                    onEnded={() => handleVideoEnd(video.id)}
                    onPause={() => {
                      // Clear the skip ad timer when paused
                      if (timersRef.current[video.id]) {
                        clearTimeout(timersRef.current[video.id]);
                        delete timersRef.current[video.id];
                      }
                      setShowSkipAd((prev) => ({ ...prev, [video.id]: false }));
                    }}
                    onProgress={({ playedSeconds }) => {
                      if (!isLoggedIn && playingAd[video.id] && video.urlAd) {
                        setAdPlayedSeconds(prev => {
                          const seconds = Math.floor(playedSeconds);
                          // Only update if less than 25 to avoid unnecessary updates
                          if ((prev[video.id] || 0) < 25 && seconds >= 0) {
                            return { ...prev, [video.id]: seconds };
                          }
                          return prev;
                        });
                        // Show skip ad if playedSeconds >= 25
                        if (playedSeconds >= 25 && !showSkipAd[video.id]) {
                          setShowSkipAd(prev => ({ ...prev, [video.id]: true }));
                        }
                      }
                    }}
                    config={{
                      file: {
                        attributes: {
                          muted: !isLoggedIn && playingAd[video.id] && video.urlAd,
                        },
                      },
                    }}
                  />
                  {!isLoggedIn && isAdPlaying[video.id] && video.urlAd && (
                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Đang phát quảng cáo...
                    </div>
                  )}
                  {!isLoggedIn && showSkipAd[video.id] && video.urlAd && (
                    <button
                      onClick={() => handleSkipAd(video.id)}
                      className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                    >
                      Bỏ qua quảng cáo
                    </button>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 text-white">
                  <p className="text-lg font-semibold truncate">
                    {video.title}
                  </p>
                  <p className="text-sm text-gray-200">
                    Tạo ngày: {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );

  return (
    <section className="bg-gray-100 py-4 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl text-center text-gray-900">
          Thư viện Video Học tập
        </h1>
        {loading ? (
          <div className="text-center text-gray-600 text-lg">Đang tải...</div>
        ) : (
          <>
            {renderSlider(groupedVideos.beginner, "Sơ cấp")}
            {renderSlider(groupedVideos.intermediate, "Trung cấp")}
            {renderSlider(groupedVideos.advanced, "Cao cấp")}
            {!isLoggedIn && (
              <div className="text-center mt-8">
                <button
                  className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
                <p className="text-xl text-gray-600 mt-3">
                  Đăng nhập để bỏ qua quảng cáo và trải nghiệm không gián đoạn!
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        .react-player {
          aspect-ratio: 16/9;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
          background: black;
        }
        .react-player:hover {
          transform: scale(1.01);
          transition: transform 0.3s ease-in-out;
        }
        .mySwiper {
          position: relative;
          padding-bottom: 40px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #ffffff;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
          z-index: 10;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .swiper-button-next {
          right: 10px;
        }
        .swiper-button-prev {
          left: 10px;
        }
        .swiper-pagination {
          bottom: 10px !important;
        }
        .swiper-pagination-bullet {
          background: #ffffff;
          opacity: 0.7;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Videos;
