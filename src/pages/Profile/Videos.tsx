import React, { useState } from "react";
import { FaPlay, FaSearch, FaFilter, FaClock, FaEye, FaHeart, FaBookmark } from 'react-icons/fa';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  level: string;
  views: number;
  isBookmarked: boolean;
}

const Videos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  // Mock data for videos
  const videos: Video[] = [
    {
      id: "1",
      title: "Giới thiệu về tiếng Nhật N5",
      description: "Học những kiến thức cơ bản về tiếng Nhật dành cho người mới bắt đầu",
      thumbnail: "https://img.youtube.com/vi/sKPCZPSrDXs/maxresdefault.jpg",
      duration: "15:30",
      category: "grammar",
      level: "N5",
      views: 1250,
      isBookmarked: false
    },
    {
      id: "2",
      title: "50 từ vựng tiếng Nhật cần thiết",
      description: "Tổng hợp 50 từ vựng quan trọng nhất trong tiếng Nhật",
      thumbnail: "https://img.youtube.com/vi/johSrXAdtsM/maxresdefault.jpg",
      duration: "22:15",
      category: "vocabulary",
      level: "N5",
      views: 890,
      isBookmarked: true
    },
    {
      id: "3",
      title: "Cách phát âm tiếng Nhật chuẩn",
      description: "Hướng dẫn phát âm các âm cơ bản trong tiếng Nhật",
      thumbnail: "https://img.youtube.com/vi/Y6AHHCq6Mp0/maxresdefault.jpg",
      duration: "18:45",
      category: "pronunciation",
      level: "N5",
      views: 2100,
      isBookmarked: false
    },
    {
      id: "4",
      title: "Ngữ pháp N4 - Bài 1",
      description: "Học ngữ pháp cấp độ N4 từ cơ bản đến nâng cao",
      thumbnail: "https://img.youtube.com/vi/wWzHTRePd8c/maxresdefault.jpg",
      duration: "25:10",
      category: "grammar",
      level: "N4",
      views: 756,
      isBookmarked: true
    }
  ];

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "grammar", label: "Ngữ pháp" },
    { value: "vocabulary", label: "Từ vựng" },
    { value: "pronunciation", label: "Phát âm" },
    { value: "conversation", label: "Hội thoại" },
    { value: "culture", label: "Văn hóa" }
  ];

  const levels = [
    { value: "all", label: "Tất cả cấp độ" },
    { value: "N5", label: "N5" },
    { value: "N4", label: "N4" },
    { value: "N3", label: "N3" },
    { value: "N2", label: "N2" },
    { value: "N1", label: "N1" }
  ];

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || video.category === filterCategory;
    const matchesLevel = filterLevel === "all" || video.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleVideoClick = (videoId: string) => {
    // Navigate to video detail page or open video player
    console.log(`Playing video: ${videoId}`);
  };

  const toggleBookmark = (videoId: string) => {
    // Toggle bookmark status
    console.log(`Toggle bookmark for video: ${videoId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Video học tập</h1>
            <p className="text-gray-600">Học tiếng Nhật qua các video bài giảng chất lượng cao</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              {FaSearch({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
              <input
                type="text"
                placeholder="Tìm kiếm video..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              {FaFilter({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none"
                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none"
                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Tổng video</h3>
          <p className="text-3xl font-bold">{videos.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Đã xem</h3>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Đã lưu</h3>
          <p className="text-3xl font-bold">{videos.filter(v => v.isBookmarked).length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Thời gian học</h3>
          <p className="text-3xl font-bold">2.5h</p>
        </div>
      </div>

      {/* Featured Video */}
      <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Video nổi bật</h2>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={videos[0].thumbnail}
                alt={videos[0].title}
                className="w-80 h-48 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-full p-4 transition-all transform hover:scale-110 shadow-lg">
                  {FaPlay({ className: "text-2xl ml-1" })}
                </button>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-3">{videos[0].title}</h3>
              <p className="text-red-100 text-lg mb-4">{videos[0].description}</p>
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {FaClock({ className: "inline mr-1" })} {videos[0].duration}
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {FaEye({ className: "inline mr-1" })} {videos[0].views.toLocaleString()} lượt xem
                </span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {videos[0].level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm || filterCategory !== "all" || filterLevel !== "all"
              ? `Kết quả tìm kiếm (${filteredVideos.length})`
              : "Tất cả video"}
          </h2>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                style={{ backgroundColor: '#F0D5A8' }}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleVideoClick(video.id)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 rounded-full p-3 transition-all transform hover:scale-110 shadow-lg"
                    >
                      {FaPlay({ className: "text-lg ml-0.5" })}
                    </button>
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleBookmark(video.id)}
                      className={`p-2 rounded-full transition-all ${video.isBookmarked
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                    >
                      {video.isBookmarked ? FaHeart({}) : FaBookmark({})}
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        {FaEye({ className: "mr-1" })} {video.views.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {video.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Không tìm thấy video</h3>
            <p className="text-gray-600">Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
