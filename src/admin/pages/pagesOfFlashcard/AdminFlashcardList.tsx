import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPersonalFlashcardList,
  getPersonalFlashcardLists,
  deletePersonalFlashcardList,
} from "../../../api/apiClient";

interface FlashcardList {
  listId: string;
  listName: string;
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
<<<<<<< HEAD:src/admin/pages/pagesOfFlashcard/AdminFlashcard.tsx
        const response = await fetch("http://localhost/api/personal-flashcard", {
          credentials: "include"
        });
        const result = await response.json();
        setFlashcardLists(
          result.data.map((item: any) => ({
            listId: item.listId,
            listName: item.listName,
          }))
        );
=======
        const data = await getPersonalFlashcardLists();
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          setFlashcardLists(data);
        } else {
          console.error("Unexpected API response format:", data);
          setFlashcardLists([]);
        }
>>>>>>> 32e996bfe63b08741c2faa79f60976b545e73b3b:src/admin/pages/pagesOfFlashcard/AdminFlashcardList.tsx
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
      if (listName) {
<<<<<<< HEAD:src/admin/pages/pagesOfFlashcard/AdminFlashcard.tsx
        const response = await fetch("http://localhost/api/personal-flashcard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ listName }),
        });
        const newList = await response.json();
        setFlashcardLists((prevLists) => [...prevLists, newList]);
=======
        const newList = await createPersonalFlashcardList(listName);
        console.log("New List Response:", newList);
        if (!newList || !newList.listId) {
          console.error("listId is undefined or response is invalid:", newList);
          alert(
            "Tạo danh sách thành công nhưng không lấy được listId. Vui lòng kiểm tra lại!",
          );
          return;
        }
        setFlashcardLists((prevLists) => [
          ...prevLists,
          {
            listId: newList.listId,
            listName: newList.listName,
          },
        ]);
>>>>>>> 32e996bfe63b08741c2faa79f60976b545e73b3b:src/admin/pages/pagesOfFlashcard/AdminFlashcardList.tsx
        alert("Tạo danh sách thành công!");
      }
    } catch (error) {
      console.error("Error creating flashcard list:", error);
      alert("Không thể tạo danh sách mới. Vui lòng thử lại!");
    }
  };

  const handleEditList = (list: FlashcardList) => {
    const newName = prompt("Nhập tên mới cho danh sách:", list.listName);
    if (newName && newName !== list.listName) {
      setFlashcardLists((prevLists) =>
        prevLists.map((l) =>
          l.listId === list.listId ? { ...l, listName: newName } : l,
        ),
      );
      alert("Cập nhật danh sách thành công!");
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh sách này?")) {
      try {
        await fetch(`http://localhost/api/flashcards/${listId}`, {
          method: "DELETE",
          credentials: "include",
        });
        setFlashcardLists((prevLists) =>
          prevLists.filter((list) => list.listId !== listId)
        );
        alert("Xóa danh sách thành công!");
      } catch (error) {
        console.error("Error deleting flashcard list:", error);
        alert("Xóa danh sách thất bại!");
      }
    }
  };

  const handleViewFlashcards = (listId: string) => {
    if (!listId) {
      alert("List ID không hợp lệ. Vui lòng thử lại!");
      return;
    }
    navigate(`/admin/flashcard/list/${listId}`);
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
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentLists.map((list, index) => (
                  <tr key={list.listId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {list.listName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewFlashcards(list.listId)}
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
                          onClick={() => handleDeleteList(list.listId)}
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
