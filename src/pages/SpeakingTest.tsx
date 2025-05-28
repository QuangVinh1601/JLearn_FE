// src/pages/SpeakingTest.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Added faSpinner
import { transcribeAudio } from "../api/apiClient"; // Import the transcribe API

// Define possible states for the component
type TestState =
  | "IDLE" // Initial state, before permission request
  | "REQUESTING_PERMISSION" // Waiting for user mic permission
  | "READY" // Permission granted, ready to record
  | "RECORDING" // Currently recording audio
  | "PROCESSING" // Recording stopped, sending/waiting for API
  | "SHOWING_RESULT" // API response received, showing result
  | "ERROR" // An error occurred (permission, API, etc.)
  | "NO_QUESTIONS"; // Navigated here without questions in state

const SpeakingTest: React.FC = () => {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();

  // --- State from Navigation ---
  // Safely access state, provide defaults
  const passedState = location.state as
    | { questions?: string[]; topicName?: string }
    | undefined;
  const questions = passedState?.questions ?? [];
  const topicName = passedState?.topicName ?? "Kiểm tra Nói"; // <-- TRANSLATED Default topic name

  // --- Component State ---
  const [questionIndex, setQuestionIndex] = useState(0);
  // Determine initial state based on whether questions were passed
  const [testState, setTestState] = useState<TestState>(() =>
    questions.length > 0 ? "IDLE" : "NO_QUESTIONS",
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null); // Stores the text response from API
  const [audioURL, setAudioURL] = useState<string | null>(null); // Stores the blob URL for playback
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Stores error messages

  // --- Refs for Media ---
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]); // Stores chunks of audio data during recording
  const streamRef = useRef<MediaStream | null>(null); // Stores the MediaStream

  // --- Cleanup Function ---
  // Stops media tracks and recorder, resets refs. Crucial for resource management.
  const cleanupStream = useCallback(() => {
    // Production: Không log
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      try {
        mediaRecorder.current.stop();
      } catch (error) {
        // ignore
      }
    }
    mediaRecorder.current = null;
    audioChunks.current = [];
  }, []);

  // --- Effect for Component Unmount Cleanup ---
  // Ensures resources are released when the component is removed from the DOM.
  useEffect(() => {
    return () => {
      cleanupStream();
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [cleanupStream, audioURL]);

  const requestMicPermissionAndInitRecorder = useCallback(async () => {
    if (testState !== "IDLE" && testState !== "ERROR") return;

    setTestState("REQUESTING_PERMISSION");
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Trình duyệt của bạn không hỗ trợ ghi âm.");
      setTestState("ERROR");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;

      const options = { mimeType: "audio/webm" };
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onerror = (event: Event) => {
        setErrorMessage(
          `Lỗi ghi âm: ${(event as any)?.error?.name || "Lỗi không xác định"}.`,
        );
        setTestState("ERROR");
        cleanupStream();
      };

      // --- Ready to Record ---
      setTestState("READY");
    } catch (err: any) {
      let userMessage = "Không thể truy cập micro.";
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        userMessage =
          "Bạn đã từ chối quyền truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt.";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        userMessage = "Không tìm thấy thiết bị micro nào.";
      } else {
        userMessage = `Lỗi micro (${err.name}): ${err.message}`;
      }
      setErrorMessage(userMessage);
      setTestState("ERROR");
      cleanupStream();
    }
  }, [testState, audioURL, questions, questionIndex, cleanupStream]);

  const formatApiResponse = (response: string): string => {
    const sections = response.split("\n\n");

    // Format each section with proper styling
    return sections
      .map((section) => {
        if (section.startsWith("[TRANSCRIPTION]")) {
          return `<div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">Bản ghi âm:</h3>
          <p class="text-gray-700">${section.replace("[TRANSCRIPTION]", "").trim().replace(/\n/g, "<br>")}</p>
        </div>`;
        }
        if (section.startsWith("[PHÂN TÍCH LỖI DÙNG TỪ]")) {
          return `<div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">Phân tích lỗi dùng từ:</h3>
          <div class="text-gray-700">${section.replace("[PHÂN TÍCH LỖI DÙNG TỪ]", "").trim().replace(/\n/g, "<br>")}</div>
        </div>`;
        }
        if (section.startsWith("[PHÂN TÍCH NGỮ PHÁP]")) {
          return `<div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">Phân tích ngữ pháp:</h3>
          <div class="text-gray-700">${section.replace("[PHÂN TÍCH NGỮ PHÁP]", "").trim().replace(/\n/g, "<br>")}</div>
        </div>`;
        }
        if (section.startsWith("[ĐỀ XUẤT SỬA LỖI]")) {
          return `<div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">Đề xuất sửa lỗi:</h3>
          <div class="text-gray-700">${section.replace("[ĐỀ XUẤT SỬA LỖI]", "").trim().replace(/\n/g, "<br>")}</div>
        </div>`;
        }
        if (section.startsWith("[KẾT LUẬN]")) {
          return `<div class="mb-4">
          <h3 class="font-bold text-lg text-gray-800 mb-2">Kết luận:</h3>
          <div class="text-gray-700">${section.replace("[KẾT LUẬN]", "").trim().replace(/\n/g, "<br>")}</div>
        </div>`;
        }
        // Các đoạn khác: thay \n bằng <br>
        return `<p class="text-gray-700">${section.replace(/\n/g, "<br>")}</p>`;
      })
      .join("");
  };

  // --- Control Functions ---
  const startRecording = () => {
    if (mediaRecorder.current && testState === "READY") {
      setApiResponse(null);
      setErrorMessage(null);
      if (audioURL) {
        // Revoke previous audio URL if starting new recording
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }
      mediaRecorder.current.start(); // Start recording
      setTestState("RECORDING");
    } else if (testState === "IDLE" || testState === "ERROR") {
      requestMicPermissionAndInitRecorder();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && testState === "RECORDING") {
      // Đặt onstop trước khi gọi stop()
      mediaRecorder.current.onstop = async () => {
        setTestState("PROCESSING");

        // Check if any audio was recorded
        if (!audioChunks.current.length) {
          setErrorMessage(
            "Không có âm thanh nào được ghi lại. Vui lòng thử lại.",
          );
          setTestState("ERROR");
          return;
        }

        const mimeType = mediaRecorder.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });

        // Debug: Log blob size
        console.log("Audio blob size (bytes):", audioBlob.size);

        if (audioBlob.size === 0) {
          setErrorMessage(
            "Không có âm thanh nào được ghi lại (file rỗng). Vui lòng thử lại.",
          );
          setTestState("ERROR");
          return;
        }

        try {
          const audioFile = new File(
            [audioBlob],
            `recording_${Date.now()}.${mimeType.split("/")[1] || "webm"}`,
            { type: mimeType },
          );

          // Call the transcribe API
          const data = await transcribeAudio(
            audioFile,
            questions[questionIndex] || "",
          );
          console.log("API response:", data);
          const transcription =
            data.transcription || "Không có bản ghi âm nào được trả về.";
          const formattedAnalysis = formatApiResponse(
            data.analysis_result || "Không có phân tích nào được trả về.",
          );
          setApiResponse(formattedAnalysis); // <-- Hiển thị analysis_result đã format
          setAudioURL(URL.createObjectURL(audioBlob)); // Set audio URL for playback
          setTestState("SHOWING_RESULT");
        } catch (error) {
          setErrorMessage("Đã xảy ra lỗi khi gửi dữ liệu đến API.");
          setTestState("ERROR");
        } finally {
          audioChunks.current = []; // Clear chunks for the next recording
        }
      };
      mediaRecorder.current.stop();
    }
  };

  // --- Navigation Between Questions ---
  const handleNextQuestion = () => {
    cleanupStream();

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setApiResponse(null);
    setAudioURL(null);
    setErrorMessage(null);

    if (questions && questionIndex + 1 < questions.length) {
      setQuestionIndex((prev) => prev + 1);
      setTestState("IDLE");
    } else {
      navigate("/speaking-topics");
    }
  };

  // --- Determine Button Properties Based on State ---
  const getButtonProps = (): {
    text: string;
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
  } => {
    switch (testState) {
      case "IDLE":
        return {
          text: "準備 (Sẵn sàng?)",
          onClick: requestMicPermissionAndInitRecorder,
          disabled: false,
          loading: false,
        }; // <-- TRANSLATED
      case "REQUESTING_PERMISSION":
        return {
          text: "Đang yêu cầu quyền...",
          onClick: () => {},
          disabled: true,
          loading: true,
        };
      case "READY":
        return {
          text: "録音開始 (Bắt đầu Ghi)",
          onClick: startRecording,
          disabled: false,
          loading: false,
        }; // <-- TRANSLATED
      case "RECORDING":
        return {
          text: "録音停止 (Dừng Ghi)",
          onClick: stopRecording,
          disabled: false,
          loading: false,
        }; // <-- TRANSLATED
      case "PROCESSING":
        return {
          text: "処理中... (Đang xử lý...)",
          onClick: () => {},
          disabled: true,
          loading: true,
        }; // <-- TRANSLATED
      case "SHOWING_RESULT":
        const isLastQuestion = !(
          questions && questionIndex + 1 < questions.length
        );
        const nextButtonText = isLastQuestion
          ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
          : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
        return {
          text: nextButtonText,
          onClick: handleNextQuestion,
          disabled: false,
          loading: false,
        };
      case "ERROR":
        const errorButtonText = !(
          questions && questionIndex + 1 < questions.length
        )
          ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
          : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
        return {
          text: errorButtonText,
          onClick: handleNextQuestion,
          disabled: false,
          loading: false,
        };
      case "NO_QUESTIONS":
        return {
          text: "トピックを選択してください (Chọn Chủ đề)",
          onClick: () => navigate("/speaking-topics"),
          disabled: false,
          loading: false,
        }; // <-- TRANSLATED
      default:
        return {
          text: "状態不明 (Trạng thái Không xác định)",
          onClick: () => {},
          disabled: true,
          loading: false,
        }; // <-- TRANSLATED
    }
  };

  const buttonProps = getButtonProps();

  // --- Render Logic ---
  return (
    <div className="flex flex-col items-center p-5 font-sans min-h-screen bg-gray-50 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/speaking-topics")}
        className="absolute top-5 left-5 text-gray-600 hover:text-[#f04532] transition-colors p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f04532]/50"
        title="トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
        aria-label="Quay lại trang chọn chủ đề" // <-- TRANSLATED
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      <h1 className="text-2xl font-bold mb-2 text-gray-800 mt-8 md:mt-0">
        {topicName}
      </h1>
      {questions.length > 0 && testState !== "NO_QUESTIONS" && (
        <p className="text-sm text-gray-500 mb-4">
          Câu hỏi {questionIndex + 1} / {questions.length}
        </p>
      )}

      {testState === "NO_QUESTIONS" && (
        <div className="w-full max-w-2xl mt-10 p-6 bg-white rounded-lg shadow-md text-center border border-red-200">
          <p className="text-red-600 font-semibold mb-4 text-lg">
            Không tìm thấy câu hỏi nào.
          </p>
          <p className="text-gray-700 mb-6">
            Vui lòng quay lại và chọn một chủ đề để bắt đầu bài kiểm tra nói.{" "}
            {/* <-- TRANSLATED (Removed English) */}
          </p>
          <button
            onClick={buttonProps.onClick}
            className="px-6 py-3 rounded-lg text-white font-semibold bg-[#f04532] hover:bg-[#d03e2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f04532]/50 shadow-md transition-colors"
          >
            {buttonProps.text}
          </button>
        </div>
      )}

      {questions.length > 0 && testState !== "NO_QUESTIONS" && (
        <>
          <div className="w-full max-w-[50%] mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col gap-0 min-h-[200px] border border-gray-200">
            <div className="flex justify-start">
              <p className="bg-[#f04532]/10 text-[#f04532] p-3 rounded-lg rounded-bl-none max-w-[85%] shadow-sm text-base md:text-lg">
                {questions[questionIndex]}
              </p>
            </div>

            <div className="self-center text-center h-6 my-2">
              {testState === "RECORDING" && (
                <div className="text-red-600 font-semibold flex items-center gap-2 animate-pulse">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  録音中... (Đang ghi âm...) {/* <-- TRANSLATED */}
                </div>
              )}
              {testState === "PROCESSING" && (
                <div className="text-gray-600 font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  処理中... (Đang xử lý...) {/* <-- TRANSLATED */}
                </div>
              )}
              {testState === "REQUESTING_PERMISSION" && (
                <div className="text-gray-600 font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Đang yêu cầu quyền...
                </div>
              )}
            </div>

            {apiResponse && testState === "SHOWING_RESULT" && (
              <div className="flex justify-end">
                <p
                  className="bg-green-100 text-green-900 p-3 rounded-lg rounded-br-none max-w-[85%] shadow-sm text-base md:text-lg"
                  dangerouslySetInnerHTML={{ __html: apiResponse }} // Render formatted HTML
                />
              </div>
            )}

            {audioURL &&
              (testState === "SHOWING_RESULT" || testState === "ERROR") && (
                <div className="self-end mt-2 w-full max-w-[85%]">
                  <p className="text-sm text-gray-600 mb-1 text-right">
                    あなたの録音 (Bản ghi của bạn):
                  </p>{" "}
                  {/* <-- TRANSLATED */}
                  <audio
                    src={audioURL}
                    controls
                    className="w-full h-10 rounded"
                    preload="metadata"
                  />
                </div>
              )}

            {errorMessage && (
              <div className="flex justify-center mt-2">
                <p className="bg-red-100 text-red-700 p-3 rounded-lg max-w-[95%] text-center shadow-sm border border-red-200 text-sm">
                  <strong>Lỗi:</strong> {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center gap-3">
            <button
              onClick={buttonProps.onClick}
              disabled={buttonProps.disabled || buttonProps.loading}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 min-w-[200px]
                                ${
                                  buttonProps.disabled || buttonProps.loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : testState === "RECORDING"
                                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                                      : "bg-[#f04532] hover:bg-[#d03e2c] focus:ring-[#f04532]/50"
                                }`}
            >
              {buttonProps.loading && <FontAwesomeIcon icon={faSpinner} spin />}
              <span>{buttonProps.text}</span>
            </button>

            <p className="text-sm text-gray-500 h-5 text-center">
              {testState === "IDLE" && 'Nhấn "Sẵn sàng?" để chuẩn bị micro.'}{" "}
              {/* <-- TRANSLATED (Removed English, updated button text) */}
              {testState === "READY" && 'Nhấn "Bắt đầu Ghi" để bắt đầu.'}{" "}
              {/* <-- TRANSLATED (Removed English, updated button text) */}
              {testState === "RECORDING" &&
                'Đang ghi âm... Nhấn "Dừng Ghi" để kết thúc.'}{" "}
              {/* <-- TRANSLATED (Removed English, updated button text) */}
              {testState === "SHOWING_RESULT" &&
                "Xem lại kết quả hoặc chuyển sang câu hỏi tiếp theo."}{" "}
              {/* <-- TRANSLATED (Removed English) */}
              {testState === "ERROR" &&
                "Đã xảy ra lỗi. Thử lại hoặc chuyển sang câu hỏi tiếp theo."}{" "}
              {/* <-- TRANSLATED (Removed English) */}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SpeakingTest;
