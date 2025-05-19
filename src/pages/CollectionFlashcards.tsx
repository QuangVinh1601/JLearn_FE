import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getPersonalFlashcardLists,
  createPersonalFlashcardList,
  deletePersonalFlashcardList,
} from "../api/apiClient";

function CollectionFlashcards() {
  const navigate = useNavigate();
  interface Collection {
    id: any;
    title: string;
    description: string;
  }
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCollections = async () => {
    try {
      const result = await getPersonalFlashcardLists();
      console.log("API Response:", result);
      setCollections(
        result.map((item: any) => ({
          id: item.listId,
          title: item.listName,
          description: item.description || "No description available",
        })),
      );
    } catch (error) {
      console.error("Error fetching flashcard collections:", error);
      setCollections([]);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      setSubmitting(true);
      const result = await createPersonalFlashcardList(
        newListName,
        newDescription,
      );
      console.log("New collection created:", result);
      toast.success("Tạo bộ sưu tập thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      setNewListName("");
      setNewDescription("");
      setShowModal(false);
      fetchCollections();
    } catch (error) {
      console.error("Error creating new collection:", error);
      toast.error("Failed to create collection. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollection = async (listId: any) => {
    if (!window.confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) return;

    try {
      setSubmitting(true);
      await deletePersonalFlashcardList(listId);
      console.log(`Đã xóa bộ sưu tập ID: ${listId}`);
      toast.success("Xóa bộ sưu tập thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchCollections();
    } catch (error) {
      console.error("Lỗi khi xóa bộ sưu tập:", error);
      toast.error("Không thể xóa bộ sưu tập. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#F8F1E5] p-6 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Bộ sưu tập thẻ ghi nhớ</h1>
      <div className="flex justify-end mb-8">
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Tạo mới
        </button>
      </div>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.length > 0 ? (
            collections.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  navigate(`/create-flash-card/${item.id}`, {
                    state: { listId: item.id, listName: item.title },
                  });
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(item.id);
                    }}
                    disabled={submitting}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              Không có bộ sưu tập nào. Hãy tạo mới!
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold text-red-600 mb-4">
              Tạo bộ sưu tập mới
            </h3>
            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="listName"
                >
                  Tên bộ sưu tập
                </label>
                <input
                  id="listName"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập tên bộ sưu tập"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="description"
                >
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập mô tả (tùy chọn)"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newListName.trim()}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionFlashcards;
