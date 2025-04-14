import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface Flashcard {
  id: string;
  japanese: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  category: string;
}

const EditFlashcard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    japanese: "",
    hiragana: "",
    romaji: "",
    meaning: "",
    category: "",
  });

  useEffect(() => {
    const flashcardData = (location.state as { flashcard: Flashcard })
      ?.flashcard;
    if (flashcardData && (!id || flashcardData.id === id)) {
      setDetails(flashcardData);
      setLoading(false);
    } else if (!id) {
      setDetails({
        id: `${Date.now()}`,
        japanese: "",
        hiragana: "",
        romaji: "",
        meaning: "",
        category: "",
      });
      setLoading(false);
    } else {
      setError("Không tìm thấy flashcard");
      setLoading(false);
    }
  }, [id, location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      japanese: "",
      hiragana: "",
      romaji: "",
      meaning: "",
      category: "",
    };

    if (!details?.japanese.trim()) errors.japanese = "Yêu cầu nhập tiếng Nhật";
    if (!details?.hiragana.trim()) errors.hiragana = "Yêu cầu nhập hiragana";
    if (!details?.romaji.trim()) errors.romaji = "Yêu cầu nhập romaji";
    if (!details?.meaning.trim()) errors.meaning = "Yêu cầu nhập nghĩa";
    if (!details?.category.trim()) errors.category = "Yêu cầu nhập danh mục";

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    if (!validateForm()) return;

    setSaving(true);
    setTimeout(() => {
      alert(
        id ? "Cập nhật flashcard thành công!" : "Thêm flashcard thành công!",
      );
      setSaving(false);
      navigate("/admin/flashcard", { state: { updatedFlashcard: details } });
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
              {id ? "Chỉnh sửa Flashcard" : "Thêm Flashcard"}
            </h1>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Tiếng Nhật
              </label>
              <input
                type="text"
                name="japanese"
                value={details.japanese}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.japanese ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.japanese && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.japanese}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Hiragana
              </label>
              <input
                type="text"
                name="hiragana"
                value={details.hiragana}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.hiragana ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.hiragana && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.hiragana}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Romaji
              </label>
              <input
                type="text"
                name="romaji"
                value={details.romaji}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.romaji ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.romaji && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.romaji}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Nghĩa
              </label>
              <input
                type="text"
                name="meaning"
                value={details.meaning}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.meaning ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.meaning && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.meaning}
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
                  validationErrors.category ? "border-red-500" : "border-gray-300"
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
                onClick={() => navigate("/admin/flashcard")}
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

export default EditFlashcard;