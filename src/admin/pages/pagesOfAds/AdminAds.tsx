import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAds, deleteAd } from "../../../api/apiClient";

interface Ad {
  adID: string;
  adTitle: string;
  urlImage?: string;
  PublicImageId?: string | null;
  creator?: string | null;
  createdBy?: string;
  learningContentsAds?: string | null;
}

const AdminAd: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await getAds();
        console.log("Fetched Ads Response:", response); // Kiểm tra toàn bộ phản hồi
        const data = response.data; // Truy cập mảng quảng cáo từ response.data
        setAds(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quảng cáo:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();

    const updatedAd = (location.state as { updatedAd: Ad })?.updatedAd;
    if (updatedAd) {
      setAds((prevAds) => {
        const exists = prevAds.some((ad) => ad.adID === updatedAd.adID);
        if (exists) {
          return prevAds.map((ad) =>
            ad.adID === updatedAd.adID ? updatedAd : ad,
          );
        } else {
          return [...prevAds, updatedAd];
        }
      });
    }
  }, [location.state]);

  const handleAdd = () => {
    navigate("/admin/ads/add");
  };

  const handleEdit = (ad: Ad) => {
    navigate(`/admin/ad/edit/${ad.adID}`, { state: { ad } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quảng cáo này?")) {
      try {
        await deleteAd(id);
        setAds((prevAds) => prevAds.filter((ad) => ad.adID !== id));
        alert("Xóa quảng cáo thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa quảng cáo:", error);
        alert("Xóa quảng cáo thất bại!");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = ads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ads.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Quản lý Quảng Cáo</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          Thêm Quảng Cáo
        </button>
      </div>

      {loading && <div className="text-center">Đang tải...</div>}

      {!loading && (
        <>
          {currentAds.length === 0 ? (
            <div className="text-center text-gray-500">
              Không có quảng cáo nào để hiển thị.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentAds.map((ad, index) => (
                      <tr key={ad.adID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {ad.adTitle}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {ad.urlImage ? (
                            <a
                              href={ad.urlImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {ad.urlImage}
                            </a>
                          ) : (
                            "Không có file"
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(ad)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(ad.adID)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAd;
