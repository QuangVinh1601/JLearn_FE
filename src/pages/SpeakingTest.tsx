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
            // setErrorMessage("Trình duyệt của bạn không hỗ trợ ghi âm. (Your browser does not support audio recording.)");
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
            // Use 'audio/webm' for broad compatibility, check support if needed
            const options = { mimeType: 'audio/webm' };
            let recorder: MediaRecorder;
            try {
                recorder = new MediaRecorder(stream, options);
            } catch (e) {
                console.warn("audio/webm not supported, trying default.", e);
                // Fallback to default mimeType if webm isn't supported
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

            recorder.onstop = async () => {
                console.log("Recording stopped. Processing audio...");
                setTestState("PROCESSING");

                // --- Create Blob and URL ---
                const mimeType = mediaRecorder.current?.mimeType || 'audio/webm'; // Get actual mimeType used
                const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                const url = URL.createObjectURL(audioBlob);

                // Revoke previous URL if exists
                if (audioURL) {
                    URL.revokeObjectURL(audioURL);
                    console.log("Revoked previous Object URL:", audioURL);
                }
                setAudioURL(url); // Set new URL for playback
                console.log("Created new Object URL:", url);

                // --- Prepare FormData for API ---
                const audioFile = new File([audioBlob], `recording_${Date.now()}.${mimeType.split('/')[1] || 'webm'}`, { type: mimeType });
                const formData = new FormData();
                formData.append("audio", audioFile); // The audio file
                // Ensure the current question exists before appending
                if (questions && questions.length > questionIndex) {
                    formData.append("question", questions[questionIndex]); // The question text
                } else {
                    console.warn("Current question index is out of bounds or questions array is empty.");
                    // Decide how to handle this - maybe send without question or show error?
                    // For now, we proceed without the 'question' field if it's missing.
                }

                // --- API Call ---
                try {
                    console.log("Sending audio to API...");
                    // !!! CRITICAL: Replace with your ACTUAL API endpoint !!!
                    const apiEndpoint = "https://your-backend-api.com/process-speaking";
                    // const apiEndpoint = "https://api.example.com/process-japanese-audio"; // Placeholder

                    if (apiEndpoint.includes("api.example.com") || apiEndpoint.includes("your-backend-api.com")) {
                        console.warn("Using placeholder API endpoint. Replace with your actual backend URL.");
                        // Simulate API response for testing without a real backend
                        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                        // setApiResponse(`これは「${questions[questionIndex]}」に対する模擬応答です。(Đây là phần ghi âm của bạn để nghe lại "${questions[questionIndex]}")`);
                        setApiResponse(`Đây là phần ghi âm của bạn để nghe lại cho câu hỏi: "${questions[questionIndex]}"`); // <-- TRANSLATED (Removed English)
                        setTestState("SHOWING_RESULT");
                    } else {
                        // Actual API call
                        const apiRes = await fetch(apiEndpoint, {
                            method: "POST",
                            body: formData,
                            // Add headers if required by your API (e.g., Authorization)
                            // headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
                        });

                        if (!apiRes.ok) {
                            // Handle API errors (like 4xx, 5xx)
                            let errorText = `API Error ${apiRes.status}: ${apiRes.statusText}`;
                            try {
                                const errorBody = await apiRes.json(); // Try to parse JSON error response
                                errorText = errorBody.message || errorBody.error || JSON.stringify(errorBody);
                            } catch {
                                // If response is not JSON or empty
                                errorText = await apiRes.text() || errorText;
                            }
                            throw new Error(errorText);
                        }

                        // --- Process Successful API Response ---
                        const data = await apiRes.json(); // Assuming API returns JSON
                        // Adjust 'data.answer' based on your actual API response structure
                        // setApiResponse(data.answer || data.transcription || "応答がありません。(No response received.)");
                        setApiResponse(data.answer || data.transcription || "Không nhận được phản hồi."); // <-- TRANSLATED (Removed English)
                        setTestState("SHOWING_RESULT");
                        console.log("API response received:", data);
                    }

                } catch (apiError: any) {
                    // Handle network errors or errors thrown from API response check
                    console.error("Error sending/processing audio via API:", apiError);
                    // setErrorMessage(`API Error: ${apiError.message || "Không thể xử lý âm thanh. (Failed to process audio.)"}`);
                    setErrorMessage(`API Error: ${apiError.message || "Không thể xử lý âm thanh."}`); // <-- TRANSLATED (Removed English)
                    setTestState("ERROR");
                } finally {
                    // Cleanup stream regardless of API success or failure,
                    // but *after* blob/URL creation and API call attempt.
                    // Note: cleanupStream is called here, maybe redundant if called elsewhere?
                    // Let's rely on handleNextQuestion or unmount for final cleanup.
                    // cleanupStream(); // Re-evaluating if needed here. Might stop stream needed for retries?
                    audioChunks.current = []; // Clear chunks for next recording
                }
            };

            recorder.onerror = (event: Event) => {
                console.error("MediaRecorder Error:", event);
                // Cast event to MediaRecorderErrorEvent if specific error details are needed
                // const errorEvent = event as MediaRecorderErrorEvent;
                // setErrorMessage(`Lỗi ghi âm: ${(event as any)?.error?.name || 'Unknown error'}. (Recording error.)`);
                setErrorMessage(`Lỗi ghi âm: ${(event as any)?.error?.name || 'Lỗi không xác định'}.`); // <-- TRANSLATED (Removed English, translated 'Unknown error')
                setTestState("ERROR");
                cleanupStream(); // Clean up on recorder error
            };

            // --- Ready to Record ---
            console.log("MediaRecorder initialized. Ready to record.");
            setTestState("READY");

        } catch (err: any) {
            // Handle errors during getUserMedia (e.g., permission denied)
            console.error("Error accessing microphone:", err);
            // let userMessage = "Không thể truy cập micro. (Could not access microphone.)";
            let userMessage = "Không thể truy cập micro."; // <-- TRANSLATED (Removed English)
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                // userMessage = "Bạn đã từ chối quyền truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt. (Microphone permission denied. Please grant permission in browser settings.)";
                userMessage = "Bạn đã từ chối quyền truy cập micro. Vui lòng cấp quyền trong cài đặt trình duyệt."; // <-- TRANSLATED (Removed English)
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                // userMessage = "Không tìm thấy thiết bị micro nào. (No microphone device found.)";
                userMessage = "Không tìm thấy thiết bị micro nào."; // <-- TRANSLATED (Removed English)
            } else {
                userMessage = `Lỗi micro (${err.name}): ${err.message}`;
            }
            setErrorMessage(userMessage);
            setTestState("ERROR");
            cleanupStream(); // Clean up if permission fails
        }
    }, [testState, audioURL, questions, questionIndex, cleanupStream]); // Dependencies for the callback

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
            // If idle or error, try to get permission first
            requestMicPermissionAndInitRecorder();
        } else {
            console.warn(`Cannot start recording in state: ${testState}`);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && testState === "RECORDING") {
            console.log("Stopping recording (manual trigger)...");
            // The onstop handler will be triggered automatically
            mediaRecorder.current.stop();
            // State change to PROCESSING happens in the onstop handler
        } else {
            console.warn(`Cannot stop recording in state: ${testState}`);
        }
    };

    // --- Navigation Between Questions ---
    const handleNextQuestion = () => {
        console.log("Handling Next Question / Resetting...");
        // Always clean up stream and recorder state before moving on
        cleanupStream();

        // Revoke audio URL if it exists
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
            console.log("Revoked Object URL on next question:", audioURL);
        }

        // Reset state for the next question or topic selection
        setApiResponse(null);
        setAudioURL(null);
        setErrorMessage(null);

        // Check if there are more questions
        if (questions && questionIndex + 1 < questions.length) {
            setQuestionIndex((prev) => prev + 1);
            setTestState("IDLE"); // Go back to idle state for the next question
            console.log("Moving to next question, index:", questionIndex + 1);
        } else {
            // No more questions in this topic
            console.log("End of questions for this topic. Navigating back.");
            navigate('/speaking-topics'); // Navigate back to the topic selection page
        }
    };

    // --- Determine Button Properties Based on State ---
    const getButtonProps = (): { text: string; onClick: () => void; disabled: boolean; loading: boolean; } => {
        switch (testState) {
            case "IDLE":
                // return { text: "準備 (Ready?)", onClick: requestMicPermissionAndInitRecorder, disabled: false, loading: false };
                return { text: "準備 (Sẵn sàng?)", onClick: requestMicPermissionAndInitRecorder, disabled: false, loading: false }; // <-- TRANSLATED
            case "REQUESTING_PERMISSION":
                return { text: "Đang yêu cầu quyền...", onClick: () => { }, disabled: true, loading: true };
            case "READY":
                // return { text: "録音開始 (Start Recording)", onClick: startRecording, disabled: false, loading: false };
                return { text: "録音開始 (Bắt đầu Ghi)", onClick: startRecording, disabled: false, loading: false }; // <-- TRANSLATED
            case "RECORDING":
                // return { text: "録音停止 (Stop Recording)", onClick: stopRecording, disabled: false, loading: false };
                return { text: "録音停止 (Dừng Ghi)", onClick: stopRecording, disabled: false, loading: false }; // <-- TRANSLATED
            case "PROCESSING":
                // return { text: "処理中... (Processing...)", onClick: () => { }, disabled: true, loading: true };
                return { text: "処理中... (Đang xử lý...)", onClick: () => { }, disabled: true, loading: true }; // <-- TRANSLATED
            case "SHOWING_RESULT":
                const isLastQuestion = !(questions && questionIndex + 1 < questions.length);
                // const nextButtonText = isLastQuestion
                //     ? "トピック選択へ戻る (Back to Topics)"
                //     : "次の質問へ (Next Question)";
                const nextButtonText = isLastQuestion
                    ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                    : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
                return { text: nextButtonText, onClick: handleNextQuestion, disabled: false, loading: false };
            case "ERROR":
                // Allow retry or moving to next question
                const errorButtonText = !(questions && questionIndex + 1 < questions.length)
                    // ? "トピック選択へ戻る (Back to Topics)"
                    // : "次の質問へ (Next Question)";
                    ? "トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                    : "次の質問へ (Câu hỏi Tiếp theo)"; // <-- TRANSLATED
                // Or maybe "再試行 (Retry)" which calls requestMicPermissionAndInitRecorder?
                // Let's stick with "Next/Back" for simplicity now.
                return { text: errorButtonText, onClick: handleNextQuestion, disabled: false, loading: false };
            case "NO_QUESTIONS":
                // return { text: "トピックを選択してください (Select a Topic)", onClick: () => navigate('/speaking-topics'), disabled: false, loading: false };
                return { text: "トピックを選択してください (Chọn Chủ đề)", onClick: () => navigate('/speaking-topics'), disabled: false, loading: false }; // <-- TRANSLATED
            default: // Should not happen
                // return { text: "状態不明 (Unknown State)", onClick: () => { }, disabled: true, loading: false };
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
                // title="トピック選択へ戻る (Back to Topics)"
                // aria-label="Back to topic selection"
                title="トピック選択へ戻る (Quay lại Chủ đề)" // <-- TRANSLATED
                aria-label="Quay lại trang chọn chủ đề" // <-- TRANSLATED
            >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>

            <h1 className="text-2xl font-bold mb-2 text-gray-800 mt-8 md:mt-0">{topicName}</h1>
            {/* Show question count only if questions exist */}
            {questions.length > 0 && testState !== "NO_QUESTIONS" && (
                <p className="text-sm text-gray-500 mb-4">Câu hỏi {questionIndex + 1} / {questions.length}</p>
            )}

            {/* === State: NO_QUESTIONS === */}
            {testState === "NO_QUESTIONS" && (
                <div className="w-full max-w-2xl mt-10 p-6 bg-white rounded-lg shadow-md text-center border border-red-200">
                    <p className="text-red-600 font-semibold mb-4 text-lg">
                        Không tìm thấy câu hỏi nào.
                    </p>
                    <p className="text-gray-700 mb-6">
                        {/* Vui lòng quay lại và chọn một chủ đề để bắt đầu bài kiểm tra nói.
                        (No questions found. Please go back and select a topic to start the speaking test.) */}
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

            {/* === Render Main Test UI only if questions exist === */}
            {questions.length > 0 && testState !== "NO_QUESTIONS" && (
                <>
                    {/* Chat Area */}
                    <div className="w-full max-w-2xl mb-6 p-4 bg-white rounded-lg shadow-md flex flex-col gap-4 min-h-[250px] border border-gray-200">
                        {/* Question Display */}
                        <div className="flex justify-start">
                            <p className="bg-blue-100 text-blue-900 p-3 rounded-lg rounded-bl-none max-w-[85%] shadow-sm text-base md:text-lg">
                                {questions[questionIndex]}
                            </p>
                        </div>

                        {/* Status Indicators */}
                        <div className="self-center text-center h-6 my-2"> {/* Added height and margin */}
                            {testState === "RECORDING" && (
                                <div className="text-red-600 font-semibold flex items-center gap-2 animate-pulse">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    {/* 録音中... (Recording...) */}
                                    録音中... (Đang ghi âm...) {/* <-- TRANSLATED */}
                                </div>
                            )}
                            {testState === "PROCESSING" && (
                                <div className="text-gray-600 font-semibold flex items-center gap-2">
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    {/* 処理中... (Processing...) */}
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


                        {/* API Response Display */}
                        {apiResponse && testState === "SHOWING_RESULT" && (
                            <div className="flex justify-end">
                                <p className="bg-green-100 text-green-900 p-3 rounded-lg rounded-br-none max-w-[85%] shadow-sm text-base md:text-lg">
                                    {apiResponse}
                                </p>
                            </div>
                        )}

                        {/* Audio Player for Review */}
                        {(audioURL && (testState === "SHOWING_RESULT" || testState === "ERROR")) && (
                            <div className="self-end mt-2 w-full max-w-[85%]">
                                {/* <p className="text-sm text-gray-600 mb-1 text-right">あなたの録音 (Your Recording):</p> */}
                                <p className="text-sm text-gray-600 mb-1 text-right">あなたの録音 (Bản ghi của bạn):</p> {/* <-- TRANSLATED */}
                                <audio src={audioURL} controls className="w-full h-10 rounded" preload="metadata" />
                            </div>
                        )}

                        {/* Error Message Display */}
                        {errorMessage && (
                            <div className="flex justify-center mt-2">
                                <p className="bg-red-100 text-red-700 p-3 rounded-lg max-w-[95%] text-center shadow-sm border border-red-200 text-sm">
                                    <strong>Lỗi:</strong> {errorMessage}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Controls Area */}
                    <div className="w-full max-w-2xl flex flex-col items-center gap-3">
                        {/* Primary Action Button */}
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

                        {/* Helper Text */}
                        <p className="text-sm text-gray-500 h-5 text-center"> {/* Added text-center */}
                            {/* {testState === 'IDLE' && 'Nhấn "Ready?" để chuẩn bị micro. (Press "Ready?" to prepare microphone)'} */}
                            {testState === 'IDLE' && 'Nhấn "Sẵn sàng?" để chuẩn bị micro.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {/* {testState === 'READY' && 'Nhấn "Start Recording" để bắt đầu. (Press "Start Recording" to begin)'} */}
                            {testState === 'READY' && 'Nhấn "Bắt đầu Ghi" để bắt đầu.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {/* {testState === 'RECORDING' && 'Đang ghi âm... Nhấn "Stop Recording" để dừng. (Recording... Press "Stop Recording" to finish)'} */}
                            {testState === 'RECORDING' && 'Đang ghi âm... Nhấn "Dừng Ghi" để kết thúc.'} {/* <-- TRANSLATED (Removed English, updated button text) */}
                            {/* {testState === 'SHOWING_RESULT' && 'Xem lại kết quả hoặc chuyển sang câu hỏi tiếp theo. (Review the result or proceed to the next question)'} */}
                            {testState === 'SHOWING_RESULT' && 'Xem lại kết quả hoặc chuyển sang câu hỏi tiếp theo.'} {/* <-- TRANSLATED (Removed English) */}
                            {/* {testState === 'ERROR' && 'Đã xảy ra lỗi. Thử lại hoặc chuyển sang câu hỏi tiếp theo. (An error occurred. Retry or proceed to the next question)'} */}
                            {testState === 'ERROR' && 'Đã xảy ra lỗi. Thử lại hoặc chuyển sang câu hỏi tiếp theo.'} {/* <-- TRANSLATED (Removed English) */}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default SpeakingTest;
