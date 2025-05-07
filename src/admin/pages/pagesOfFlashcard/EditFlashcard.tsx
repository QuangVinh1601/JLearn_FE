import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getFlashcard,
  addFlashcard,
  updateFlashcard,
  createPersonalFlashcardList,
} from "../../../api/apiClient";

interface Flashcard {
  id: string;
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId?: string;
  listId?: string;
  imageFile?: string;
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
    japaneseWord: "",
    romaji: "",
    vietnameseMeaning: "",
    exampleSentence: "",
  });

  useEffect(() => {
    const fetchFlashcard = async () => {
      const listId = new URLSearchParams(location.search).get("listId");
      if (!listId) {
        setError("Vui lòng tạo PersonalFlashcardList trước!");
        setLoading(false);
        return;
      }

      if (id) {
        try {
          const data = await getFlashcard(id);
          setDetails({
            id: data.flashcardId,
            japaneseWord: data.japaneseWord,
            romaji: data.romaji,
            vietnameseMeaning: data.vietnameseMeaning,
            exampleSentence: data.exampleSentence,
            publicImageId: data.publicImageId,
            listId: listId,
          });
        } catch (error) {
          setError("Không tìm thấy flashcard");
        } finally {
          setLoading(false);
        }
      } else {
        setDetails({
          id: `${Date.now()}`,
          japaneseWord: "",
          romaji: "",
          vietnameseMeaning: "",
          exampleSentence: "",
          publicImageId: "",
          listId: listId,
          imageFile: "",
        });
        setLoading(false);
      }
    };
    fetchFlashcard();
  }, [id, location.search]);

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
      japaneseWord: "",
      romaji: "",
      vietnameseMeaning: "",
      exampleSentence: "",
    };

    if (!details?.japaneseWord.trim())
      errors.japaneseWord = "Yêu cầu nhập tiếng Nhật";
    if (!details?.romaji.trim()) errors.romaji = "Yêu cầu nhập romaji";
    if (!details?.vietnameseMeaning.trim())
      errors.vietnameseMeaning = "Yêu cầu nhập nghĩa";
    if (!details?.exampleSentence.trim())
      errors.exampleSentence = "Yêu cầu nhập câu ví dụ";

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !details.listId) return;

    if (!validateForm()) return;

    setSaving(true);
    try {
      if (id) {
        await updateFlashcard(id, {
          japaneseWord: details.japaneseWord,
          romaji: details.romaji,
          vietnameseMeaning: details.vietnameseMeaning,
          exampleSentence: details.exampleSentence,
          publicImageId: details.publicImageId || "",
        });
        alert("Cập nhật flashcard thành công!");
      } else {
        await addFlashcard({
          japaneseWord: details.japaneseWord,
          romaji: details.romaji,
          vietnameseMeaning: details.vietnameseMeaning,
          exampleSentence: details.exampleSentence,
          publicImageId: details.publicImageId || "",
          listId: details.listId,
          imageFile: details.imageFile || "",
        });
        alert("Thêm flashcard thành công!");
      }
      navigate(`/admin/flashcard?listId=${details.listId}`, {
        state: { updatedFlashcard: details },
      });
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert("Lưu flashcard thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateList = async () => {
    try {
      const listName = prompt("Nhập tên danh sách mới:");
      if (listName) {
        const newList = await createPersonalFlashcardList(listName);
        navigate(`/admin/flashcard/add?listId=${newList.listId}`);
      }
    } catch (error) {
      setError("Không thể tạo danh sách mới. Vui lòng thử lại!");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto border-2 border-gray-400 rounded-lg shadow-md bg-white p-4 sm:p-6">
        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={handleCreateList}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Tạo PersonalFlashcardList
            </button>
          </div>
        )}

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
                name="japaneseWord"
                value={details.japaneseWord}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.japaneseWord
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.japaneseWord && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.japaneseWord}
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
                name="vietnameseMeaning"
                value={details.vietnameseMeaning}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.vietnameseMeaning
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.vietnameseMeaning && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.vietnameseMeaning}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Câu ví dụ
              </label>
              <input
                type="text"
                name="exampleSentence"
                value={details.exampleSentence}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.exampleSentence
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.exampleSentence && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.exampleSentence}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                PublicImageId (Optional)
              </label>
              <input
                type="text"
                name="publicImageId"
                value={details.publicImageId || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm sm:text-base border-gray-300"
              />
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
                onClick={() =>
                  navigate(`/admin/flashcard?listId=${details.listId}`)
                }
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
