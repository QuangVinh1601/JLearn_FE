import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFlashcards,
  addFlashcard,
  deleteFlashcard,
} from "../../../api/apiClient";

interface Flashcard {
  id: string;
  japaneseWord: string;
  romaji: string;
  vietnameseMeaning: string;
  exampleSentence: string;
  publicImageId?: string;
  listId: string;
  imageFile?: File; // Add imageFile to the interface
}

const ManageFlashcards: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFlashcard, setNewFlashcard] = useState<Partial<Flashcard>>({
    listId: listId || "",
  });

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcards(listId || "");
        setFlashcards(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [listId]);

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newFlashcard.japaneseWord ||
      !newFlashcard.romaji ||
      !newFlashcard.vietnameseMeaning ||
      !newFlashcard.exampleSentence ||
      !newFlashcard.imageFile // Ensure ImageFile is provided
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc, bao gồm ImageFile!");
      return;
    }

    try {
      const formData = {
        japaneseWord: newFlashcard.japaneseWord,
        romaji: newFlashcard.romaji,
        vietnameseMeaning: newFlashcard.vietnameseMeaning,
        exampleSentence: newFlashcard.exampleSentence,
        publicImageId: newFlashcard.publicImageId || "",
        listId: listId || "",
        imageFile: newFlashcard.imageFile,
      };

      const addedFlashcard = await addFlashcard(formData);
      setFlashcards((prev) => [...prev, addedFlashcard]);
      setNewFlashcard({ listId: listId || "" });
      alert("Thêm flashcard thành công!");
    } catch (error) {
      console.error("Error adding flashcard:", error);
      alert("Thêm flashcard thất bại!");
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa flashcard này?")) {
      try {
        await deleteFlashcard(id);
        setFlashcards((prev) => prev.filter((f) => f.id !== id));
        alert("Xóa flashcard thành công!");
      } catch (error) {
        console.error("Error deleting flashcard:", error);
        alert("Xóa flashcard thất bại!");
      }
    }
  };

  const handleViewFlashcardDetails = (flashcardId: string) => {
    navigate(`/admin/flashcard/edit/${flashcardId}?listId=${listId}`);
  };

  if (loading) return <div className="text-center">Đang tải...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        Quản lý Flashcards (List ID: {listId || "undefined"})
      </h1>

      <form
        onSubmit={handleAddFlashcard}
        className="mb-6 p-4 border rounded-lg bg-gray-50"
      >
        <h2 className="text-lg font-semibold mb-4">Thêm Flashcard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Tiếng Nhật</label>
            <input
              type="text"
              value={newFlashcard.japaneseWord || ""}
              onChange={(e) =>
                setNewFlashcard({
                  ...newFlashcard,
                  japaneseWord: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Romaji</label>
            <input
              type="text"
              value={newFlashcard.romaji || ""}
              onChange={(e) =>
                setNewFlashcard({ ...newFlashcard, romaji: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Nghĩa</label>
            <input
              type="text"
              value={newFlashcard.vietnameseMeaning || ""}
              onChange={(e) =>
                setNewFlashcard({
                  ...newFlashcard,
                  vietnameseMeaning: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Câu ví dụ</label>
            <input
              type="text"
              value={newFlashcard.exampleSentence || ""}
              onChange={(e) =>
                setNewFlashcard({
                  ...newFlashcard,
                  exampleSentence: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">ImageFile</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewFlashcard({ ...newFlashcard, imageFile: file });
                }
              }}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">PublicImageId (Optional)</label>
            <input
              type="text"
              value={newFlashcard.publicImageId || ""}
              onChange={(e) =>
                setNewFlashcard({
                  ...newFlashcard,
                  publicImageId: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Thêm
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                STT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tiếng Nhật
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Romaji
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nghĩa
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Câu ví dụ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flashcards.map((flashcard, index) => (
              <tr key={flashcard.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {index + 1}
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
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {flashcard.exampleSentence}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleViewFlashcardDetails(flashcard.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleDeleteFlashcard(flashcard.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate(`/admin/flashcard`)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Quay lại
      </button>
    </div>
  );
};

export default ManageFlashcards;
