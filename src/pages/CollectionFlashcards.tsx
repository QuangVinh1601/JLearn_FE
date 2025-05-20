import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPersonalFlashcardLists, createPersonalFlashcardList } from "../api/apiClient";
function CollectionFlashcards() {
  const navigate = useNavigate();
  interface Collection {
    id: any;
    title: string;
    description: string;
  }
  const [collections, setCollections] = useState<Collection[]>([]); // State to store collections with proper typing
  const [loading, setLoading] = useState(true); // State to handle loading
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Define fetchCollections at component level so it can be reused
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const result = await getPersonalFlashcardLists(); // Use the method from apiClient.js
      console.log("API Response:", result); // Debugging log

      // Map the result to the desired format
      setCollections(
        result.map((item: any) => ({
          id: item.listId,
          title: item.listName,
          description: item.description || "No description available",
        }))
      );
    } catch (error) {
      console.error("Error fetching flashcard collections:", error);
      setCollections([]);
    } finally {
      setLoading(false);
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
      // Call API to create new collection
      const result = await createPersonalFlashcardList(newListName, newDescription);
      console.log("New collection created:", result);

      // Reset form and close modal
      setNewListName("");
      setNewDescription("");
      setShowModal(false);

      // Fetch collections again to get the updated list including the newly created one
      fetchCollections();
    } catch (error) {
      console.error("Error creating new collection:", error);
      alert("Failed to create collection. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }
  return (
    <>
      <p className="font-bold text-2xl ">Bộ sưu tập thẻ ghi nhớ </p>
      <div className="flex justify-center mb-6">
        <button
          className="bg-red-500 text-white h-8 w-28 px-4 py-1 rounded-3xl hover:bg-red-600"
          onClick={() => setShowModal(true)}
        >
          Tạo mới +
        </button>
      </div>
      <div className="grid grid-cols-4 gap-6 mx-auto">
        {collections.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
            onClick={() => {
              navigate(`/create-flash-card/${item.id}`, {
                state: {
                  listId: item.id,
                  listName: item.title
                }
              });
            }}
          >
            <h3 className="text-lg font-semibold text-green-700">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
      {/* Modal for creating a new collection */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Tạo bộ sưu tập mới</h3>

            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="listName">
                  Tên bộ sưu tập
                </label>
                <input
                  id="listName"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nhập tên bộ sưu tập"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nhập mô tả (tùy chọn)"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newListName.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {submitting ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default CollectionFlashcards;
