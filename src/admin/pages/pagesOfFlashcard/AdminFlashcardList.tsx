import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPersonalFlashcardList,
  getPersonalFlashcardLists,
  deletePersonalFlashcardList,
} from "../../../api/apiClient";

interface FlashcardList {
  listID: string;
  listName: string;
  description: string; // Added description field
}

const AdminFlashcardList: React.FC = () => {
  const [flashcardLists, setFlashcardLists] = useState<FlashcardList[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchFlashcardLists = async () => {
      try {
        const response = await fetch(
          "http://34.44.254.240:8080/api/personal-flashcard",
          {
            credentials: "include",
          },
        );
        const result = await response.json();
        setFlashcardLists(
          result.data.map((item: FlashcardList) => ({
            listID: item.listID,
            listName: item.listName,
            description: item.description, // Added description mapping
          })),
        );
      } catch (error) {
        console.error("Error fetching flashcard lists:", error);
        setFlashcardLists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcardLists();
  }, []);

  const handleCreateList = async () => {
    try {
      const listName = prompt("Nhập tên danh sách mới:");
      const description = prompt("Nhập mô tả cho danh sách mới:"); // Added description prompt
      if (listName && description) {
        const response = await fetch(
          "http://34.44.254.240:8080/api/personal-flashcard",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ listName, description }), // Added description to the request body
          },
        );
        const newList = await response.json();
        setFlashcardLists((prevLists) => [...prevLists, newList]);
        alert("Tạo danh sách thành công!");
      }
    } catch (error) {
      console.error("Error creating flashcard list:", error);
      alert("Không thể tạo danh sách mới. Vui lòng thử lại!");
    }
  };

  const handleEditList = (list: FlashcardList) => {
    const newName = prompt("Nhập tên mới cho danh sách:", list.listName);
    const newDescription = prompt(
      "Nhập mô tả mới cho danh sách:",
      list.description,
    ); // Added description prompt for edit
    if (newName !== list.listName || newDescription !== list.description) {
      setFlashcardLists((prevLists) =>
        prevLists.map((l) =>
          l.listID === list.listID
            ? {
                ...l,
                listName: newName || l.listName,
                description: newDescription || l.description,
              }
            : l,
        ),
      );
      alert("Cập nhật danh sách thành công!");
    }
  };

  const handleDeleteList = async (listID: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh sách này?")) {
      try {
        await fetch(`http://34.44.254.240:8080/api/flashcards/${listID}`, {
          method: "DELETE",
          credentials: "include",
        });
        setFlashcardLists((prevLists) =>
          prevLists.filter((list) => list.listID !== listID),
        );
        alert("Xóa danh sách thành công!");
      } catch (error) {
        console.error("Error deleting flashcard list:", error);
        alert("Xóa danh sách thất bại!");
      }
    }
  };

  const handleViewFlashcards = (listID: string) => {
    if (!listID) {
      alert("List ID không hợp lệ. Vui lòng thử lại!");
      return;
    }
    navigate(`/admin/flashcard/list/${listID}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLists = flashcardLists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flashcardLists.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          Quản lý PersonalFlashcardList
        </h1>
        <button
          onClick={handleCreateList}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          Tạo PersonalFlashcardList
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {!loading && flashcardLists.length === 0 && (
        <div className="text-center text-red-500 mb-4">
          Chưa có danh sách nào. Vui lòng tạo PersonalFlashcardList!
        </div>
      )}

      {!loading && flashcardLists.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên danh sách
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>{" "}
                  {/* Added description column */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLists.map((list, index) => (
                  <tr key={list.listID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {list.listName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {list.description} {/* Display description */}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewFlashcards(list.listID)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-sm"
                        >
                          Xem Flashcards
                        </button>
                        <button
                          onClick={() => handleEditList(list)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteList(list.listID)}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    </div>
  );
};

export default AdminFlashcardList;
