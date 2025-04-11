// src/pages/SpeakingTopics.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { speakingTopicsData, SpeakingTopic } from '../data/speakingTopics'; // Adjust path if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons'; // Using a microphone icon

const SpeakingTopics: React.FC = () => {
    const navigate = useNavigate();

    // Updated handler: Navigates with only the selected question
    const handleSelectQuestion = (topic: SpeakingTopic, questionIndex: number) => {
        const selectedQuestion = topic.questions[questionIndex];
        // Navigate to the SpeakingTest page, passing only the selected question
        // and the topic name via route state.
        navigate('/speaking-test', {
            state: {
                questions: [selectedQuestion], // Send as an array with one item
                topicName: `${topic.name} - Câu hỏi ${questionIndex + 1}`, // More specific topic name for clarity
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
                {/* スピーキングテストのトピックを選択 (Select Speaking Test Topic & Question) */}
                スピーキングテストのトピックを選択 (Chọn Chủ đề & Câu hỏi Kiểm tra Nói) {/* <-- TRANSLATED */}
            </h1>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {speakingTopicsData.map((topic) => (
                    <div
                        key={topic.id}
                        className="bg-white rounded-xl shadow-lg p-6 flex flex-col border border-gray-200" // Removed hover effect from main card
                    >
                        {/* Topic Header */}
                        <div className="text-center mb-5">
                            <h2 className="text-xl font-semibold mb-2 text-blue-700">
                                {topic.name}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {topic.description}
                            </p>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-3 flex-grow">
                            <h3 className="text-md font-semibold text-gray-700 mb-2 border-b pb-1">
                                Chọn câu hỏi để trả lời: ({topic.questions.length} câu hỏi)
                            </h3>
                            <ul className="list-none space-y-2 max-h-60 overflow-y-auto pr-2"> {/* Added scroll for long lists */}
                                {topic.questions.map((question, index) => (
                                    <li
                                        key={index}
                                        className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
                                        onClick={() => handleSelectQuestion(topic, index)}
                                        title={`Bắt đầu trả lời câu hỏi ${index + 1}`}
                                    >
                                        <span className="text-gray-800 text-sm flex-1 mr-3">
                                            {index + 1}. {question}
                                        </span>
                                        <FontAwesomeIcon
                                            icon={faMicrophoneAlt}
                                            className="text-blue-500 group-hover:text-blue-700 transition-colors duration-200"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Optional: Add a footer or keep it clean */}
                        {/* <div className="mt-auto pt-4 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-400">Chọn một câu hỏi ở trên để bắt đầu bài kiểm tra.</p> // <-- TRANSLATED (Commented out)
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpeakingTopics;
