import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="flex flex-col items-center bg-[#F8F1E5] p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full">
        <div className="grid grid-cols-2 gap-4 relative">
          <div>
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
              className="w-full p-3 border rounded-md h-[28rem] resize-none focus:border-blue-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            {detectedLang && fromLang === "auto" && (
              <p className="mt-2 text-sm text-gray-600">
                Detected Language: {detectedLang}
              </p>
            )}
          </div>

          <div>
            <select
              className="w-full p-2 border rounded-2xl mb-2 bg-blue-500 text-white h-14 text-lg"
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
              className=" w-full p-3 border rounded-md h-[28rem] resize-none focus:border-blue-500"
              value={translatedText}
              readOnly
            ></textarea>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={swapLanguages}
              className="w-10 h-10 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
            </button>
          </div>
        </div>
        <button
          onClick={translateText}
          className="mt-4 w-full bg-blue-500 text-white p-3 rounded-2xl hover:bg-blue-600 transition"
        >
          Dịch
        </button>
      </div>
    </div>
  );
}
