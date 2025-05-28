import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createLearningContent, updateLearningContent, getAds, getLearningContents } from "../../../api/apiClient";
import { FaSave, FaExclamationCircle, FaArrowLeft, FaVideo } from "react-icons/fa";

const SaveIcon = FaSave;
const ErrorIcon = FaExclamationCircle;
const BackIcon = FaArrowLeft;
const VideoFileIcon = FaVideo;

interface LearningContentData {
  id?: string;
  title: string;
  adId: string;
  formFile: File | null;
  publicVideoId?: string;
  uploadedBy: string;
  urlVideo?: string;
}

interface AdOption {
  adID: string;
  adTitle: string;
}

interface ApiResponse {
  error?: unknown;
  data?: LearningContentData;
}

const getCurrentAdminId = (): string => {
  return "F8795D3E-2CF8-4EED-7D53-08DD94841365";
};

const MAX_TITLE_LENGTH = 255;

const EditVideo: React.FC = () => {
  const { contentId } = useParams<{ contentId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState<LearningContentData>({
    title: "",
    adId: "",
    formFile: null,
    publicVideoId: "",
    uploadedBy: getCurrentAdminId(),
    urlVideo: "",
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
    publicVideoId: "",
  });

  const isEditMode = Boolean(contentId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const adsResponse = await getAds();
        if (adsResponse && Array.isArray(adsResponse.data)) {
          setAds(adsResponse.data);
        } else {
          setAds([]);
          console.warn("Ads data is not in expected format:", adsResponse);
        }

        if (isEditMode && contentId) {
          const videoDataFromState = (
            location.state as { videoDetails?: LearningContentData }
          )?.videoDetails;
          if (videoDataFromState && videoDataFromState.id === contentId) {
            setDetails({ ...videoDataFromState, formFile: null });
            if (videoDataFromState.urlVideo)
              setPreviewVideo(videoDataFromState.urlVideo);
          } else {
            const contentResponse = await getLearningContents();
            if (contentResponse && Array.isArray(contentResponse.data)) {
              const foundVideo = contentResponse.data.find(
                (video: LearningContentData) => video.id === contentId
              );
              if (foundVideo) {
                setDetails({ ...foundVideo, formFile: null });
                if (foundVideo.urlVideo)
                  setPreviewVideo(foundVideo.urlVideo);
              } else {
                setError(`Không tìm thấy video với ID: ${contentId}`);
              }
            } else {
              setError(`Không thể tải dữ liệu video với ID: ${contentId}`);
            }
          }
        } else {
          setDetails({
            title: "",
            adId: "",
            formFile: null,
            publicVideoId: "",
            uploadedBy: getCurrentAdminId(),
            urlVideo: "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    } else {
      setDetails((prev) => ({ ...prev, formFile: null }));
      setPreviewVideo(isEditMode ? details.urlVideo || null : null);
    }
  };

  const validateForm = (): boolean => {
    if (!details) return false;
    const errors = { title: "", adId: "", formFile: "", publicVideoId: "" };
    let isValid = true;

    if (!details.adId.trim()) {
      errors.adId = "Yêu cầu chọn Ad ID";
      isValid = false;
    }

    if (!details.title.trim()) {
      errors.title = "Yêu cầu nhập tiêu đề";
      isValid = false;
    } else if (details.title.length > MAX_TITLE_LENGTH) {
      errors.title = `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự`;
      isValid = false;
    }

    if (!isEditMode && !details.formFile) {
      errors.formFile = "Yêu cầu tải lên file khi thêm mới";
      isValid = false;
    }

    if (isEditMode && !details.publicVideoId?.trim()) {
      errors.publicVideoId = "Yêu cầu nhập Public Video ID khi chỉnh sửa";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !validateForm()) return;

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("adId", details.adId);
    formData.append("title", details.title);
    if (details.formFile instanceof File) {
      formData.append("formFile", details.formFile);
    }
    formData.append("uploadedBy", details.uploadedBy);
    if (details.publicVideoId) {
      formData.append("publicImageId", details.publicVideoId);
    }

    console.log("FormData - adId:", formData.get("adId"));
    console.log("FormData - title:", formData.get("title"));
    console.log("FormData - formFile:", formData.get("formFile"));
    console.log("FormData - uploadedBy:", formData.get("uploadedBy"));
    console.log("FormData - publicImageId:", formData.get("publicImageId"));

    try {
      let response: ApiResponse;
      if (isEditMode && contentId) {
        response = await updateLearningContent(contentId, formData);
      } else {
        response = await createLearningContent(formData);
      }

      if (response && !response.error) {
        setDetails((prev) =>
          prev ? { ...prev, adId: response.data?.adId || prev.adId } : prev
        );
        alert("Thêm video thành công!"); 
        navigate("/admin/video", { state: { updatedContent: response.data || details } });
      } else {
        throw new Error("Phản hồi từ server không hợp lệ.");
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu video:", err);
      setError(
        "Lưu video thất bại! Kiểm tra console log để biết chi tiết."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error && !details?.title) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-red-300 text-center">
          {ErrorIcon({ className: "mx-auto h-12 w-12 text-red-500 mb-4" })}
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Không thể tải form
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/admin/video")}
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
            <label
              htmlFor="title"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Tiêu đề Video <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={details.title}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.title ? "border-red-500 text-red-700" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="adId"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Liên kết Quảng cáo <span className="text-red-500">*</span>
            </label>
            <select
              id="adId"
              name="adId"
              value={details.adId}
              onChange={handleInputChange}
              disabled={isEditMode}
              className={`w-full p-3 border bg-white rounded-lg text-sm ${validationErrors.adId ? "border-red-500 text-red-700" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
            >
              <option value="">-- Chọn một quảng cáo --</option>
              {ads.map((ad) => (
                <option key={ad.adID} value={ad.adID}>
                  {ad.adTitle} (ID: {ad.adID.substring(0, 8)}...)
                </option>
              ))}
            </select>
            {validationErrors.adId && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.adId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="formFile"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              File Video{" "}
              {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors hover:border-red-400 ${validationErrors.formFile ? 'border-red-500' : 'border-gray-300'}`}>
              <div className="space-y-1 text-center">
                {previewVideo ? (
                  <video
                    key={previewVideo}
                    controls
                    src={previewVideo}
                    className="mx-auto h-32 max-w-full rounded-md border bg-gray-100"
                  >
                    Trình duyệt không hỗ trợ video preview.
                  </video>
                ) : (
                  VideoFileIcon({
                    className: "mx-auto h-12 w-12 text-gray-400",
                  })
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="formFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 px-1"
                  >
                    <span>
                      {details.formFile
                        ? details.formFile.name
                        : isEditMode && details.urlVideo
                          ? "Thay đổi file video"
                          : "Chọn file video"}
                    </span>
                    <input
                      id="formFile"
                      name="formFile"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="video/*"
                    />
                  </label>
                  {!details.formFile && <p className="pl-1">hoặc kéo thả</p>}
                </div>
                <p className="text-xs text-gray-500">
                  MP4, WEBM, OGG. Tối đa 50MB.
                </p>
                {isEditMode && details.urlVideo && !details.formFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    Video hiện tại:{" "}
                    <a
                      href={details.urlVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:underline"
                    >
                      {details.urlVideo.split("/").pop()}
                    </a>
                  </p>
                )}
              </div>
            </div>
            {validationErrors.formFile && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.formFile}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="publicVideoId"
              className="block mb-1.5 text-sm font-semibold text-gray-700"
            >
              Public Video ID (Cloudinary - Tùy chọn)
            </label>
            <input
              id="publicVideoId"
              type="text"
              name="publicVideoId"
              value={details.publicVideoId || ""}
              onChange={handleInputChange}
              placeholder="Để trống nếu muốn hệ thống tự tạo"
              className={`w-full p-3 border rounded-lg text-sm ${validationErrors.publicVideoId ? "border-red-500 text-red-700" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
            />
            {validationErrors.publicVideoId && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.publicVideoId}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-400"
            >
              {SaveIcon({ className: "mr-2" })}
              {saving
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang thêm..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Thêm Video"}
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