import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const languages = [
  { code: "auto", name: "Detect Language" },
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "ja", name: "Japanese" },
];

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("ja");
  const [toLang, setToLang] = useState("vi");
  const [detectedLang, setDetectedLang] = useState("");

  const translateText = async () => {
    if (!inputText.trim()) return;
    try {
      const response = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(
          inputText,
        )}`,
      );
      setTranslatedText(response.data[0].map((t: any) => t[0]).join(" "));
      if (fromLang === "auto" && response.data[2]) {
        setDetectedLang(response.data[2]);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Translation failed.");
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const speakText = (text: string, lang: string) => {
    if (!text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (fromLang === toLang) {
      // Ưu tiên đổi sang tiếng Anh nếu có
      const newToLang = languages.find(
        (lang) => lang.code !== fromLang && lang.code !== "auto",
      );
      if (newToLang) {
        setToLang(newToLang.code);
      }
    }
  }, [fromLang, toLang]);

  return (
    <div className="flex flex-col items-center bg-[#F8F1E5] p-4 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-6xl">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 relative">
          {/* Input Section */}
          <div className="flex flex-col w-full relative">
            <select
              className="w-full p-2 border rounded-2xl mb-2 h-14 text-lg"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-3 border rounded-md h-[20rem] md:h-[28rem] resize-none focus:border-blue-500 text-lg"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập vào đây ..."
            ></textarea>
            {/* Detected Language */}
            {detectedLang && fromLang === "auto" && (
              <p className="mt-2 text-sm text-gray-600">
                Detected Language: {detectedLang}
              </p>
            )}
            {/* Input Volume Icon */}
            {fromLang !== "vi" && inputText.trim() && (
              <button
                className="absolute bottom-0 right-0 m-4"
                onClick={() =>
                  speakText(inputText, fromLang === "auto" ? "en" : fromLang)
                }
              >
                <FontAwesomeIcon
                  icon={faVolumeUp}
                  size="lg"
                  className="text-[#6b7280] hover:text-gray-600"
                />
              </button>
            )}
          </div>

          {/* Output Section */}
          <div className="flex flex-col w-full relative">
            <select
              className="w-full p-2 border rounded-2xl mb-2 bg-[#e9546b] text-white h-14 text-lg"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
            >
              {languages.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="bg-white text-black"
                >
                  {lang.name}
                </option>
              ))}
            </select>
            <textarea
              className="w-full p-3 border rounded-md h-[20rem] md:h-[28rem] resize-none focus:border-blue-500 text-lg bg-gray-100"
              value={translatedText}
              readOnly
            ></textarea>
            {/* Output Volume Icon */}
            {toLang !== "vi" && translatedText.trim() && (
              <button
                className="absolute bottom-0 right-0 m-4 text-blue-600 hover:text-blue-800 w-fit"
                onClick={() => speakText(translatedText, toLang)}
              >
                <FontAwesomeIcon
                  icon={faVolumeUp}
                  size="lg"
                  className="text-[#6b7280] hover:text-gray-600"
                />
              </button>
            )}
          </div>

          {/* Swap Button */}
          <div className="absolute top-full md:top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 mt-4 md:mt-0">
            <button
              onClick={swapLanguages}
              className="w-10 h-10 bg-[#e9546b] text-white p-2 rounded-full hover:bg-[#d6455c] transition"
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
            </button>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={translateText}
          className="mt-8 w-full bg-[#e9546b] text-white p-3 rounded-2xl hover:bg-[#d6455c] transition"
        >
          Dịch
        </button>
      </div>
    </div>
  );
}
