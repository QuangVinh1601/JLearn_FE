import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createAd, updateAd } from "../../../api/apiClient"; // Giả sử đường dẫn đúng
import { FaSave, FaTimesCircle, FaArrowLeft, FaUpload, FaImage } from "react-icons/fa";

const SaveIcon = FaSave;
const ErrorIcon = FaTimesCircle;
const BackIcon = FaArrowLeft;
const UploadIcon = FaUpload;
const ImageIcon = FaImage;

// Hàm này nên lấy từ context hoặc một nơi quản lý global state/config
const getCurrentAdminId = (): string => {
  // ID này là giả định, bạn cần thay thế bằng logic lấy ID admin thực tế
  return "F8795D3E-2CF8-4EED-7D53-08DD94841365";
};

interface AdDetails {
  adID?: string; // Sửa: id thành adID cho phù hợp với list, hoặc để id nếu API createAd không cần adID
  adTitle: string;
  formFile: File | null; // Cho phép null nếu không chọn file mới khi edit
  createdBy: string;
  publicImageId: string; // Cho phép rỗng nếu API cho phép
  urlImage?: string; // Thêm để hiển thị ảnh hiện tại khi edit
}

const MAX_LENGTH = 255;

const EditAd: React.FC = () => {
  const { id: adIdFromParams } = useParams<{ id: string }>(); // Đổi tên id để rõ ràng hơn
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState<AdDetails>({
    adTitle: "",
    formFile: null,
    createdBy: getCurrentAdminId(),
    publicImageId: "",
    urlImage: "", // Khởi tạo
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    adTitle: "",
    formFile: "", // Validation cho file, ví dụ: bắt buộc khi thêm mới
    publicImageId: "",
  });

  const isEditMode = Boolean(adIdFromParams);

  useEffect(() => {
    setLoading(true);
    // Định nghĩa interface Ad dựa trên các trường bạn sử dụng
    interface Ad {
      adID: string;
      adTitle: string;
      createdBy: string;
      PublicImageId: string;
      urlImage?: string;
    }
    const adDataFromState = (location.state as { adDetails?: Ad })?.adDetails; // Sử dụng key adDetails đã truyền từ AdminAds

    if (isEditMode) {
      if (adDataFromState && adDataFromState.adID === adIdFromParams) {
        setDetails({
          adID: adDataFromState.adID,
          adTitle: adDataFromState.adTitle,
          formFile: null, // Không set file cũ, người dùng phải chọn file mới nếu muốn thay đổi
          createdBy: adDataFromState.createdBy || getCurrentAdminId(),
          publicImageId: adDataFromState.PublicImageId || "",
          urlImage: adDataFromState.urlImage, // Lấy urlImage từ state
        });
        if (adDataFromState.urlImage) {
          setPreviewImage(adDataFromState.urlImage);
        }
      } else {
        // Fetch ad details by adIdFromParams nếu không có trong state (cần API getAdById)
        setError("Không tìm thấy thông tin quảng cáo để chỉnh sửa. Vui lòng thử lại.");
        // Ví dụ: getAdById(adIdFromParams).then(data => setDetails(...)).catch(err => setError("..."))
      }
    } else { // Chế độ thêm mới
      setDetails({
        adTitle: "",
        formFile: null,
        createdBy: getCurrentAdminId(),
        publicImageId: "",
        urlImage: "",
      });
    }
    setLoading(false);
  }, [adIdFromParams, location.state, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev!, [name]: value }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDetails((prev) => ({ ...prev!, formFile: file }));
      setPreviewImage(URL.createObjectURL(file)); // Tạo preview cho ảnh mới chọn
      if (validationErrors.formFile) {
        setValidationErrors((prev) => ({ ...prev, formFile: "" }));
      }
    } else {
      setDetails((prev) => ({ ...prev!, formFile: null }));
      // Nếu xóa file đã chọn, quay lại preview ảnh cũ (nếu có và đang ở edit mode)
      setPreviewImage(isEditMode ? details.urlImage || null : null);
    }
  };

  const validateForm = (): boolean => {
    if (!details) return false;
    const errors = { adTitle: "", formFile: "", publicImageId: "" };
    let isValid = true;

    if (!details.adTitle.trim()) {
      errors.adTitle = "Tiêu đề quảng cáo không được để trống.";
      isValid = false;
    } else if (details.adTitle.length > MAX_LENGTH) {
      errors.adTitle = `Tiêu đề không quá ${MAX_LENGTH} ký tự.`;
      isValid = false;
    }

    // Khi thêm mới, file là bắt buộc
    if (!isEditMode && !details.formFile) {
      errors.formFile = "Vui lòng chọn một file ảnh/video cho quảng cáo.";
      isValid = false;
    }

    // PublicImageId có thể không bắt buộc tùy theo API của bạn
    // if (isEditMode && !details.publicImageId.trim()) { // Ví dụ nếu bắt buộc khi edit
    //   errors.publicImageId = "Public Image ID không được để trống khi chỉnh sửa.";
    //   isValid = false;
    // }


    setValidationErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !validateForm()) return;

    setSaving(true);
    setError(null);

    const formData = new FormData();
    // API của bạn có thể không cần 'id' khi tạo mới, hoặc có thể là 'adID'
    // Kiểm tra lại API spec của bạn
    if (isEditMode && details.adID) {
      formData.append("AdID", details.adID); // Hoặc 'id' tùy API
    }
    formData.append("AdTitle", details.adTitle);
    if (details.formFile) { // Chỉ append nếu có file mới
      formData.append("FormFile", details.formFile);
    }
    formData.append("CreatedBy", details.createdBy); // Backend có thể tự lấy user ID từ session
    formData.append("PublicImageId", details.publicImageId); // Ngay cả khi rỗng, nếu API cho phép


    try {
      let savedAdData;
      if (isEditMode && adIdFromParams) {
        savedAdData = await updateAd(adIdFromParams, formData); // API update trả về Ad đã cập nhật
      } else {
        savedAdData = await createAd(formData); // API create trả về Ad mới
      }
      // alert(isEditMode ? "Cập nhật quảng cáo thành công!" : "Thêm quảng cáo thành công!");
      navigate("/admin/ads", { state: { updatedAd: savedAdData.data || savedAdData } }); // Truyền dữ liệu ad đã lưu về list
    } catch (err: any) {
      console.error("Lỗi khi lưu quảng cáo:", err);
      setError(err.response?.data?.message || err.message || "Lưu quảng cáo thất bại. Vui lòng kiểm tra lại thông tin.");
      // alert("Lưu quảng cáo thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Đang tải thông tin quảng cáo...</div>;
  }


  if (!details && !isEditMode) { // Chỉ xảy ra nếu có lỗi logic khởi tạo state
    return <div className="p-8 text-center text-red-600 bg-red-50">Lỗi khởi tạo form. Vui lòng thử lại.</div>;
  }


  return (
    <div className="min-h-screen bg-[#F8F7F0] p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-700 mb-8 text-center">
          {isEditMode ? "Chỉnh sửa Quảng Cáo" : "Thêm Quảng Cáo Mới"}
        </h1>

        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg shadow flex items-start">
            {ErrorIcon({ className: "h-5 w-5 mr-3 mt-0.5 flex-shrink-0" })}
            <div>
              <p className="font-semibold">Đã xảy ra lỗi:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="adTitle" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Tiêu đề quảng cáo <span className="text-red-500">*</span>
            </label>
            <input
              id="adTitle"
              type="text"
              name="adTitle"
              value={details?.adTitle || ""}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg text-sm transition-colors
                ${validationErrors.adTitle
                  ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            />
            {validationErrors.adTitle && (
              <p className="text-red-500 text-xs mt-1.5">{validationErrors.adTitle}</p>
            )}
          </div>

          <div>
            <label htmlFor="formFile" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Tải lên File (Ảnh/Video) {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-red-400 transition-colors">
              <div className="space-y-1 text-center">
                {previewImage ? (
                  <img src={previewImage} alt="Xem trước" className="mx-auto h-32 w-auto object-contain rounded-md" />
                ) : (
                  ImageIcon({ className: "mx-auto h-12 w-12 text-gray-400" })
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="formFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                  >
                    <span>{details?.formFile ? details.formFile.name : (isEditMode && details?.urlImage ? "Thay đổi file" : "Chọn một file")}</span>
                    <input id="formFile" name="formFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" />
                  </label>
                  {!details?.formFile && <p className="pl-1">hoặc kéo thả vào đây</p>}
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 tối đa 10MB</p>
                {isEditMode && details?.urlImage && !details.formFile && (
                  <p className="text-xs text-gray-500 mt-1">File hiện tại: <a href={details.urlImage} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">{details.urlImage.split('/').pop()}</a></p>
                )}
              </div>
            </div>
            {validationErrors.formFile && (
              <p className="text-red-500 text-xs mt-1.5">{validationErrors.formFile}</p>
            )}
          </div>


          <div>
            <label htmlFor="publicImageId" className="block mb-1.5 text-sm font-semibold text-gray-700">
              Public Image ID (Nếu có, từ Cloudinary)
            </label>
            <input
              id="publicImageId"
              type="text"
              name="publicImageId"
              value={details?.publicImageId || ""}
              onChange={handleInputChange}
              placeholder="Ví dụ: folder_name/image_id"
              className={`w-full p-3 border rounded-lg text-sm transition-colors
                ${validationErrors.publicImageId // Thêm validation nếu cần
                  ? "border-red-500 text-red-700 focus:border-red-600 focus:ring-red-600"
                  : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                }`}
            />
            {validationErrors.publicImageId && (
              <p className="text-red-500 text-xs mt-1.5">{validationErrors.publicImageId}</p>
            )}
          </div>


          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {SaveIcon({ className: "mr-2" })}
              {saving ? (isEditMode ? "Đang cập nhật..." : "Đang thêm...") : (isEditMode ? "Lưu thay đổi" : "Thêm quảng cáo")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/ads")}
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

export default EditAd;