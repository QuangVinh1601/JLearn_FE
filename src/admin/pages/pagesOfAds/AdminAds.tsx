import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAds, deleteAd } from "../../../api/apiClient"; // Giả sử đường dẫn đúng
import {
  FaPlus as AddIcon,
  FaEdit as EditIcon,
  FaTrashAlt as DeleteIcon, // Sử dụng FaTrashAlt cho biểu tượng rác rõ ràng hơn
  FaAngleLeft as PrevIcon,
  FaAngleRight as NextIcon,
  FaExclamationCircle as EmptyIcon,
} from "react-icons/fa";

interface Ad {
  adID: string;
  adTitle: string;
  urlImage?: string;
  PublicImageId?: string | null;
  creator?: string | null; // Giữ lại nếu API trả về
  createdBy?: string; // Giữ lại nếu API trả về
  learningContentsAds?: string | null; // Giữ lại nếu API trả về
}

const ITEMS_PER_PAGE = 5;

const AdminAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAdsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAds();
        // API của bạn trả về { message: string, data: Ad[] }
        // Nên chúng ta cần truy cập response.data để lấy mảng ads
        if (response && Array.isArray(response.data)) {
          setAds(response.data);
        } else {
          console.warn("Fetched ads data is not in the expected format:", response);
          setAds([]); // Đặt thành mảng rỗng nếu dữ liệu không đúng định dạng
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách quảng cáo:", err);
        setError("Không thể tải danh sách quảng cáo. Vui lòng thử lại sau.");
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdsData();
  }, []);


  useEffect(() => {
    // Xử lý khi có ad được cập nhật từ trang EditAd
    const updatedAdState = (location.state as { updatedAd?: Ad })?.updatedAd;
    if (updatedAdState) {
      setAds((prevAds) => {
        const exists = prevAds.some((ad) => ad.adID === updatedAdState.adID);
        if (exists) {
          return prevAds.map((ad) =>
            ad.adID === updatedAdState.adID ? updatedAdState : ad
          );
        }
        // Nếu là ad mới (không có id trong danh sách cũ), thêm vào đầu danh sách
        return [updatedAdState, ...prevAds.filter(ad => ad.adID !== updatedAdState.adID)];
      });
      // Xóa state sau khi sử dụng
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);


  const handleAdd = () => {
    navigate("/admin/ads/add");
  };

  const handleEdit = (ad: Ad) => {
    // API của bạn có vẻ sử dụng adID, nên truyền adID
    navigate(`/admin/ad/edit/${ad.adID}`, { state: { adDetails: ad } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quảng cáo này?")) {
      try {
        await deleteAd(id);
        setAds((prevAds) => prevAds.filter((ad) => ad.adID !== id));
        // alert("Xóa quảng cáo thành công!"); // Có thể thay bằng toast notification
      } catch (err) {
        console.error("Lỗi khi xóa quảng cáo:", err);
        setError("Xóa quảng cáo thất bại. Có thể quảng cáo đang được sử dụng hoặc có lỗi máy chủ.");
        // alert("Xóa quảng cáo thất bại!");
      }
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentAds = ads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ads.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="p-8 text-center text-gray-700 bg-[#F8F7F0] min-h-screen">Đang tải danh sách quảng cáo...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8F7F0] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý Quảng Cáo
          </h1>
          <button
            className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {AddIcon({ className: "mr-2" })} Thêm Quảng Cáo
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hình ảnh/File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Public ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentAds.map((ad, index) => (
                  <tr key={ad.adID} className="hover:bg-red-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ad.adTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ad.urlImage ? (
                        <a
                          href={ad.urlImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline hover:text-sky-800"
                        >
                          Xem file
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                      {ad.PublicImageId || <span className="text-gray-400 italic">Không có</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(ad)}
                          className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors"
                          aria-label="Sửa quảng cáo"
                        >
                          {EditIcon({ size: 16 })}
                        </button>
                        <button
                          onClick={() => handleDelete(ad.adID)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                          aria-label="Xoá quảng cáo"
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
              aria-label="Trang trước"
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
              aria-label="Trang sau"
            >
              {NextIcon({ size: 20 })}
            </button>
          </div>
        )}

        {currentAds.length === 0 && !loading && !error && (
          <div className="text-center py-16 text-gray-500">
            {EmptyIcon({ className: "mx-auto text-5xl text-gray-400 mb-4" })}
            <p className="text-lg">Không có quảng cáo nào để hiển thị.</p>
            <p className="text-sm">Bạn có thể bắt đầu bằng cách <button onClick={handleAdd} className="text-red-600 hover:underline">thêm quảng cáo mới</button>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAds;