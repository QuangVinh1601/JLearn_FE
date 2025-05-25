import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createAd, updateAd } from "../../../api/apiClient";

const getCurrentAdminId = (): string => {
  return "F8795D3E-2CF8-4EED-7D53-08DD94841365";
};

interface Ad {
  id: string;
  title: string;
  formFile: string | File;
  createdBy: string;
  publicImageId: string;
}

const EditAd: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const MAX_LENGTH = 255;
  const [details, setDetails] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    formFile: "",
    publicImageId: "",
  });

  useEffect(() => {
    const adData = (location.state as { ad: Ad })?.ad;
    if (adData && (!id || adData.id === id)) {
      setDetails(adData);
      setLoading(false);
    } else if (!id) {
      setDetails({
        id: `${Date.now()}`,
        title: "",
        formFile: "",
        createdBy: getCurrentAdminId(),
        publicImageId: "",
      });
      setLoading(false);
    } else {
      setError("Không tìm thấy thông tin quảng cáo");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (details && e.target.files) {
      setDetails({
        ...details,
        formFile: e.target.files[0],
      });
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      title: "",
      formFile: "",
      publicImageId: "",
    };

    if (!details?.title.trim()) {
      errors.title = "Yêu cầu nhập tiêu đề";
    } else if (details.title.length > MAX_LENGTH) {
      errors.title = `Tiêu đề không được vượt quá ${MAX_LENGTH} ký tự`;
    }

    if (
      !id &&
      (!details?.formFile ||
        (typeof details.formFile === "string" && !details.formFile))
    ) {
      errors.formFile = "Yêu cầu tải lên file khi thêm mới";
    }

    if (id && !details?.publicImageId.trim()) {
      errors.publicImageId = "Yêu cầu nhập Public Image ID khi chỉnh sửa";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    if (!validateForm()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id", details.id);
      formData.append("AdTitle", details.title);
      if (details.formFile instanceof File) {
        formData.append("FormFile", details.formFile);
      } else if (
        !id &&
        typeof details.formFile === "string" &&
        details.formFile
      ) {
        formData.append("FormFile", details.formFile);
      }
      formData.append("CreatedBy", details.createdBy);
      if (details.publicImageId) {
        formData.append("PublicImageId", details.publicImageId);
      }

      // Kiểm tra FormData mà không dùng entries()
      console.log("FormData - AdTitle:", formData.get("AdTitle"));
      console.log("FormData - FormFile:", formData.get("FormFile"));
      console.log("FormData - CreatedBy:", formData.get("CreatedBy"));
      console.log("FormData - PublicImageId:", formData.get("PublicImageId"));

      if (id) {
        await updateAd(id, formData);
        alert("Cập nhật quảng cáo thành công!");
      } else {
        await createAd(formData);
        alert("Thêm quảng cáo thành công!");
      }
      navigate("/admin/ads", { state: { updatedAd: details } });
    } catch (error) {
      console.error("Lỗi khi lưu quảng cáo:", error);
      alert("Lưu quảng cáo thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto border-2 border-gray-400 rounded-lg shadow-md bg-white p-4 sm:p-6">
        {loading && <p className="text-center">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && details && (
          <form onSubmit={handleSave}>
            <h1 className="text-xl sm:text-2xl font-bold mb-6">
              {id ? "Chỉnh sửa Quảng Cáo" : "Thêm Quảng Cáo Mới"}
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
                File
              </label>
              {id &&
                typeof details.formFile === "string" &&
                details.formFile && (
                  <p className="text-sm text-gray-600 mb-1">
                    File hiện tại: {details.formFile}
                  </p>
                )}
              <input
                type="file"
                name="formFile"
                onChange={handleFileChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.formFile
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.formFile && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.formFile}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm sm:text-base font-semibold">
                Public Image ID
              </label>
              <input
                type="text"
                name="publicImageId"
                value={details.publicImageId}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  validationErrors.publicImageId
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.publicImageId && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {validationErrors.publicImageId}
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
                {saving
                  ? id
                    ? "Đang lưu..."
                    : "Đang thêm..."
                  : "Lưu Thay Đổi"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/ads")}
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

export default EditAd;
