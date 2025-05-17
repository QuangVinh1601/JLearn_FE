import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

const EditVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_LENGTH = 255;
  const [details, setDetails] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const videoData = (location.state as { video: Video })?.video;
    if (videoData && (!id || videoData.id === id)) {
      setDetails(videoData);
      setLoading(false);
    } else if (!id) {
      setDetails({
        id: `${Date.now()}`,
        title: "",
        url: "",
        description: "",
        category: "",
      });
      setLoading(false);
    } else {
      setError("Không tìm thấy thông tin video");
      setLoading(false);
    }
  }, [id, location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (details) {
      const { name, value } = e.target;
      setDetails({
        ...details,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      title: "",
      url: "",
      description: "",
      category: "",
    };

    if (!details?.title.trim()) {
      errors.title = "Yêu cầu nhập tiêu đề";
    } else if (details.title.length > MAX_LENGTH) {
      errors.title = `Tiêu đề không được vượt quá ${MAX_LENGTH} ký tự`;
    }

    if (!details?.url.trim()) {
      errors.url = "Yêu cầu nhập URL";
    } else if (
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        details.url,
      )
    ) {
      errors.url = "URL không hợp lệ";
    }

    if (!details?.description.trim()) {
      errors.description = "Yêu cầu nhập mô tả";
    }

    if (!details?.category.trim()) {
      errors.category = "Yêu cầu nhập danh mục";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    if (!validateForm()) return;

    setSaving(true);
    setTimeout(() => {
      alert(id ? "Cập nhật video thành công!" : "Thêm video thành công!");
      setSaving(false);
      navigate("/admin/video", { state: { updatedVideo: details } });
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto border-2 border-gray-400 rounded-lg shadow-md bg-white p-4 sm:p-6">
        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && details && (
          <form onSubmit={handleSave}>
            <h1 className="text-xl sm:text-2xl font-bold mb-6">
              {id ? "Chỉnh sửa Video" : "Thêm Video Mới"}
            </h1>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Tiêu đề
              </label>
              <input
                type="text"
                name="title"
                value={details.title}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                URL
              </label>
              <input
                type="text"
                name="url"
                value={details.url}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.url ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.url && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.url}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Mô tả
              </label>
              <textarea
                name="description"
                value={details.description}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                rows={4}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Danh mục
              </label>
              <input
                type="text"
                name="category"
                value={details.category}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.category && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.category}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto px-4 py-2 rounded text-sm sm:text-base ${
                  saving
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/video")}
                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm sm:text-base"
              >
                Quay lại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditVideo;
