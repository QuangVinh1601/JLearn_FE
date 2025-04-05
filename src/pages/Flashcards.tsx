import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faCopy,
  faShareAlt,
  faEllipsisH,
  faQuestionCircle,
  faVolumeUp,
  faStar,
  faPlay,
  faPause,
  faRandom,
  faCog,
  faTh,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface FlashcardData {
  id: number;
  word: string;
  hint: string;
  status?: "remembered" | "learning" | null;
}

const initialFlashcards: FlashcardData[] = [
  { id: 1, word: "アメリカ人", hint: "Người Mỹ" },
  { id: 2, word: "日本語", hint: "Tiếng Nhật" },
  { id: 3, word: "学生", hint: "Học sinh" },
  { id: 4, word: "先生", hint: "Giáo viên" },
  { id: 5, word: "会社員", hint: "Nhân viên công ty" },
  { id: 6, word: "医者", hint: "Bác sĩ" },
  { id: 7, word: "電車", hint: "Tàu điện" },
  { id: 8, word: "図書館", hint: "Thư viện" },
  { id: 9, word: "食べ物", hint: "Đồ ăn" },
  { id: 10, word: "飲み物", hint: "Đồ uống" },
];

const Flashcard: React.FC = () => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>(() => {
    const saved = localStorage.getItem("flashcards");
    return saved ? JSON.parse(saved) : initialFlashcards;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // random
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [randomOrder, setRandomOrder] = useState<number[]>([]);
  const [progress, setProgress] = useState({
    remembered: 0,
    learning: 0,
    remaining: flashcards.length,
  });

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));

    const remembered = flashcards.filter(
      (card) => card.status === "remembered",
    ).length;
    const learning = flashcards.filter(
      (card) => card.status === "learning",
    ).length;

    setProgress({
      remembered,
      learning,
      remaining: flashcards.length - remembered - learning,
    });
  }, [flashcards]);

  const generateRandomOrder = useCallback(() => {
    const indices = Array.from({ length: flashcards.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setRandomOrder(indices);
  }, [flashcards]);

  useEffect(() => {
    generateRandomOrder();
  }, [generateRandomOrder]);

  // Toggle random mode
  const toggleRandomMode = () => {
    if (!isRandomMode) {
      generateRandomOrder();
      setCurrentIndex(0);
    } else {
      const currentCardId = flashcards[randomOrder[currentIndex]].id;
      const originalIndex = flashcards.findIndex(
        (card) => card.id === currentCardId,
      );
      setCurrentIndex(originalIndex >= 0 ? originalIndex : 0);
    }
    setIsRandomMode(!isRandomMode);
    setFlipped(false);
  };

  const getCurrentFlashcardIndex = () => {
    return isRandomMode ? randomOrder[currentIndex] : currentIndex;
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlipped(false);
    setShowHint(false);
  }, [flashcards.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setFlipped(true);
        timeout = setTimeout(() => {
          handleNext();
        }, 2000);
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPlaying, handleNext]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
    setFlipped(false);
    setShowHint(false);
  };

  const handleCardStatus = (status: "remembered" | "learning") => {
    const updatedFlashcards = [...flashcards];
    const actualIndex = getCurrentFlashcardIndex();
    updatedFlashcards[actualIndex] = {
      ...updatedFlashcards[actualIndex],
      status: status,
    };
    setFlashcards(updatedFlashcards);
    handleNext();
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ja-JP"; // Set language to Japanese
    speechSynthesis.speak(utterance);
  };

  const getPartialHint = (hint: string) => {
    const words = hint.split(" ");
    return words.map((word) => word[0] + "...").join(" ");
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
    // When pausing, we keep the current state (flipped or not flipped)
  };

  const actualIndex = getCurrentFlashcardIndex();
  const currentFlashcard = flashcards[actualIndex];
  const rememberedCards = flashcards.filter(
    (card) => card.status === "remembered",
  );
  const learningCards = flashcards.filter((card) => card.status === "learning");

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F1E5] p-6 px-80 ">
      <div className="p-8 bg-white">
        {/* Header */}
        <div className="w-full flex justify-between items-center ">
          <div>
            <h2 className="text-2xl font-bold">Tự học tiếng nhật</h2>
            {isTracking && (
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-green-600">
                  Đã nhớ: {progress.remembered}
                </span>
                <span className="text-yellow-600">
                  Đang học: {progress.learning}
                </span>
                <span className="text-gray-600">
                  Còn lại: {progress.remaining}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-600 border border-gray-300 p-2 rounded hover:bg-gray-200">
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
            <div className="relative inline-block group">
              <button className="text-gray-600 border border-gray-300 p-2 rounded hover:bg-gray-200">
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-max mt-2 p-1 text-white bg-black text-sm hidden group-hover:block">
                Copy and customise this set
              </div>
            </div>
            <div className="relative inline-block group">
              <button className="text-gray-600 border border-gray-300 p-2 rounded hover:bg-gray-200">
                <FontAwesomeIcon icon={faShareAlt} />
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-max mt-2 p-1 text-white bg-black text-sm hidden group-hover:block">
                Save
              </div>
            </div>
            <div className="relative inline-block group">
              <button className="text-gray-600 border border-gray-300 p-2 rounded hover:bg-gray-200">
                <FontAwesomeIcon icon={faEllipsisH} />
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-max mt-2 p-1 text-white bg-black text-sm hidden group-hover:block">
                More
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs
      <div className="w-full flex justify-around p-2 bg-gray-100">
        <button className="bg-blue-200 p-2 rounded">Flashcards</button>
        <button className="bg-gray-200 p-2 rounded">Learn</button>
        <button className="bg-gray-200 p-2 rounded">Test</button>
        <button className="bg-gray-200 p-2 rounded relative">
          Blocks
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-1">New</span>
        </button>
        <button className="bg-gray-200 p-2 rounded">Blast</button>
        <button className="bg-gray-200 p-2 rounded">Match</button>
      </div> */}

        {/* Flashcard Content */}
        <div className="w-full flex flex-col border-4 rounded-lg p-6 text-center mt-4 h-96">
          <div className="flex justify-between items-center mb-4">
            {flipped ? (
              <div></div>
            ) : (
              <div
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(!showHint);
                }}
              >
                {showHint ? (
                  <>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span className="ml-2 text-gray-600">
                      {getPartialHint(currentFlashcard.hint)}
                    </span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span className="ml-2 text-gray-600">Get a hint</span>
                  </>
                )}
              </div>
            )}
            <div className="flex space-x-4">
              {!flipped && (
                <FontAwesomeIcon
                  icon={faVolumeUp}
                  className="hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentFlashcard.word);
                  }}
                />
              )}
              <FontAwesomeIcon
                icon={faStar}
                className="hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div
            className={`flex flex-1 items-center justify-center text-3xl mb-8 font-bold transition-transform duration-500 ${flipped ? "rotate-y-180" : ""} cursor-pointer`}
            onClick={() => setFlipped(!flipped)}
          >
            {flipped ? (
              <h1>{currentFlashcard.hint}</h1>
            ) : (
              <h1>{currentFlashcard.word}</h1>
            )}
          </div>
          {isTracking && flipped && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleCardStatus("remembered")}
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faCheck} /> Đã nhớ
              </button>
              <button
                onClick={() => handleCardStatus("learning")}
                className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-600"
              >
                <FontAwesomeIcon icon={faTimes} /> Cần học thêm
              </button>
            </div>
          )}
        </div>

        {/* Navigation and Progress */}
        <div className="flex items-center justify-between mt-8 border-t pt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-12 h-6 bg-gray-300 rounded-full p-1 cursor-pointer"
              onClick={() => setIsTracking(!isTracking)}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${isTracking ? "bg-blue-600 translate-x-6" : "bg-gray-400 translate-x-0"}`}
              ></div>
            </div>
            <span className="text-sm text-gray-600">Track progress</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {flashcards.length}
            </span>
            <button
              onClick={handleNext}
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
              icon={isPlaying ? faPause : faPlay}
              className={`text-gray-600 cursor-pointer hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors ${isPlaying ? "text-blue-500" : ""}`}
              onClick={toggleAutoPlay}
            />
            <FontAwesomeIcon
              icon={faRandom}
              className={`text-gray-600 cursor-pointer hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors ${isRandomMode ? "text-blue-500 bg-gray-200" : ""}`}
              onClick={toggleRandomMode}
              title={
                isRandomMode ? "Disable random mode" : "Enable random mode"
              }
            />
            <FontAwesomeIcon
              icon={faCog}
              className="text-gray-600 cursor-pointer hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
            />
            <FontAwesomeIcon
              icon={faTh}
              className="text-gray-600 cursor-pointer hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
            />
          </div>
        </div>

        {/* Word Lists */}
        {isTracking && (
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-600 mb-4">
                Từ đã nhớ ({rememberedCards.length})
              </h3>
              <div className="space-y-2">
                {rememberedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 bg-green-50 rounded"
                  >
                    <span className="font-medium">{card.word}</span>
                    <span className="text-gray-600">{card.hint}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-600 mb-4">
                Từ đang học ({learningCards.length})
              </h3>
              <div className="space-y-2">
                {learningCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 bg-yellow-50 rounded"
                  >
                    <span className="font-medium">{card.word}</span>
                    <span className="text-gray-600">{card.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
