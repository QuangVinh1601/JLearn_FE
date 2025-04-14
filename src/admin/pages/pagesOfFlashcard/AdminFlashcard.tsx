import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Flashcard {
  id: string;
  japanese: string;
  meaning: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    japanese: "こんにちは",
    meaning: "Xin chào",
  },
  {
    id: "2",
    japanese: "ありがとう",
    meaning: "Cảm ơn",
  },
  {
    id: "3",
    japanese: "りんご",
    meaning: "Quả táo",
  },
];

const AdminFlashcard: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      setFlashcards(mockFlashcards);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
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
  }, [location.state]);

  const handleAdd = () => {
    navigate("/admin/flashcard/add");
  };

  const handleEdit = (flashcard: Flashcard) => {
    navigate(`/admin/flashcard/edit/${flashcard.id}`, { state: { flashcard } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa flashcard này?")) {
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((fc) => fc.id !== id),
      );
      alert("Xóa flashcard thành công!");
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
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          Thêm Flashcard
        </button>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {!loading && (
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{flashcard.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{flashcard.japanese}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{flashcard.meaning}</td>
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
        </>
      )}
    </div>
  );
};

export default AdminFlashcard;