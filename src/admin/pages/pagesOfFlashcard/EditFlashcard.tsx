import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// Giả sử các hàm API này đã được tạo và hoạt động đúng
// import { getFlashcard, updateFlashcard } from "../../../api/apiClient";
import { FaSave, FaTimesCircle, FaArrowLeft, FaImage, FaExclamationTriangle } from "react-icons/fa";

const SaveIcon = FaSave;
const ErrorIcon = FaTimesCircle;
const BackIcon = FaArrowLeft;
const ImageIcon = FaImage;
const WarningIcon = FaExclamationTriangle;

interface FlashcardData { // Dùng cho dữ liệu từ API (có thể khác với form state)
  flashcardId: string;
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId?: string | null; // API có thể trả về null
  imageUrl?: string | null; // API có thể trả về URL ảnh
  listId?: string; // Thêm để biết thuộc list nào
}

interface FlashcardFormState { // Dùng cho state của form
  id: string; // flashcardId
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId: string; // Trong form, nên là string rỗng thay vì null
  listId: string; // Bắt buộc phải có listId để điều hướng về
  imageFile: File | null; // Cho phép null
  currentImageUrl?: string; // Để hiển thị ảnh hiện tại
}

// --- Mock API functions (thay thế bằng API thật của bạn) ---
const MOCK_DELAY_FC = 300;
const mockFlashcardsDb: FlashcardData[] = [
  { flashcardId: "fc1_list1", listId: "list1", japaneseWord: "日本", romaji: "Nihon", vietnameseMeaning: "Nhật Bản", exampleSentence: "私は日本から来ました。", imageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Nihon", publicImageId: "sample/nihon" },
  { flashcardId: "fc2_list1", listId: "list1", japaneseWord: "学校", romaji: "Gakkou", vietnameseMeaning: "Trường học", exampleSentence: "学校へ行きます。", imageUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?Text=Gakkou", publicImageId: "sample/gakkou" },
];

const getFlashcard = async (flashcardId: string): Promise<FlashcardData> => {
  return new Promise((resolve, reject) => setTimeout(() => {
    const fc = mockFlashcardsDb.find(f => f.flashcardId === flashcardId);
    if (fc) resolve(fc);
    else reject(new Error("Flashcard not found"));
  }, MOCK_DELAY_FC));
};

const updateFlashcard = async (flashcardId: string, data: Partial<Omit<FlashcardFormState, 'id' | 'listId' | 'imageFile' | 'currentImageUrl'>> & { imageFile?: File | null }): Promise<FlashcardData> => {
  return new Promise((resolve, reject) => setTimeout(() => {
    const fcIndex = mockFlashcardsDb.findIndex(f => f.flashcardId === flashcardId);
    if (fcIndex > -1) {
      mockFlashcardsDb[fcIndex] = { ...mockFlashcardsDb[fcIndex], ...data, flashcardId: flashcardId };
      // Simulate image upload and getting new URL if imageFile is present
      if (data.imageFile) {
        mockFlashcardsDb[fcIndex].imageUrl = `https://via.placeholder.com/150/0000FF/FFFFFF?Text=${data.japaneseWord || 'NewImg'}`;
        mockFlashcardsDb[fcIndex].publicImageId = `sample/new_${data.japaneseWord || 'img'}`;
      }
      resolve(mockFlashcardsDb[fcIndex]);
    } else {
      reject(new Error("Failed to update flashcard"));
    }
  }, MOCK_DELAY_FC));
};
// --- End Mock API functions ---

const EditFlashcard: React.FC = () => {
  const { id: flashcardId } = useParams<{ id: string }>(); // ID của flashcard cần sửa
  const navigate = useNavigate();
  const location = useLocation(); // Để lấy listId từ query params

  const [details, setDetails] = useState<FlashcardFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    japaneseWord: "",
    romaji: "",
    vietnameseMeaning: "",
    exampleSentence: "",
  });

  useEffect(() => {
    const listIdFromQuery = new URLSearchParams(location.search).get("listId");

    if (!flashcardId) {
      setError("ID Flashcard không hợp lệ.");
      setLoading(false);
      return;
    }
    if (!listIdFromQuery) {
      setError("Thiếu ID của bộ flashcard. Không thể tiếp tục.");
      setLoading(false);
      return;
    }

    const fetchFlashcardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFlashcard(flashcardId); // API call
        setDetails({
          id: data.flashcardId,
          japaneseWord: data.japaneseWord,
          romaji: data.romaji,
          vietnameseMeaning: data.vietnameseMeaning,
          exampleSentence: data.exampleSentence,
          publicImageId: data.publicImageId || "",
          listId: listIdFromQuery, // Lấy từ query param
          imageFile: null,
          currentImageUrl: data.imageUrl || undefined,
        });
        if (data.imageUrl) setPreviewImage(data.imageUrl);

      } catch (err) {
        console.error("Error fetching flashcard details:", err);
        setError("Không tìm thấy thông tin flashcard hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardData();
  }, [flashcardId, location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (details) {
      const { name, value } = e.target;
      setDetails({ ...details, [name]: value });
      if (validationErrors[name as keyof typeof validationErrors]) {
        setValidationErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (details && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDetails({ ...details, imageFile: file });
      setPreviewImage(URL.createObjectURL(file));
    } else if (details) { // Nếu bỏ chọn file
      setDetails({ ...details, imageFile: null });
      setPreviewImage(details.currentImageUrl || null); // Quay lại ảnh cũ (nếu có)
    }
  };

  const validateForm = (): boolean => {
    if (!details) return false;
    const errors = { japaneseWord: "", romaji: "", vietnameseMeaning: "", exampleSentence: "" };
    let isValid = true;

    if (!details.japaneseWord.trim()) { errors.japaneseWord = "Từ tiếng Nhật không được để trống."; isValid = false; }
    if (!details.romaji.trim()) { errors.romaji = "Romaji không được để trống."; isValid = false; }
    if (!details.vietnameseMeaning.trim()) { errors.vietnameseMeaning = "Nghĩa tiếng Việt không được để trống."; isValid = false; }
    if (!details.exampleSentence.trim()) { errors.exampleSentence = "Câu ví dụ không được để trống."; isValid = false; }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !validateForm()) return;

    setSaving(true);
    setError(null);
    try {
      // API updateFlashcard cần nhận flashcardId và FormData (nếu có file) hoặc object
      // Tạo FormData nếu có imageFile
      const payload: Partial<Omit<FlashcardFormState, 'id' | 'listId' | 'currentImageUrl'>> & { imageFile?: File | null } = {
        japaneseWord: details.japaneseWord,
        romaji: details.romaji,
        vietnameseMeaning: details.vietnameseMeaning,
        exampleSentence: details.exampleSentence,
        publicImageId: details.publicImageId,
      };
      if (details.imageFile) {
        payload.imageFile = details.imageFile;
      }

      await updateFlashcard(details.id, payload); // API call
      // alert("Cập nhật flashcard thành công!");
      navigate(`/admin/flashcard/list/${details.listId}`);
    } catch (err: any) {
      console.error("Error saving flashcard:", err);
      setError(err.message || "Lưu flashcard thất bại. Vui lòng thử lại.");
      // alert("Lưu flashcard thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Đang tải chi tiết flashcard...</div>;
  }

  if (error && !details) { // Lỗi nghiêm trọng, không load được details
    return (
      <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-red-300 text-center">
          {ErrorIcon({ className: "mx-auto h-12 w-12 text-red-500 mb-4" })}
          <h2 className="text-xl font-semibold text-red-700 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate(new URLSearchParams(location.search).get("listId") ? `/admin/flashcard/list/${new URLSearchParams(location.search).get("listId")}` : '/admin/flashcard')}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {BackIcon({ className: "mr-2" })} Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!details) { // Nếu details vẫn null sau khi loading xong (trường hợp hiếm)
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Không có dữ liệu flashcard.</div>;
  }


  return (
    <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-8 text-center">
          Chỉnh sửa Flashcard
        </h1>
        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg shadow flex items-start">
            {ErrorIcon({ className: "h-5 w-5 mr-3 mt-0.5 flex-shrink-0" })}
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="japaneseWord" className="block mb-1.5 text-sm font-semibold text-gray-700">Từ tiếng Nhật <span className="text-red-500">*</span></label>
            <input id="japaneseWord" type="text" name="japaneseWord" value={details.japaneseWord} onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.japaneseWord ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`} />
            {validationErrors.japaneseWord && <p className="text-red-500 text-xs mt-1.5">{validationErrors.japaneseWord}</p>}
          </div>

          <div>
            <label htmlFor="romaji" className="block mb-1.5 text-sm font-semibold text-gray-700">Romaji <span className="text-red-500">*</span></label>
            <input id="romaji" type="text" name="romaji" value={details.romaji} onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.romaji ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`} />
            {validationErrors.romaji && <p className="text-red-500 text-xs mt-1.5">{validationErrors.romaji}</p>}
          </div>

          <div>
            <label htmlFor="vietnameseMeaning" className="block mb-1.5 text-sm font-semibold text-gray-700">Nghĩa tiếng Việt <span className="text-red-500">*</span></label>
            <input id="vietnameseMeaning" type="text" name="vietnameseMeaning" value={details.vietnameseMeaning} onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.vietnameseMeaning ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`} />
            {validationErrors.vietnameseMeaning && <p className="text-red-500 text-xs mt-1.5">{validationErrors.vietnameseMeaning}</p>}
          </div>

          <div>
            <label htmlFor="exampleSentence" className="block mb-1.5 text-sm font-semibold text-gray-700">Câu ví dụ <span className="text-red-500">*</span></label>
            <textarea id="exampleSentence" name="exampleSentence" value={details.exampleSentence} onChange={handleInputChange} rows={3}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.exampleSentence ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`} />
            {validationErrors.exampleSentence && <p className="text-red-500 text-xs mt-1.5">{validationErrors.exampleSentence}</p>}
          </div>

          <div>
            <label htmlFor="imageFile" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Ảnh minh họa (Tùy chọn)
            </label>
            <div className="mt-1 flex items-center">
              {previewImage && (
                <img src={previewImage} alt="Xem trước" className="h-20 w-20 object-cover rounded-md mr-4 border" />
              )}
              <label htmlFor="imageFile" className="cursor-pointer flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 hover:border-red-400">
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  {ImageIcon({ className: "w-8 h-8 mb-1 text-gray-400" })}
                  <p className="mb-1 text-xs text-gray-500"><span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả</p>
                  {details.imageFile && <p className="text-xs text-green-600">{details.imageFile.name}</p>}
                </div>
                <input id="imageFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-yellow-600 mt-2 flex items-center">
              {WarningIcon({ className: "w-4 h-4 mr-1.5 flex-shrink-0" })}
              Lưu ý: API hiện tại có thể chưa hỗ trợ cập nhật file ảnh. Chức năng này cần backend hỗ trợ.
            </p>
          </div>

          <div>
            <label htmlFor="publicImageId" className="block mb-1.5 text-sm font-semibold text-gray-700">Public Image ID (Cloudinary)</label>
            <input id="publicImageId" type="text" name="publicImageId" value={details.publicImageId} onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:ring-red-500" />
          </div>


          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {SaveIcon({ className: "mr-2" })} {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/flashcard/list/${details.listId}`)}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-70"
            >
              {BackIcon({ className: "mr-2" })} Quay lại bộ flashcard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFlashcard;