import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "Học tiếng Nhật bảng chữ cái online",
    url: "https://www.youtube.com/watch?v=XWdwg2FNHeU",
    description: "Giới thiệu bảng chữ cái Hiragana",
    category: "Học tiếng Nhật",
  },
  {
    id: "2",
    title: "Cách làm sushi tại nhà",
    url: "https://www.youtube.com/watch?v=xyz456",
    description: "Hướng dẫn làm sushi đơn giản",
    category: "Ẩm thực Nhật Bản",
  },
  {
    id: "3",
    title: "Du lịch Tokyo 2023",
    url: "https://www.youtube.com/watch?v=def789",
    description: "Khám phá thủ đô Nhật Bản",
    category: "Du lịch",
  },
];

const AdminVideo: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const updatedVideo = (location.state as { updatedVideo: Video })
      ?.updatedVideo;
    if (updatedVideo) {
      setVideos((prevVideos) => {
        const exists = prevVideos.some((video) => video.id === updatedVideo.id);
        if (exists) {
          return prevVideos.map((video) =>
            video.id === updatedVideo.id ? updatedVideo : video,
          );
        } else {
          return [...prevVideos, updatedVideo];
        }
      });
    }
  }, [location.state]);

  const handleAdd = () => {
    navigate("/admin/video/add");
  };

  const handleEdit = (video: Video) => {
    navigate(`/admin/video/edit/${video.id}`, { state: { video } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa video này?")) {
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== id));
      alert("Xóa video thành công!");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = videos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Quản lý Video</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          Thêm Video
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {!loading && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{video.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{video.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {video.url}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{video.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{video.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
            >
              Trước
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminVideo;