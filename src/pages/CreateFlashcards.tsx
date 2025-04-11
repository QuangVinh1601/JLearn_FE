import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Flashcard {
  word: string;
  meaning: string;
 
}

const CreateFlashcardSet: React.FC = () => {
  const navigate = useNavigate();
  const [setName, setSetName] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { word: "", meaning: "" },
  ]);

  const handleCardChange = (index: number, field: keyof Flashcard, value: string) => {
    const newCards = [...flashcards];
    newCards[index][field] = value;
    setFlashcards(newCards);
  };

  const addFlashcard = () => {
    if (flashcards.length < 20) {
      setFlashcards([...flashcards, { word: "", meaning: ""}]);
    }
  };
  const createCollection = () => {
    console.log(flashcards)
    navigate("/collection");
  };
  const removeFlashcard = (index: number) => {
    const newCards = flashcards.filter((_, i) => i !== index);
    setFlashcards(newCards);
  };

  return (
    <div className="min-h-screen bg-[#F8F1E5] p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo bộ flashcard</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tên bộ thẻ:</label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Nhập tên bộ thẻ ghi nhớ"
          />
        </div>

        <div className="space-y-4">
          {flashcards.map((card, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Từ vựng"
                value={card.word}
                onChange={(e) => handleCardChange(index, "word", e.target.value)}
                className="flex-1 p-2 border rounded-xl focus:outline-none"
              />
              <input
                type="text"
                placeholder="Nghĩa"
                value={card.meaning}
                onChange={(e) => handleCardChange(index, "meaning", e.target.value)}
                className="flex-1 p-2 border rounded-xl focus:outline-none"
              />
              <button
                onClick={() => removeFlashcard(index)}
                className="text-red-500 font-bold text-xl px-2 hover:scale-110 transition"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={addFlashcard}
            disabled={flashcards.length >= 20}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
          >
            + Thêm từ
          </button>

          <button
            className="px-6 py-2 text-white rounded-xl transition"
            style={{ backgroundColor: "#F04532" }}
              onClick={createCollection}
                    >
            Tạo bộ thẻ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardSet;