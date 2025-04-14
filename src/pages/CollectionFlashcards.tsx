import { useNavigate } from "react-router-dom";

function CollectionFlashcards() {
  const navigate = useNavigate();
  const collections = [
    {
      id: 1,
      title: "Từ vựng N5 - Bài 1",
      description: "20 từ vựng cơ bản",
      createdAt: "2025-04-01",
    },
    {
      id: 2,
      title: "Từ vựng N4 - Bài 2",
      description: "Từ vựng liên quan đến trường học",
      createdAt: "2025-03-28",
    },
    {
      id: 3,
      title: "Động từ nhóm 1 - N5",
      description: "Danh sách các động từ nhóm 1",
      createdAt: "2025-03-20",
    },
    {
      id: 2,
      title: "Từ vựng N4 - Bài 2",
      description: "Từ vựng liên quan đến trường học",
      createdAt: "2025-03-28",
    },
    {
      id: 3,
      title: "Động từ nhóm 1 - N5",
      description: "Danh sách các động từ nhóm 1",
      createdAt: "2025-03-20",
    },
  ];

  return (
    <>
      <p className="font-bold text-2xl ">Bộ sưu tập thẻ ghi nhớ </p>
      <div className="flex justify-center mb-6">
        <button
          className="bg-red-500 text-white h-8 w-28 px-4 py-1 rounded-3xl hover:bg-red-600"
          onClick={() => {
            navigate("/create-flash-card");
          }}
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
              navigate("/flashcards");
            }}
          >
            <h3 className="text-lg font-semibold text-green-700">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Tạo ngày: {item.createdAt}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
export default CollectionFlashcards;
