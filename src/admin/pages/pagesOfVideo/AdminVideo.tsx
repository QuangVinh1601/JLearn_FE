import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getLearningContents,
  deleteLearningContent,
} from "../../../api/apiClient"; // Đảm bảo đường dẫn đúng
import {
  FaPlus as AddIcon,
  FaEdit as EditIcon,
  FaTrashAlt as DeleteIcon,
  FaAngleLeft as PrevIcon,
  FaAngleRight as NextIcon,
  FaExclamationCircle as EmptyIcon,
  FaVideo as VideoIconSolid // Icon cho video
} from "react-icons/fa";

interface VideoContent {
  id: string; // ID của LearningContent
  title: string;
  urlVideo: string; // URL để xem video (từ Cloudinary hoặc nơi lưu trữ khác)
  urlAd?: string; // URL của quảng cáo liên kết (nếu có)
  adId?: string; // ID của quảng cáo liên kết (nếu có)
  createdAt?: string; // Định dạng lại nếu cần
  uploadedBy?: string; // Tên hoặc ID người tải lên
}

const ITEMS_PER_PAGE = 5;

// --- Mock API functions (thay thế bằng API thật của bạn) ---
const MOCK_DELAY_VIDEO = 500;
let mockVideoContents: VideoContent[] = [
  { id: "vid1", title: "Bài học Hiragana cơ bản", urlVideo: "https://res.cloudinary.com/demo/video/upload/dog.mp4", adId: "ad1", createdAt: "2024-05-20T10:00:00Z", uploadedBy: "Admin JLearn" },
  { id: "vid2", title: "Giới thiệu Kanji N5", urlVideo: "https://res.cloudinary.com/demo/video/upload/sample.mp4", adId: "ad2", createdAt: "2024-05-21T11:30:00Z", uploadedBy: "Sensei A" },
  { id: "vid3", title: "Luyện nghe hội thoại sơ cấp", urlVideo: "https://res.cloudinary.com/demo/video/upload/ski_jump.mp4", createdAt: "2024-05-22T14:15:00Z", uploadedBy: "Admin JLearn" },
];

const mockGetLearningContents = async (): Promise<{ data: VideoContent[] }> => {
  return new Promise(resolve => setTimeout(() => resolve({ data: [...mockVideoContents] }), MOCK_DELAY_VIDEO));
};

const mockDeleteLearningContent = async (id: string): Promise<void> => {
  return new Promise(resolve => setTimeout(() => {
    mockVideoContents = mockVideoContents.filter(vc => vc.id !== id);
    resolve();
  }, MOCK_DELAY_VIDEO));
};
// --- End Mock API functions ---


const AdminVideo: React.FC = () => {
  const [videoContents, setVideoContents] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Sử dụng API thật
        // const response = await getLearningContents();
        // const data = response.data;
        // setVideoContents(Array.isArray(data) ? data : []);

        // Sử dụng mock API
        const response = await mockGetLearningContents();
        setVideoContents(response.data);

      } catch (err) {
        console.error("Lỗi khi lấy danh sách video:", err);
        setError("Không thể tải danh sách video. Vui lòng thử lại sau.");
        setVideoContents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, []);

  useEffect(() => {
    const updatedContent = (location.state as { updatedContent?: VideoContent })?.updatedContent;
    if (updatedContent) {
      setVideoContents((prevContents) => {
        const exists = prevContents.some((content) => content.id === updatedContent.id);
        if (exists) {
          return prevContents.map((content) =>
            content.id === updatedContent.id ? updatedContent : content,
          );
        } else {
          // Thêm video mới vào đầu danh sách
          return [updatedContent, ...prevContents.filter(c => c.id !== updatedContent.id)];
        }
      });
      navigate(location.pathname, { replace: true, state: {} }); // Xóa state
    }
  }, [location.state, navigate, location.pathname]);

  const handleAdd = () => {
    // Trang EditVideo dùng để tạo mới (không có id trong params)
    navigate("/admin/video/add");
  };

  const handleEdit = (content: VideoContent) => {
    // Truyền content.id (ID của learning content) cho trang EditVideo
    navigate(`/admin/video/edit/${content.id}`, { state: { videoDetails: content } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa video này?")) {
      // setLoading(true); // Có thể thêm spinner cho từng hàng hoặc disable nút
      try {
        // await deleteLearningContent(id); // API thật
        await mockDeleteLearningContent(id); // Mock API
        setVideoContents((prevContents) =>
          prevContents.filter((content) => content.id !== id),
        );
        // alert("Xóa video thành công!"); // Thay bằng toast notification
      } catch (err) {
        console.error("Lỗi khi xóa video:", err);
        setError("Xóa video thất bại. Vui lòng thử lại.");
        // alert("Xóa video thất bại!");
      } finally {
        // setLoading(false);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
    } catch (e) {
      return dateString; // Trả về chuỗi gốc nếu không parse được
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentVideos = videoContents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(videoContents.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading && !error) { // Chỉ hiển thị loading nếu không có lỗi ban đầu
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Đang tải danh sách video...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8F7F0] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý Video Học Tập
          </h1>
          <button
            onClick={handleAdd}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {AddIcon({ className: "mr-2" })} Thêm Video
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 text-center text-red-700 bg-red-100 rounded-lg shadow">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Video URL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người tải</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentVideos.map((content, index) => (
                  <tr key={content.id} className="hover:bg-red-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={content.title}>
                      {content.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {content.urlVideo ? (
                        <a
                          href={content.urlVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline hover:text-sky-800 flex items-center"
                          title={content.urlVideo}
                        >
                          {VideoIconSolid({ className: "mr-1.5 text-sky-500" })} Xem Video
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(content.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.uploadedBy || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(content)}
                          className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors"
                          aria-label="Sửa video"
                        >
                          {EditIcon({ size: 16 })}
                        </button>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                          aria-label="Xoá video"
                        >
                          {DeleteIcon({ size: 16 })}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {PrevIcon({ size: 20 })}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === index + 1
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {NextIcon({ size: 20 })}
            </button>
          </div>
        )}

        {currentVideos.length === 0 && !loading && !error && (
          <div className="text-center py-16 text-gray-500">
            {EmptyIcon({ className: "mx-auto text-5xl text-gray-400 mb-4" })}
            <p className="text-lg">Không có video nào để hiển thị.</p>
            <p className="text-sm">Bạn có thể bắt đầu bằng cách <button onClick={handleAdd} className="text-red-600 hover:underline">thêm video mới</button>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;