import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createLearningContent, getAds, } from "../../../api/apiClient";
import { FaSave } from "react-icons/fa";
import { FaExclamationCircle, FaArrowLeft, FaVideo } from "react-icons/fa";

const SaveIcon = FaSave;
const ErrorIcon = FaExclamationCircle;
const BackIcon = FaArrowLeft;
const VideoFileIcon = FaVideo;

// Interface cho Learning Content (Video)
interface LearningContentData {
  id?: string; // ID của LearningContent, có khi tạo mới, undefined khi sửa
  title: string;
  adId: string; // ID của Ad được liên kết
  formFile: File | null; // File video
  publicVideoId?: string; // Public ID của video trên Cloudinary (nếu có)
  uploadedBy: string; // ID của người tải lên
  urlVideo?: string; // URL để xem video, dùng cho preview khi edit
}

// Interface cho Ad (để hiển thị trong select box)
interface AdOption {
  adID: string; // API của bạn trả về adID
  adTitle: string;
}


// --- Mock API functions (thay thế bằng API thật của bạn) ---
const MOCK_DELAY_EDIT_VIDEO = 500;
let mockAdsForSelect: AdOption[] = [
  { adID: "ad1", adTitle: "Quảng cáo Khai giảng N5" },
  { adID: "ad2", adTitle: "Quảng cáo Sách Kanji" },
  { adID: "ad3", adTitle: "Ưu đãi học phí hè" },
];

// Local mock video contents (used for editing/testing)
let mockVideoContents: LearningContentData[] = [];

const mockGetLearningContentById = async (id: string): Promise<LearningContentData | undefined> => {
  return new Promise(resolve => setTimeout(() => {
    // Tìm trong mockVideoContents của AdminVideo.tsx, cần điều chỉnh interface cho phù hợp
    const foundVideo = mockVideoContents.find((v: LearningContentData) => v.id === id);
    if (foundVideo) {
      resolve({
        id: foundVideo.id,
        title: foundVideo.title,
        adId: foundVideo.adId || "", // Giả sử VideoContent có adId
        formFile: null, // Không lấy file cũ
        publicVideoId: "", // Cần API trả về publicVideoId nếu có
        uploadedBy: foundVideo.uploadedBy || getCurrentAdminId(),
        urlVideo: foundVideo.urlVideo,
      });
    } else resolve(undefined);
  }, MOCK_DELAY_EDIT_VIDEO));
}

const mockUpdateLearningContent = async (id: string, data: FormData): Promise<{ data: LearningContentData }> => {
  return new Promise(resolve => setTimeout(() => {
    const index = mockVideoContents.findIndex((v: LearningContentData) => v.id === id);
    const updatedVideo: LearningContentData = {
      id: id,
      title: data.get('title') as string,
      adId: data.get('adId') as string,
      formFile: null, // Không lưu file vào mock
      publicVideoId: data.get('publicVideoId') as string || undefined,
      uploadedBy: data.get('uploadedBy') as string,
      // Giả sử urlVideo được cập nhật ở backend sau khi upload file mới
      urlVideo: `https://res.cloudinary.com/demo/video/upload/updated_${Date.now()}.mp4`
    };
    if (index !== -1) mockVideoContents[index] = updatedVideo;
    else mockVideoContents.unshift(updatedVideo); // Nếu không tìm thấy, thêm mới (logic này có thể không đúng)
    resolve({ data: updatedVideo });
  }, MOCK_DELAY_EDIT_VIDEO));
}

const mockCreateLearningContent = async (data: FormData): Promise<{ data: LearningContentData }> => {
  return new Promise(resolve => setTimeout(() => {
    const newVideo: LearningContentData = {
      id: `vid${Date.now()}`,
      title: data.get('title') as string,
      adId: data.get('adId') as string,
      formFile: null, // Không lưu file vào mock
      publicVideoId: data.get('publicVideoId') as string || undefined,
      uploadedBy: data.get('uploadedBy') as string,
      urlVideo: `https://res.cloudinary.com/demo/video/upload/new_${Date.now()}.mp4` // Giả lập URL video
    };
    mockVideoContents.unshift(newVideo); // Thêm vào đầu danh sách mock
    resolve({ data: newVideo });
  }, MOCK_DELAY_EDIT_VIDEO));
};

const mockGetAds = async (): Promise<{ data: AdOption[] }> => {
  return new Promise(resolve => setTimeout(() => resolve({ data: mockAdsForSelect }), MOCK_DELAY_EDIT_VIDEO));
}

// Hàm này nên lấy từ context hoặc một nơi quản lý global state/config
const getCurrentAdminId = (): string => {
  return "F8795D3E-2CF8-4EED-7D53-08DD94841365"; // ID admin giả định
};

const MAX_TITLE_LENGTH = 255;

const EditVideo: React.FC = () => {
  const { contentId } = useParams<{ contentId?: string }>(); // contentId là ID của video, optional
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState<LearningContentData>({
    title: "",
    adId: "",
    formFile: null,
    publicVideoId: "",
    uploadedBy: getCurrentAdminId(),
    urlVideo: ""
  });
  const [ads, setAds] = useState<AdOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    adId: "",
    formFile: "",
    publicVideoId: "", // Có thể không bắt buộc
  });

  const isEditMode = Boolean(contentId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const adsResponse = await getAds(); // API thật
        if (adsResponse && Array.isArray(adsResponse.data)) {
          setAds(adsResponse.data);
        } else {
          setAds([]);
          console.warn("Ads data is not in expected format:", adsResponse);
        }

        if (isEditMode && contentId) {
          const videoDataFromState = (location.state as { videoDetails?: LearningContentData })?.videoDetails;
          if (videoDataFromState && videoDataFromState.id === contentId) {
            setDetails({ ...videoDataFromState, formFile: null }); // Không set file cũ, publicVideoId có thể cần từ API
            if (videoDataFromState.urlVideo) setPreviewVideo(videoDataFromState.urlVideo);
          } else {
            // const contentResponse = await getLearningContentById(contentId); // API thật
            const contentResponse = await mockGetLearningContentById(contentId); // Mock
            if (contentResponse) {
              setDetails({ ...contentResponse, formFile: null });
              if (contentResponse.urlVideo) setPreviewVideo(contentResponse.urlVideo);
            } else {
              setError(`Không tìm thấy video với ID: ${contentId}`);
            }
          }
        } else { // Chế độ thêm mới
          setDetails({
            title: "",
            adId: "", // Để trống cho người dùng chọn
            formFile: null,
            publicVideoId: "",
            uploadedBy: getCurrentAdminId(),
            urlVideo: ""
          });
          setPreviewVideo(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu cho form video:", err);
        setError("Không thể tải dữ liệu cần thiết. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contentId, isEditMode, location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDetails((prev) => ({ ...prev, formFile: file }));
      setPreviewVideo(URL.createObjectURL(file));
      if (validationErrors.formFile) {
        setValidationErrors((prev) => ({ ...prev, formFile: "" }));
      }
    } else { // Nếu hủy chọn file
      setDetails((prev) => ({ ...prev, formFile: null }));
      // Nếu đang edit và có urlVideo cũ, hiển thị lại preview cũ, nếu không thì null
      setPreviewVideo(isEditMode ? details.urlVideo || null : null);
    }
  };

  const validateForm = (): boolean => {
    if (!details) return false;
    const errors = { title: "", adId: "", formFile: "", publicVideoId: "" };
    let isValid = true;

    if (!details.title.trim()) {
      errors.title = "Tiêu đề video không được để trống.";
      isValid = false;
    } else if (details.title.length > MAX_TITLE_LENGTH) {
      errors.title = `Tiêu đề không quá ${MAX_TITLE_LENGTH} ký tự.`;
      isValid = false;
    }

    if (!details.adId) { // adId là bắt buộc phải chọn
      errors.adId = "Vui lòng chọn một quảng cáo để liên kết.";
      isValid = false;
    }

    // Khi thêm mới, file video là bắt buộc
    if (!isEditMode && !details.formFile) {
      errors.formFile = "Vui lòng chọn một file video.";
      isValid = false;
    }
    // publicVideoId có thể không bắt buộc

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !validateForm()) return;

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", details.title);
    formData.append("adId", details.adId);
    if (details.formFile) { // Chỉ append nếu có file mới (khi thêm mới hoặc khi sửa và chọn file mới)
      formData.append("formFile", details.formFile);
    }
    formData.append("uploadedBy", details.uploadedBy);
    if (details.publicVideoId) { // Backend có thể tự tạo nếu không gửi
      formData.append("publicVideoId", details.publicVideoId);
    }

    try {
      let response;
      if (isEditMode && contentId) {
        // response = await updateLearningContent(contentId, formData); // API Thật
        response = await mockUpdateLearningContent(contentId, formData); // Mock
      } else {
        // response = await createLearningContent(formData); // API Thật
        response = await mockCreateLearningContent(formData); // Mock
      }

      if (response && response.data) {
        // alert(isEditMode ? "Cập nhật video thành công!" : "Thêm video thành công!");
        navigate("/admin/video", { state: { updatedContent: response.data } });
      } else {
        throw new Error("Phản hồi từ server không hợp lệ.");
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu video:", err);
      setError(err.message || "Lưu video thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Đang tải dữ liệu...</div>;
  }

  if (error && !details?.title) { // Nếu có lỗi nghiêm trọng và không có details để hiển thị form
    return (
      <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-red-300 text-center">
          {ErrorIcon({ className: "mx-auto h-12 w-12 text-red-500 mb-4" })}
          <h2 className="text-xl font-semibold text-red-700 mb-2">Không thể tải form</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/admin/video')}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {BackIcon({ className: "mr-2" })} Quay lại danh sách video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-8 text-center">
          {isEditMode ? "Chỉnh sửa Video Học Tập" : "Thêm Video Học Tập Mới"}
        </h1>

        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg shadow flex items-start">
            {ErrorIcon({ className: "h-5 w-5 mr-3 mt-0.5 flex-shrink-0" })}
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Tiêu đề Video <span className="text-red-500">*</span>
            </label>
            <input
              id="title" type="text" name="title" value={details.title} onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.title ? "border-red-500 text-red-700" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
            />
            {validationErrors.title && <p className="text-red-500 text-xs mt-1.5">{validationErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="adId" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Liên kết Quảng cáo <span className="text-red-500">*</span>
            </label>
            <select
              id="adId" name="adId" value={details.adId} onChange={handleInputChange}
              className={`w-full p-3 border bg-white rounded-lg text-sm ${validationErrors.adId ? "border-red-500 text-red-700" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
            >
              <option value="">-- Chọn một quảng cáo --</option>
              {ads.map((ad) => (
                <option key={ad.adID} value={ad.adID}>
                  {ad.adTitle} (ID: {ad.adID.substring(0, 8)}...)
                </option>
              ))}
            </select>
            {validationErrors.adId && <p className="text-red-500 text-xs mt-1.5">{validationErrors.adId}</p>}
          </div>

          <div>
            <label htmlFor="formFile" className="block mb-1.5 text-sm font-semibold text-gray-700">
              File Video {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors hover:border-red-400 ${validationErrors.formFile ? 'border-red-500' : 'border-gray-300'}">
              <div className="space-y-1 text-center">
                {previewVideo ? (
                  <video key={previewVideo} controls src={previewVideo} className="mx-auto h-32 max-w-full rounded-md border bg-gray-100">
                    Trình duyệt không hỗ trợ video preview.
                  </video>
                ) : (
                  VideoFileIcon({ className: "mx-auto h-12 w-12 text-gray-400" })
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="formFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 px-1"
                  >
                    <span>{details.formFile ? details.formFile.name : (isEditMode && details.urlVideo ? "Thay đổi file video" : "Chọn file video")}</span>
                    <input id="formFile" name="formFile" type="file" className="sr-only" onChange={handleFileChange} accept="video/*" />
                  </label>
                  {!details.formFile && <p className="pl-1">hoặc kéo thả</p>}
                </div>
                <p className="text-xs text-gray-500">MP4, WEBM, OGG. Tối đa 50MB.</p>
                {isEditMode && details.urlVideo && !details.formFile && (
                  <p className="text-xs text-gray-500 mt-1">Video hiện tại: <a href={details.urlVideo} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">{details.urlVideo.split('/').pop()}</a></p>
                )}
              </div>
            </div>
            {validationErrors.formFile && <p className="text-red-500 text-xs mt-1.5">{validationErrors.formFile}</p>}
          </div>

          <div>
            <label htmlFor="publicVideoId" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Public Video ID (Cloudinary - Tùy chọn)
            </label>
            <input
              id="publicVideoId" type="text" name="publicVideoId" value={details.publicVideoId || ""} onChange={handleInputChange}
              placeholder="Để trống nếu muốn hệ thống tự tạo"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:ring-red-500"
            />
            {validationErrors.publicVideoId && <p className="text-red-500 text-xs mt-1.5">{validationErrors.publicVideoId}</p>}
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-400"
            >
              {SaveIcon({ className: "mr-2" })}
              {saving ? (isEditMode ? "Đang cập nhật..." : "Đang thêm...") : (isEditMode ? "Lưu thay đổi" : "Thêm Video")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/video")}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-70"
            >
              {BackIcon({ className: "mr-2" })} Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideo;