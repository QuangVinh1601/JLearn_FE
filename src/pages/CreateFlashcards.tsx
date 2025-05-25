import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getFlashcards, addFlashcard, deleteFlashcard } from "../api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faVolumeUp,
  faPlay,
  faPause,
  faTrash,
  faPencilAlt,
  faQuestionCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Flashcard {
  id?: string;
  word: string;
  meaning: string;
  romaji?: string;
  exampleSentence?: string;
  imageUrl?: string;
}

const CreateFlashcardSet: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { listId, listName } = location.state || {};
  const [setName, setSetName] = useState(listName || "");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceFlipped, setPracticeFlipped] = useState(false);
  const [practiceIsPlaying, setPracticeIsPlaying] = useState(false);
  const [practiceShowHint, setPracticeShowHint] = useState(false);

  // New flashcard form state
  const [newFlashcard, setNewFlashcard] = useState<Flashcard>({
    word: "",
    meaning: "",
    romaji: "",
    exampleSentence: "",
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (practiceIsPlaying && flashcards.length > 0) {
      interval = setInterval(() => {
        setPracticeFlipped(true);
        timeout = setTimeout(() => {
          handleNextPracticeCard();
        }, 2000);
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [practiceIsPlaying, flashcards.length]);

  // Add these helper functions for practice mode
  const handleNextPracticeCard = () => {
    setPracticeIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setPracticeFlipped(false);
    setPracticeShowHint(false);
  };

  const handlePrevPracticeCard = () => {
    setPracticeIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
    setPracticeFlipped(false);
    setPracticeShowHint(false);
  };

  const togglePracticeAutoPlay = () => {
    setPracticeIsPlaying(!practiceIsPlaying);
  };

  const getPartialHint = (hint: string) =>
    hint
      .split(" ")
      .map((w) => w[0] + "...")
      .join(" ");

  useEffect(() => {
    // If you have a list ID, fetch existing flashcards for this list
    if (id || listId) {
      const loadExistingFlashcards = async () => {
        try {
          setLoading(true);
          const existingCards = await getFlashcards(id || listId);
          if (existingCards && existingCards.length > 0) {
            setFlashcards(existingCards);
          }
          console.log("Loaded flashcards:", existingCards);
        } catch (error) {
          console.error("Error loading flashcards:", error);
          toast.error("Failed to load flashcards. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setLoading(false);
        }
      };

      loadExistingFlashcards();
    } else {
      setLoading(false);
    }
  }, [id, listId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetNewFlashcardForm = () => {
    setNewFlashcard({
      word: "",
      meaning: "",
      romaji: "",
      exampleSentence: "",
      imageUrl: "",
    });
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleAddFlashcard = async () => {
    if (!newFlashcard.word || !newFlashcard.meaning) {
      toast.error(
        "Please enter at least the Japanese word and Vietnamese meaning",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    try {
      setIsSubmitting(true);
      // Prepare flashcard data for API
      const flashcardData = {
        japaneseWord: newFlashcard.word,
        vietnameseMeaning: newFlashcard.meaning,
        romaji: newFlashcard.romaji || "",
        exampleSentence: newFlashcard.exampleSentence || "",
        imageFile: imageFile,
        listId: id || listId,
      };

      // Call API to add flashcard
      const result = await addFlashcard(flashcardData);

      // Add to local state
      const newCard = {
        id: result?.id || `temp-${Date.now()}`,
        word: newFlashcard.word,
        meaning: newFlashcard.meaning,
        romaji: newFlashcard.romaji,
        exampleSentence: newFlashcard.exampleSentence,
        imageUrl: result?.imageUrl || previewImage || "",
      };

      setFlashcards([...flashcards, newCard]);

      // Close modal and reset form
      setShowModal(false);
      resetNewFlashcardForm();
      toast.success("Thêm flashcard thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding flashcard:", error);
      toast.error("Failed to add flashcard. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFlashcard = async (index: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa flashcard này không?")) return;

    const flashcard = flashcards[index];
    if (!flashcard.id) {
      toast.error("Flashcard ID is missing. Cannot delete.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await deleteFlashcard(flashcard.id);
      const newCards = [...flashcards];
      newCards.splice(index, 1);
      setFlashcards(newCards);
      toast.success("Xóa flashcard thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast.error("Failed to delete flashcard. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && flashcards.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, flashcards.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1E5] p-6 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E5] p-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {id || listId ? `Bộ sưu tập: ${setName}` : "Tạo Bộ Flashcard Mới"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/collection")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Quay lại Bộ Sưu Tập
            </button>
            {flashcards.length > 0 && (
              <button
                onClick={() => setShowPracticeModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Luyện tập
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faPlus} /> Thêm Flashcard
            </button>
          </div>

          {flashcards.length === 0 ? (
            <div className="text-center p-10 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">
                Chưa có flashcard nào. Nhấn "Thêm Flashcard" để tạo thẻ đầu tiên
                của bạn.
              </p>
            </div>
          ) : (
            <>
              {/* Display current flashcard (auto-play mode) */}
              {flashcards.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Xem Trước</h3>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className={`text-lg cursor-pointer p-2 rounded-full ${
                          isPlaying
                            ? "text-blue-500 bg-blue-100"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={toggleAutoPlay}
                      />
                      <span className="text-sm text-gray-600">
                        {currentIndex + 1} / {flashcards.length}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg shadow-md p-6">
                    <div className="flex justify-between mb-4">
                      <h2 className="text-2xl font-bold">
                        {flashcards[currentIndex].word}
                      </h2>
                      <FontAwesomeIcon
                        icon={faVolumeUp}
                        className="text-blue-500 cursor-pointer p-2 hover:bg-blue-100 rounded-full"
                        onClick={() => speakWord(flashcards[currentIndex].word)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Nghĩa:</span>{" "}
                          {flashcards[currentIndex].meaning}
                        </p>
                        {flashcards[currentIndex].romaji && (
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Romaji:</span>{" "}
                            {flashcards[currentIndex].romaji}
                          </p>
                        )}
                        {flashcards[currentIndex].exampleSentence && (
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Ví Dụ:</span>{" "}
                            {flashcards[currentIndex].exampleSentence}
                          </p>
                        )}
                      </div>
                      {flashcards[currentIndex].imageUrl && (
                        <div className="flex justify-center">
                          <img
                            src={flashcards[currentIndex].imageUrl}
                            alt={flashcards[currentIndex].word}
                            className="max-h-40 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* All flashcards list */}
              <h3 className="text-lg font-medium mb-4">
                Tất Cả Flashcards ({flashcards.length})
              </h3>
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id || index}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium">{card.word}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => speakWord(card.word)}
                          className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                        >
                          <FontAwesomeIcon icon={faVolumeUp} />
                        </button>
                        <button className="p-1 text-yellow-500 hover:bg-yellow-100 rounded">
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button
                          onClick={() => handleDeleteFlashcard(index)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p>
                          <span className="font-medium text-gray-600">
                            Nghĩa:
                          </span>{" "}
                          {card.meaning}
                        </p>
                        {card.romaji && (
                          <p>
                            <span className="font-medium text-gray-600">
                              Romaji:
                            </span>{" "}
                            {card.romaji}
                          </p>
                        )}
                        {card.exampleSentence && (
                          <p>
                            <span className="font-medium text-gray-600">
                              Ví Dụ:
                            </span>{" "}
                            {card.exampleSentence}
                          </p>
                        )}
                      </div>
                      {card.imageUrl && (
                        <div className="flex justify-end">
                          <img
                            src={card.imageUrl}
                            alt={card.word}
                            className="max-h-40 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/collection")}
            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Lưu và Thoát
          </button>
        </div>
      </div>

      {/* Modal for adding new flashcard */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Thêm Flashcard Mới</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetNewFlashcardForm();
                }}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Từ tiếng Nhật
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.word}
                    onChange={(e) =>
                      setNewFlashcard({ ...newFlashcard, word: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập từ tiếng Nhật"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nghĩa tiếng Việt
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.meaning}
                    onChange={(e) =>
                      setNewFlashcard({
                        ...newFlashcard,
                        meaning: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập nghĩa tiếng Việt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Romaji
                  </label>
                  <input
                    type="text"
                    value={newFlashcard.romaji}
                    onChange={(e) =>
                      setNewFlashcard({
                        ...newFlashcard,
                        romaji: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập romaji"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Câu Ví Dụ
                  </label>
                  <textarea
                    value={newFlashcard.exampleSentence}
                    onChange={(e) =>
                      setNewFlashcard({
                        ...newFlashcard,
                        exampleSentence: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nhập câu ví dụ"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hình Ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {previewImage && (
                    <div className="mt-2 flex justify-center">
                      <img
                        src={previewImage}
                        alt="Xem Trước"
                        className="max-h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetNewFlashcardForm();
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleAddFlashcard}
                disabled={
                  isSubmitting || !newFlashcard.word || !newFlashcard.meaning
                }
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
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
                    Đang thêm...
                  </>
                ) : (
                  "Thêm Flashcard"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Practice Modal */}
      {showPracticeModal && flashcards.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-[#F8F1E5] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="p-6 bg-white rounded shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Luyện tập: {setName}</h2>
                <button
                  onClick={() => {
                    setShowPracticeModal(false);
                    setPracticeIsPlaying(false);
                  }}
                  className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="w-full flex flex-col rounded-lg p-4 text-center h-[480px]">
                <div className="flex-1">
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${practiceFlipped ? "rotate-x-180" : ""}`}
                    onClick={() => setPracticeFlipped(!practiceFlipped)}
                  >
                    <div
                      className="absolute w-full h-full bg-white rounded-lg flex flex-col items-center justify-between p-6 backface-hidden shadow-md"
                      style={{
                        boxShadow:
                          "0 8px 25px 10px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <div className="w-full flex justify-between items-center">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPracticeShowHint(!practiceShowHint);
                          }}
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} />
                          <span className="ml-2 text-gray-600">
                            {practiceShowHint
                              ? getPartialHint(
                                  flashcards[practiceIndex].meaning,
                                )
                              : "Xem gợi ý"}
                          </span>
                        </div>
                        <div className="flex space-x-4">
                          <FontAwesomeIcon
                            icon={faVolumeUp}
                            className="hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(flashcards[practiceIndex].word);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <h1 className="text-3xl font-bold">
                          {flashcards[practiceIndex].word}
                        </h1>
                      </div>
                      {flashcards[practiceIndex].romaji && (
                        <div className="text-gray-500 mt-2">
                          {flashcards[practiceIndex].romaji}
                        </div>
                      )}
                    </div>

                    <div
                      className="absolute w-full h-full bg-white rounded-lg flex flex-col items-center justify-between p-6 backface-hidden rotate-x-180 shadow-md"
                      style={{
                        boxShadow:
                          "0 8px 25px 10px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      <div className="w-full flex justify-end items-center">
                        <FontAwesomeIcon
                          icon={faVolumeUp}
                          className="hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(flashcards[practiceIndex].word);
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-3xl font-bold">
                          {flashcards[practiceIndex].meaning}
                        </h1>
                        {flashcards[practiceIndex].exampleSentence && (
                          <p className="text-gray-600 italic">
                            "{flashcards[practiceIndex].exampleSentence}"
                          </p>
                        )}
                      </div>

                      {flashcards[practiceIndex].imageUrl && (
                        <div className="mt-4 w-full flex justify-center">
                          <div className="max-w-full max-h-48 overflow-hidden">
                            <img
                              src={flashcards[practiceIndex].imageUrl}
                              alt={flashcards[practiceIndex].word}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-4 gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevPracticeCard}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-gray-600"
                      />
                    </button>
                    <span className="text-sm text-gray-600">
                      {practiceIndex + 1} / {flashcards.length}
                    </span>
                    <button
                      onClick={handleNextPracticeCard}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-gray-600"
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={practiceIsPlaying ? faPause : faPlay}
                      className={`text-gray-

600 cursor-pointer hover:bg-gray-200 p-2 rounded-full transition-colors ${practiceIsPlaying ? "text-blue-500" : ""}`}
                      onClick={togglePracticeAutoPlay}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFlashcardSet;
