import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getFlashcards,
  deleteFlashcard,
  createPersonalFlashcardList,
} from "../../../api/apiClient";

interface Flashcard {
  id: string;
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId?: string;
  listId?: string;
}

const AdminFlashcard: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const listId = new URLSearchParams(location.search).get("listId");
      if (!listId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getFlashcards(listId);
        setFlashcards(
          data.map((item: any) => ({
            id: item.flashcardId,
            japaneseWord: item.japaneseWord,
            romaji: item.romaji,
            vietnameseMeaning: item.vietnameseMeaning,
            exampleSentence: item.exampleSentence,
            publicImageId: item.publicImageId,
            listId: listId,
          })),
        );
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();

    const updatedFlashcard = (location.state as { updatedFlashcard: Flashcard })
      ?.updatedFlashcard;
    if (updatedFlashcard) {
      setFlashcards((prevFlashcards) => {
        const exists = prevFlashcards.some(
          (fc) => fc.id === updatedFlashcard.id,
        );
        if (exists) {
          return prevFlashcards.map((fc) =>
            fc.id === updatedFlashcard.id ? updatedFlashcard : fc,
          );
        } else {
          return [...prevFlashcards, updatedFlashcard];
        }
      });
    }
  }, [location.search, location.state]);

  const handleAdd = () => {
    const listId = new URLSearchParams(location.search).get("listId");
    if (!listId) {
      alert("Vui lòng tạo PersonalFlashcardList trước!");
      return;
    }
    navigate(`/admin/flashcard/add?listId=${listId}`);
  };

  const handleEdit = (flashcard: Flashcard) => {
    navigate(`/admin/flashcard/edit/${flashcard.id}`, { state: { flashcard } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa flashcard này?")) {
      try {
        await deleteFlashcard(id);
        setFlashcards((prevFlashcards) =>
          prevFlashcards.filter((fc) => fc.id !== id),
        );
        alert("Xóa flashcard thành công!");
      } catch (error) {
        console.error("Error deleting flashcard:", error);
        alert("Xóa flashcard thất bại!");
      }
    }
  };

  const handleCreateList = async () => {
    try {
      const listName = prompt("Nhập tên danh sách mới:");
      if (listName) {
        const newList = await createPersonalFlashcardList(listName);
        navigate(`/admin/flashcard?listId=${newList.listId}`);
      }
    } catch (error) {
      alert("Không thể tạo danh sách mới. Vui lòng thử lại!");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFlashcards = flashcards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flashcards.length / itemsPerPage);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Quản lý Flashcard</h1>
        <button
          onClick={handleCreateList}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          Tạo PersonalFlashcardList
        </button>
      </div>

      {!loading && !new URLSearchParams(location.search).get("listId") && (
        <div className="text-center text-red-500 mb-4">
          Vui lòng tạo PersonalFlashcardList trước để quản lý flashcard!
        </div>
      )}

      {loading && <div className="text-center">Loading...</div>}

      {!loading && new URLSearchParams(location.search).get("listId") && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiếng Nhật
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Romaji
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nghĩa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentFlashcards.map((flashcard) => (
                  <tr key={flashcard.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {flashcard.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {flashcard.japaneseWord}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {flashcard.romaji}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {flashcard.vietnameseMeaning}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(flashcard)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(flashcard.id)}
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

          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
          >
            Thêm Flashcard
          </button>
        </>
      )}
    </div>
  );
};

export default AdminFlashcard;
