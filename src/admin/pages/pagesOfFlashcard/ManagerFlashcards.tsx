import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFlashcards,
  addFlashcard,
  deleteFlashcard,
} from "../../../api/apiClient";
import {
  FaPlus,
  FaTrashAlt,
  FaEye,
  FaArrowLeft,
  FaImage,
  FaUpload,
  FaExclamationCircle,
} from "react-icons/fa";

const AddIcon = FaPlus;
const DeleteIcon = FaTrashAlt;
const DetailIcon = FaEye;
const BackIcon = FaArrowLeft;
const ImageIcon = FaImage;
const UploadIcon = FaUpload;
const EmptyIcon = FaExclamationCircle;

interface Flashcard {
  id: string;
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId?: string;
  listId: string;
  imageUrl?: string;
}

interface NewFlashcardFormState {
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId: string;
  imageFile: File | null;
  listId: string;
}

interface ApiResponse {
  error?: unknown;
  data?: Flashcard[] | Flashcard;
}

const ManageFlashcards: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialNewFlashcardState: NewFlashcardFormState = {
    japaneseWord: "",
    romaji: "",
    vietnameseMeaning: "",
    exampleSentence: "",
    publicImageId: "",
    imageFile: null,
    listId: listId || "",
  };
  const [newFlashcard, setNewFlashcard] = useState<NewFlashcardFormState>(
    initialNewFlashcardState
  );
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof NewFlashcardFormState, string>>
  >({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!listId) {
      setError("Không tìm thấy ID của bộ flashcard.");
      setLoading(false);
      return;
    }
    const fetchFlashcardsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFlashcards(listId);
        setFlashcards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("Không thể tải flashcards cho bộ này. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardsData();
  }, [listId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFlashcard((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof NewFlashcardFormState]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFlashcard((prev) => ({ ...prev, imageFile: file }));
      setPreviewImage(URL.createObjectURL(file));
      if (validationErrors.imageFile) {
        setValidationErrors((prev) => ({ ...prev, imageFile: undefined }));
      }
    } else {
      setNewFlashcard((prev) => ({ ...prev, imageFile: null }));
      setPreviewImage(null);
    }
  };

  const validateAddForm = (): boolean => {
    const errors: Partial<Record<keyof NewFlashcardFormState, string>> = {};
    if (!newFlashcard.japaneseWord.trim())
      errors.japaneseWord = "Từ tiếng Nhật là bắt buộc.";
    if (!newFlashcard.romaji.trim()) errors.romaji = "Romaji là bắt buộc.";
    if (!newFlashcard.vietnameseMeaning.trim())
      errors.vietnameseMeaning = "Nghĩa tiếng Việt là bắt buộc.";
    if (!newFlashcard.exampleSentence.trim())
      errors.exampleSentence = "Câu ví dụ là bắt buộc.";
    if (!newFlashcard.imageFile)
      errors.imageFile = "Ảnh minh họa là bắt buộc khi thêm mới.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listId || !validateAddForm()) return;

    setIsAdding(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("japaneseWord", newFlashcard.japaneseWord);
      formData.append("romaji", newFlashcard.romaji);
      formData.append("vietnameseMeaning", newFlashcard.vietnameseMeaning);
      formData.append("exampleSentence", newFlashcard.exampleSentence);
      formData.append("publicImageId", newFlashcard.publicImageId);
      formData.append("listId", listId);
      if (newFlashcard.imageFile) {
        formData.append("imageFile", newFlashcard.imageFile);
      }

      const response: ApiResponse = await addFlashcard(formData);
      if (response && !response.error && response.data) {
        setFlashcards((prev) => [response.data as Flashcard, ...prev]);
        setNewFlashcard(initialNewFlashcardState);
        setPreviewImage(null);
      } else {
        throw new Error("Phản hồi từ server không hợp lệ.");
      }
    } catch (err) {
      console.error("Error adding flashcard:", err);
      setError("Thêm flashcard thất bại. Vui lòng thử lại.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa flashcard này?")) return;

    setError(null);
    try {
      await deleteFlashcard(flashcardId);
      setFlashcards((prev) => prev.filter((f) => f.id !== flashcardId));
    } catch (err) {
      console.error("Error deleting flashcard:", err);
      setError("Xóa flashcard thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewFlashcardDetails = (flashcardId: string) => {
    navigate(`/admin/flashcard/edit/${flashcardId}?listId=${listId}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8F7F0] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/admin/flashcard`)}
            className="p-2.5 mr-3 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Quay lại danh sách bộ"
          >
            {BackIcon({ size: 20 })}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý Flashcards{" "}
            <span className="text-xl text-red-600">
              (Bộ: {listId || "Không xác định"})
            </span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 text-center text-red-700 bg-red-100 rounded-lg shadow">
            {error}
          </div>
        )}

        <form
          onSubmit={handleAddFlashcard}
          className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-5"
        >
          <h2 className="text-xl font-semibold text-red-700 mb-5">
            Thêm Flashcard mới vào bộ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label
                htmlFor="japaneseWord"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Từ tiếng Nhật <span className="text-red-500">*</span>
              </label>
              <input
                id="japaneseWord"
                type="text"
                name="japaneseWord"
                value={newFlashcard.japaneseWord}
                onChange={handleInputChange}
                className={`w-full p-2.5 border rounded-lg text-sm ${validationErrors.japaneseWord ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
              />
              {validationErrors.japaneseWord && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.japaneseWord}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="romaji"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Romaji <span className="text-red-500">*</span>
              </label>
              <input
                id="romaji"
                type="text"
                name="romaji"
                value={newFlashcard.romaji}
                onChange={handleInputChange}
                className={`w-full p-2.5 border rounded-lg text-sm ${validationErrors.romaji ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
              />
              {validationErrors.romaji && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.romaji}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="vietnameseMeaning"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Nghĩa tiếng Việt <span className="text-red-500">*</span>
              </label>
              <input
                id="vietnameseMeaning"
                type="text"
                name="vietnameseMeaning"
                value={newFlashcard.vietnameseMeaning}
                onChange={handleInputChange}
                className={`w-full p-2.5 border rounded-lg text-sm ${validationErrors.vietnameseMeaning ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
              />
              {validationErrors.vietnameseMeaning && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.vietnameseMeaning}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="exampleSentence"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Câu ví dụ <span className="text-red-500">*</span>
              </label>
              <input
                id="exampleSentence"
                type="text"
                name="exampleSentence"
                value={newFlashcard.exampleSentence}
                onChange={handleInputChange}
                className={`w-full p-2.5 border rounded-lg text-sm ${validationErrors.exampleSentence ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
              />
              {validationErrors.exampleSentence && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.exampleSentence}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="imageFileAdd"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Ảnh minh họa <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Xem trước file mới"
                    className="h-20 w-20 object-cover rounded-md mr-4 border"
                  />
                )}
                <label
                  htmlFor="imageFileAdd"
                  className={`cursor-pointer flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-red-400 ${validationErrors.imageFile ? "border-red-500" : "border-gray-300"}`}
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    {UploadIcon({ className: "w-8 h-8 mb-1 text-gray-400" })}
                    <p className="mb-1 text-xs text-gray-500">
                      <span className="font-semibold">Nhấn để tải lên</span>
                    </p>
                    {newFlashcard.imageFile && (
                      <p className="text-xs text-green-600">
                        {newFlashcard.imageFile.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="imageFileAdd"
                    type="file"
                    className="sr-only"
                    name="imageFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </label>
              </div>
              {validationErrors.imageFile && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.imageFile}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="publicImageId"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Public Image ID (Cloudinary - Tùy chọn)
              </label>
              <input
                id="publicImageId"
                type="text"
                name="publicImageId"
                value={newFlashcard.publicImageId}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isAdding || loading}
            className="w-full sm:w-auto mt-3 flex items-center justify-center px-6 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-400"
          >
            {AddIcon({ className: "mr-2" })}
            {isAdding ? "Đang thêm..." : "Thêm Flashcard"}
          </button>
        </form>

        <h2 className="text-xl font-semibold text-gray-800 mb-5 mt-10">
          Danh sách Flashcards trong bộ
        </h2>
        {loading && !error && (
          <div className="text-center p-8 text-gray-600">
            Đang tải flashcards...
          </div>
        )}
        {!loading &&
          (flashcards.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow-md border border-gray-200">
              {EmptyIcon({ className: "mx-auto text-5xl text-gray-400 mb-4" })}
              <p className="text-lg">Bộ này chưa có flashcard nào.</p>
              <p className="text-sm">
                Hãy sử dụng form ở trên để thêm flashcard mới.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Ảnh
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tiếng Nhật
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Romaji
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nghĩa
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-w-xs truncate">
                        Ví dụ
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {flashcards.map((fc) => (
                      <tr
                        key={fc.id}
                        className="hover:bg-red-50 transition-colors duration-150"
                      >
                        <td className="px-5 py-3 whitespace-nowrap">
                          {fc.imageUrl ? (
                            <img
                              src={fc.imageUrl}
                              alt={fc.japaneseWord}
                              className="h-10 w-14 object-cover rounded border border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                              {ImageIcon({ size: 18 })}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fc.japaneseWord}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600">
                          {fc.romaji}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600">
                          {fc.vietnameseMeaning}
                        </td>
                        <td
                          className="px-5 py-3 text-sm text-gray-600 max-w-xs truncate"
                          title={fc.exampleSentence}
                        >
                          {fc.exampleSentence}
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewFlashcardDetails(fc.id)}
                              className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors"
                              title="Sửa chi tiết"
                            >
                              {DetailIcon({ size: 16 })}
                            </button>
                            <button
                              onClick={() => handleDeleteFlashcard(fc.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                              title="Xóa flashcard"
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
          ))}
      </div>
    </div>
  );
};

export default ManageFlashcards;