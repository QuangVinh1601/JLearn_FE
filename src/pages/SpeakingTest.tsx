// src/pages/SpeakingTest.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Added faSpinner

// Define possible states for the component
type TestState =
    | "IDLE"                // Initial state, before permission request
    | "REQUESTING_PERMISSION" // Waiting for user mic permission
    | "READY"               // Permission granted, ready to record
    | "RECORDING"           // Currently recording audio
    | "PROCESSING"          // Recording stopped, sending/waiting for API
    | "SHOWING_RESULT"      // API response received, showing result
    | "ERROR"               // An error occurred (permission, API, etc.)
    | "NO_QUESTIONS";       // Navigated here without questions in state

const SpeakingTest: React.FC = () => {
    // --- Hooks ---
    const location = useLocation();
    const navigate = useNavigate();

    // --- State from Navigation ---
    // Safely access state, provide defaults
    const passedState = location.state as { questions?: string[]; topicName?: string } | undefined;
    const questions = passedState?.questions ?? [];
    const topicName = passedState?.topicName ?? "Kiểm tra Nói"; // <-- TRANSLATED Default topic name

    // --- Component State ---
    const [questionIndex, setQuestionIndex] = useState(0);
    // Determine initial state based on whether questions were passed
    const [testState, setTestState] = useState<TestState>(() => questions.length > 0 ? "IDLE" : "NO_QUESTIONS");
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
        console.log("Cleanup Stream Called. Current Stream:", streamRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop(); // Stop each track in the stream
                console.log(`Track ${track.id} stopped.`);
            });
            streamRef.current = null; // Clear the ref
        }
        if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
            try {
                mediaRecorder.current.stop(); // Stop the recorder if it's running
                console.log("MediaRecorder stopped.");
            } catch (error) {
                console.warn("Error stopping media recorder:", error); // Might already be stopped
            }
        }
        mediaRecorder.current = null; // Clear the ref
        audioChunks.current = []; // Clear recorded chunks
        console.log("Cleanup Stream Finished.");
    }, []); // No dependencies needed as it only interacts with refs

    // --- Effect for Component Unmount Cleanup ---
    // Ensures resources are released when the component is removed from the DOM.
    useEffect(() => {
        return () => {
            console.log("SpeakingTest Component Unmounting. Cleaning up...");
            cleanupStream();
            if (audioURL) {
                // Revoke the object URL to free memory
                URL.revokeObjectURL(audioURL);
                console.log("Revoked Object URL on unmount:", audioURL);
            }
        };
    }, [cleanupStream, audioURL]); // Depend on cleanupStream and audioURL

    // --- Request Microphone Permission & Initialize Recorder ---
    const requestMicPermissionAndInitRecorder = useCallback(async () => {
        // Prevent multiple requests
        if (testState !== "IDLE" && testState !== "ERROR") return;

        console.log("Requesting microphone permission...");
        setTestState("REQUESTING_PERMISSION");
        setErrorMessage(null); // Clear previous errors

        // --- Check for MediaDevices support ---
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("getUserMedia not supported on this browser.");
            setErrorMessage("Trình duyệt của bạn không hỗ trợ ghi âm."); // <-- TRANSLATED (Removed English)
            setTestState("ERROR");
            return;
        }

        try {
            // --- Request Audio Stream ---
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            streamRef.current = stream; // Store the stream
            console.log("Microphone permission granted. Stream obtained.");

            // --- Initialize MediaRecorder ---
            const options = { mimeType: 'audio/webm' };
            let recorder: MediaRecorder;
            try {
                recorder = new MediaRecorder(stream, options);
            } catch (e) {
                console.warn("audio/webm not supported, trying default.", e);
                recorder = new MediaRecorder(stream);
            }

            mediaRecorder.current = recorder;
            audioChunks.current = []; // Ensure chunks array is empty

            // --- Event Handlers for MediaRecorder ---
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                    console.log("Audio chunk received, size:", event.data.size);
                }
            };

            recorder.onerror = (event: Event) => {
                console.error("MediaRecorder Error:", event);
                setErrorMessage(`Lỗi ghi âm: ${(event as any)?.error?.name || 'Lỗi không xác định'}.`); // <-- TRANSLATED (Removed English, translated 'Unknown error')
                setTestState("ERROR");
                cleanupStream(); // Clean up on recorder error
            };

            // --- Ready to Record ---
            console.log("MediaRecorder initialized. Ready to record.");
            setTestState("READY");

        } catch (err: any) {
            console.error("Error accessing microphone:", err);
            let userMessage = "Không thể truy cập micro."; // <-- TRANSLATED (Removed English)
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                userMessage = "Bạn đã từ chối quyền truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt."; // <-- TRANSLATED (Removed English)
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                userMessage = "Không tìm thấy thiết bị micro nào."; // <-- TRANSLATED (Removed English)
            } else {
                userMessage = `Lỗi micro (${err.name}): ${err.message}`;
            }
            setErrorMessage(userMessage);
            setTestState("ERROR");
            cleanupStream(); // Clean up if permission fails
        }
    }, [testState, audioURL, questions, questionIndex, cleanupStream]); // Dependencies for the callback

    // --- Format API Response ---
    const formatApiResponse = (response: string): string => {
        // Replace line breaks with HTML <br> tags for better display
        return response.replace(/\n/g, "<br>").replace(/• /g, "• ");
    };

    // --- Control Functions ---
    const startRecording = () => {
        if (mediaRecorder.current && testState === "READY") {
            console.log("Starting recording...");
            setApiResponse(null); // Clear previous results
            setErrorMessage(null);
            if (audioURL) { // Revoke previous audio URL if starting new recording
                URL.revokeObjectURL(audioURL);
                setAudioURL(null);
                console.log("Revoked previous Object URL on start recording.");
            }
            mediaRecorder.current.start(); // Start recording
            setTestState("RECORDING");
        } else if (testState === "IDLE" || testState === "ERROR") {
            requestMicPermissionAndInitRecorder();
        } else {
            console.warn(`Cannot start recording in state: ${testState}`);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && testState === "RECORDING") {
            console.log("Stopping recording (manual trigger)...");
            mediaRecorder.current.stop(); // The onstop handler will handle further processing

            mediaRecorder.current.onstop = async () => {
                console.log("Recording stopped. Sending audio to /transcribe API...");
                setTestState("PROCESSING");

                try {
                    // Create Blob and FormData
                    const mimeType = mediaRecorder.current?.mimeType || 'audio/webm';
                    const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                    const audioFile = new File([audioBlob], `recording_${Date.now()}.${mimeType.split('/')[1] || 'webm'}`, { type: mimeType });
                    const formData = new FormData();
                    formData.append("audio", audioFile);
                    formData.append("additional_text", questions[questionIndex] || ""); // Include the current question

                    // Send to /transcribe API
                    const response = await fetch("http://localhost:5000/transcribe", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`API Error: ${response.statusText}`);
                    }

                    const data = await response.json();
                    console.log("API Response:", data);

                    // Format and display transcription and analysis
                    const transcription = data.transcription || "Không có bản ghi âm nào được trả về.";
                    const formattedAnalysis = formatApiResponse(data.analysis_result || "Không có phân tích nào được trả về.");
                    setApiResponse(`Đây là đoạn văn bản được ghi âm mà chúng tôi phân tích được: ${transcription}<br><br> ${formattedAnalysis}`);
                    setAudioURL(URL.createObjectURL(audioBlob)); // Set audio URL for playback
                    setTestState("SHOWING_RESULT");
                } catch (error) {
                    console.error("Error during API call:", error);
                    setErrorMessage("Đã xảy ra lỗi khi gửi dữ liệu đến API.");
                    setTestState("ERROR");
                } finally {
                    audioChunks.current = []; // Clear chunks for the next recording
                }
            };
        } else {
            console.warn(`Cannot stop recording in state: ${testState}`);
        }
    };

    // --- Navigation Between Questions ---
    const handleNextQuestion = () => {
        console.log("Handling Next Question / Resetting...");
        cleanupStream();

        if (audioURL) {
            URL.revokeObjectURL(audioURL);
            console.log("Revoked Object URL on next question:", audioURL);
        }

        setApiResponse(null);
        setAudioURL(null);
        setErrorMessage(null);

        if (questions && questionIndex + 1 < questions.length) {
            setQuestionIndex((prev) => prev + 1);
            setTestState("IDLE");
            console.log("Moving to next question, index:", questionIndex + 1);
        } else {
            console.log("End of questions for this topic. Navigating back.");
            navigate('/speaking-topics');
        }
    };

    // --- Determine Button Properties Based on State ---
    const getButtonProps = (): { text: string; onClick: () => void; disabled: boolean; loading: boolean; } => {
        switch (testState) {
            case "IDLE":
                return { text: "準備 (Sẵn sàng?)", onClick: requestMicPermissionAndInitRecorder, disabled: false, loading: false }; // <-- TRANSLATED
            case "REQUESTING_PERMISSION":
                return { text: "Đang yêu cầu quyền...", onClick: () => { }, disabled: true, loading: true };
            case "READY":
                return { text: "録音開始 (Bắt đầu Ghi)", onClick: startRecording, disabled: false, loading: false }; // <-- TRANSLATED
            case "RECORDING":
                return { text: "録音停止 (Dừng Ghi)", onClick: stopRecording, disabled: false, loading: false }; // <-- TRANSLATED
            case "PROCESSING":
                return { text: "処理中... (Đang xử lý...)", onClick: () => { }, disabled: true, loading: true }; // <-- TRANSLATED
            case "SHOWING_RESULT":
                const isLastQuestion = !(questions && questionIndex + 1 < questions.length);
                const nextButtonText = isLastQuestion
                    ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                    : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
                return { text: nextButtonText, onClick: handleNextQuestion, disabled: false, loading: false };
            case "ERROR":
                const errorButtonText = !(questions && questionIndex + 1 < questions.length)
                    ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                    : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
                return { text: errorButtonText, onClick: handleNextQuestion, disabled: false, loading: false };
            case "NO_QUESTIONS":
                return { text: "トピックを選択してください (Chọn Chủ đề)", onClick: () => navigate('/speaking-topics'), disabled: false, loading: false }; // <-- TRANSLATED
            default:
                return { text: "状態不明 (Trạng thái Không xác định)", onClick: () => { }, disabled: true, loading: false }; // <-- TRANSLATED
        }
    };

    const buttonProps = getButtonProps();

    // --- Render Logic ---
    return (
        <div className="flex flex-col items-center p-5 font-sans min-h-screen bg-gray-50 relative">
            {/* Back Button */}
            <button
                onClick={() => navigate('/speaking-topics')}
                className="absolute top-5 left-5 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                title="トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                aria-label="Quay lại trang chọn chủ đề" // <-- TRANSLATED
            >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>

            <h1 className="text-2xl font-bold mb-2 text-gray-800 mt-8 md:mt-0">{topicName}</h1>
            {questions.length > 0 && testState !== "NO_QUESTIONS" && (
                <p className="text-sm text-gray-500 mb-4">Câu hỏi {questionIndex + 1} / {questions.length}</p>
            )}

            {testState === "NO_QUESTIONS" && (
                <div className="w-full max-w-2xl mt-10 p-6 bg-white rounded-lg shadow-md text-center border border-red-200">
                    <p className="text-red-600 font-semibold mb-4 text-lg">
                        Không tìm thấy câu hỏi nào.
                    </p>
                    <p className="text-gray-700 mb-6">
                        Vui lòng quay lại và chọn một chủ đề để bắt đầu bài kiểm tra nói. {/* <-- TRANSLATED (Removed English) */}
                    </p>
                    <button
                        onClick={buttonProps.onClick}
                        className="px-6 py-3 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-md transition-colors"
                    >
                        {buttonProps.text}
                    </button>
                </div>
            )}

            {questions.length > 0 && testState !== "NO_QUESTIONS" && (
                <>
                    <div className="w-full max-w-2xl mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col gap-4 min-h-[250px] border border-gray-200">
                        <div className="flex justify-start">
                            <p className="bg-blue-100 text-blue-900 p-3 rounded-lg rounded-bl-none max-w-[85%] shadow-sm text-base md:text-lg">
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

                        {(audioURL && (testState === "SHOWING_RESULT" || testState === "ERROR")) && (
                            <div className="self-end mt-2 w-full max-w-[85%]">
                                <p className="text-sm text-gray-600 mb-1 text-right">あなたの録音 (Bản ghi của bạn):</p> {/* <-- TRANSLATED */}
                                <audio src={audioURL} controls className="w-full h-10 rounded" preload="metadata" />
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
                                ${buttonProps.disabled || buttonProps.loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : (testState === 'RECORDING'
                                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400'
                                        : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400')
                                }`}
                        >
                            {buttonProps.loading && <FontAwesomeIcon icon={faSpinner} spin />}
                            <span>{buttonProps.text}</span>
                        </button>

                        <p className="text-sm text-gray-500 h-5 text-center">
                            {testState === 'IDLE' && 'Nhấn "Sẵn sàng?" để chuẩn bị micro.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {testState === 'READY' && 'Nhấn "Bắt đầu Ghi" để bắt đầu.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {testState === 'RECORDING' && 'Đang ghi âm... Nhấn "Dừng Ghi" để kết thúc.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {testState === 'SHOWING_RESULT' && 'Xem lại kết quả hoặc chuyển sang câu hỏi tiếp theo.'} {/* <-- TRANSLATED (Removed English) */}
                            {testState === 'ERROR' && 'Đã xảy ra lỗi. Thử lại hoặc chuyển sang câu hỏi tiếp theo.'} {/* <-- TRANSLATED (Removed English) */}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default SpeakingTest;
