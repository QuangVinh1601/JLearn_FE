import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaListAlt,
  FaAngleLeft,
  FaAngleRight,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  createPersonalFlashcardList,
  updatePersonalFlashcardList,
  deletePersonalFlashcardList,
  getPersonalFlashcardLists,
} from "../../../api/apiClient"; // Import API functions

const AddIcon = FaPlus;
const EditIcon = FaEdit;
const DeleteIcon = FaTrashAlt;
const ViewIcon = FaListAlt;
const PrevIcon = FaAngleLeft;
const NextIcon = FaAngleRight;
const EmptyIcon = FaExclamationCircle;

interface FlashcardList {
  listID: string;
  listName: string;
  description: string;
}

const ITEMS_PER_PAGE = 5;

const AdminFlashcardList: React.FC = () => {
  const [flashcardLists, setFlashcardLists] = useState<FlashcardList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      setError(null);
      try {
        const lists = await getPersonalFlashcardLists();
        setFlashcardLists(
          lists.map((list: any) => ({
            listID: list.listID,
            listName: list.listName,
            description: list.description,
          }))
        );
      } catch (err) {
        setError("Không thể tải danh sách flashcard. Vui lòng thử lại.");
        setFlashcardLists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    const listName = prompt("Nhập tên danh sách mới:");
    if (!listName) return;
    const description = prompt("Nhập mô tả cho danh sách (có thể để trống):", "") || "";

    if (!listName.trim()) {
      setError("Tên danh sách không được để trống.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newList = await createPersonalFlashcardList(listName, description);
      if (newList) {
        setFlashcardLists((prevLists) => [
          { listID: newList.listId, listName: newList.listName, description: newList.description },
          ...prevLists,
        ]);
      } else {
        throw new Error("Failed to create list");
      }
    } catch (err) {
      console.error("Error creating flashcard list:", err);
      setError("Không thể tạo danh sách mới. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditList = async (list: FlashcardList) => {
    if (!list || !list.listID || !list.listName) {
      console.error("Invalid list object:", list);
      setError("Danh sách không hợp lệ. Vui lòng thử lại.");
      return;
    }
  
    console.log("Editing list:", list);
  
    const newName = prompt("Nhập tên mới cho danh sách:", list.listName);
    if (newName === null) return;
    const newDescription = prompt("Nhập mô tả mới cho danh sách:", list.description) || "";
  
    if (!newName.trim()) {
      setError("Tên danh sách không được để trống.");
      return;
    }
  
    if (newName === list.listName && newDescription === list.description) return;
  
    setLoading(true);
    setError(null);
    try {
      await updatePersonalFlashcardList(list.listID, newName, newDescription);
      const lists = await getPersonalFlashcardLists();
      setFlashcardLists(
        lists.map((list: any) => ({
          listID: list.listID, // Sử dụng listID nhất quán
          listName: list.listName,
          description: list.description,
        }))
      );
      alert("Cập nhật danh sách thành công")
    } catch (err) {
      console.error("Error updating flashcard list:", err);
      setError("Cập nhật danh sách thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listID: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh sách này? Tất cả flashcard trong danh sách cũng sẽ bị xóa.")) return;

    setLoading(true);
    setError(null);
    try {
      await deletePersonalFlashcardList(listID);
      setFlashcardLists((prevLists) => prevLists.filter((list) => list.listID !== listID));
    } catch (err) {
      console.error("Error deleting flashcard list:", err);
      setError("Xóa danh sách thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFlashcards = (listID: string) => {
    if (!listID) {
      setError("List ID không hợp lệ. Vui lòng thử lại!");
      return;
    }
    navigate(`/admin/flashcard/list/${listID}`);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentLists = flashcardLists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flashcardLists.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#F8F7F0] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý Bộ Flashcard
          </h1>
          <button
            onClick={handleCreateList}
            disabled={loading}
            className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-400"
          >
            {AddIcon({ className: "mr-2" })} Tạo bộ mới
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 text-center text-red-700 bg-red-100 rounded-lg shadow">
            {error}
          </div>
        )}
        {loading && !error && (
          <div className="text-center p-8 text-gray-600">
            Đang tải danh sách...
          </div>
        )}

        {!loading && (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tên bộ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentLists.map((list, index) => (
                      <tr
                        key={list.listID}
                        className="hover:bg-red-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {list.listName}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 max-w-md truncate"
                          title={list.description}
                        >
                          {list.description || (
                            <span className="italic text-gray-400">
                              Không có mô tả
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => handleViewFlashcards(list.listID)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                              title="Xem Flashcards"
                            >
                              {ViewIcon({ size: 16 })}
                            </button>
                            <button
                              onClick={() => handleEditList(list)}
                              className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-full transition-colors"
                              title="Sửa tên/mô tả bộ"
                            >
                              {EditIcon({ size: 16 })}
                            </button>
                            <button
                              onClick={() => handleDeleteList(list.listID)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                              title="Xóa bộ"
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
                    ${
                      currentPage === index + 1
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-red-50 border border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Trang sau"
                >
                  {NextIcon({ size: 20 })}
                </button>
              </div>
            )}
            {currentLists.length === 0 && !loading && !error && (
              <div className="text-center py-16 text-gray-500">
                {EmptyIcon({
                  className: "mx-auto text-5xl text-gray-400 mb-4",
                })}
                <p className="text-lg">Chưa có bộ flashcard nào.</p>
                <p className="text-sm">
                  Hãy{" "}
                  <button
                    onClick={handleCreateList}
                    className="text-red-600 hover:underline"
                  >
                    tạo bộ mới
                  </button>{" "}
                  để bắt đầu.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminFlashcardList;