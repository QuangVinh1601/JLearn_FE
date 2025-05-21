import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHeadphones,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

interface Lesson {
  id: string;
  title: string;
  type: "reading" | "listening";
}

const allLessonsData: Record<string, Lesson[]> = {
  "N5": [
    { id: 'n5-r1', title: 'Bài đọc hiểu N5 - Giới thiệu bản thân', type: 'reading' },
    { id: 'n5-r2', title: 'Bài đọc hiểu N5 - Gia đình', type: 'reading' },
    { id: 'n5-r3', title: 'Bài đọc hiểu N5 - Thời gian', type: 'reading' },
    { id: 'n5-r4', title: 'Bài đọc hiểu N5 - Địa điểm', type: 'reading' },
    { id: 'n5-r5', title: 'Bài đọc hiểu N5 - Mua sắm', type: 'reading' },
    { id: 'n5-l1', title: 'Bài nghe hiểu N5 - Giới thiệu bản thân', type: 'listening' },
    { id: 'n5-l2', title: 'Bài nghe hiểu N5 - Gia đình', type: 'listening' },
    { id: 'n5-l3', title: 'Bài nghe hiểu N5 - Thời gian', type: 'listening' },
    { id: 'n5-l4', title: 'Bài nghe hiểu N5 - Địa điểm', type: 'listening' },
    { id: 'n5-l5', title: 'Bài nghe hiểu N5 - Mua sắm', type: 'listening' },
  ],
  "N4": [
    { id: 'n4-r1', title: 'Bài đọc hiểu N4 - Công việc', type: 'reading' },
    { id: 'n4-r2', title: 'Bài đọc hiểu N4 - Du lịch', type: 'reading' },
    { id: 'n4-r3', title: 'Bài đọc hiểu N4 - Sở thích', type: 'reading' },
    { id: 'n4-r4', title: 'Bài đọc hiểu N4 - Sức khỏe', type: 'reading' },
    { id: 'n4-r5', title: 'Bài đọc hiểu N4 - Giao tiếp cơ bản', type: 'reading' },
    { id: 'n4-l1', title: 'Bài nghe hiểu N4 - Công việc', type: 'listening' },
    { id: 'n4-l2', title: 'Bài nghe hiểu N4 - Du lịch', type: 'listening' },
    { id: 'n4-l3', title: 'Bài nghe hiểu N4 - Sở thích', type: 'listening' },
    { id: 'n4-l4', title: 'Bài nghe hiểu N4 - Sức khỏe', type: 'listening' },
    { id: 'n4-l5', title: 'Bài nghe hiểu N4 - Giao tiếp cơ bản', type: 'listening' },
  ],
  "N3": [
    { id: 'n3-r1', title: 'Bài đọc hiểu N3 - Tin tức', type: 'reading' },
    { id: 'n3-r2', title: 'Bài đọc hiểu N3 - Thư tín', type: 'reading' },
    { id: 'n3-r3', title: 'Bài đọc hiểu N3 - Thảo luận', type: 'reading' },
    { id: 'n3-r4', title: 'Bài đọc hiểu N3 - Phỏng vấn', type: 'reading' },
    { id: 'n3-r5', title: 'Bài đọc hiểu N3 - Báo cáo', type: 'reading' },
    { id: 'n3-l1', title: 'Bài nghe hiểu N3 - Tin tức', type: 'listening' },
    { id: 'n3-l2', title: 'Bài nghe hiểu N3 - Thư tín', type: 'listening' },
    { id: 'n3-l3', title: 'Bài nghe hiểu N3 - Thảo luận', type: 'listening' },
    { id: 'n3-l4', title: 'Bài nghe hiểu N3 - Phỏng vấn', type: 'listening' },
    { id: 'n3-l5', title: 'Bài nghe hiểu N3 - Báo cáo', type: 'listening' },
  ],
  "N2": [
    { id: 'n2-r1', title: 'Bài đọc hiểu N2 - Bài báo chuyên sâu', type: 'reading' },
    { id: 'n2-r2', title: 'Bài đọc hiểu N2 - Hội nghị', type: 'reading' },
    { id: 'n2-r3', title: 'Bài đọc hiểu N2 - Phân tích', type: 'reading' },
    { id: 'n2-r4', title: 'Bài đọc hiểu N2 - Tranh luận', type: 'reading' },
    { id: 'n2-r5', title: 'Bài đọc hiểu N2 - Tổng hợp', type: 'reading' },
    { id: 'n2-l1', title: 'Bài nghe hiểu N2 - Bài báo chuyên sâu', type: 'listening' },
    { id: 'n2-l2', title: 'Bài nghe hiểu N2 - Hội nghị', type: 'listening' },
    { id: 'n2-l3', title: 'Bài nghe hiểu N2 - Phân tích', type: 'listening' },
    { id: 'n2-l4', title: 'Bài nghe hiểu N2 - Tranh luận', type: 'listening' },
    { id: 'n2-l5', title: 'Bài nghe hiểu N2 - Tổng hợp', type: 'listening' },
  ],
  "SƠ CẤP": [
    { id: 'sc-r1', title: 'Bài đọc Bảng chữ cái Hiragana', type: 'reading' },
    { id: 'sc-r2', title: 'Bài đọc Bảng chữ cái Katakana', type: 'reading' },
    { id: 'sc-l1', title: 'Nghe và nhận biết âm cơ bản', type: 'listening' },
    { id: 'sc-l2', title: 'Nghe và lặp lại từ đơn giản', type: 'listening' },
  ],
  // Add more levels and lessons as needed
};

const LessonsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!courseId) {
      navigate("/course");
      return;
    }

    setLessons(allLessonsData[courseId.toUpperCase()] || []);
  }, [courseId, navigate]);

  const readingLessons = lessons.filter((lesson) => lesson.type === "reading");
  const listeningLessons = lessons.filter(
    (lesson) => lesson.type === "listening",
  );

  if (!courseId) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
        <button
          onClick={() => navigate("/course")}
          className="mb-6 text-red-600 hover:text-red-800 font-medium flex items-center"
          title="Quay lại danh sách khóa học"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Danh sách khóa học
        </button>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Bài tập Khóa học {courseId}
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Chọn bài tập để bắt đầu luyện tập.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-red-700 border-b-2 border-red-200 pb-2 flex items-center">
              <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
              Bài tập Đọc
            </h2>
            {readingLessons.length > 0 ? (
              <ul className="space-y-3">
                {readingLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/exercise/${lesson.id}`}
                      className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 hover:shadow-sm transition-all duration-200"
                      title={`Bắt đầu bài tập: ${lesson.title}`}
                    >
                      <span className="text-gray-800 font-medium">
                        {lesson.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                Chưa có bài tập đọc cho cấp độ này.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-5 text-blue-700 border-b-2 border-blue-200 pb-2 flex items-center">
              <FontAwesomeIcon icon={faHeadphones} className="mr-3" />
              Bài tập Nghe
            </h2>
            {listeningLessons.length > 0 ? (
              <ul className="space-y-3">
                {listeningLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      to={`/exercise/${lesson.id}`}
                      className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 hover:shadow-sm transition-all duration-200"
                      title={`Bắt đầu bài tập: ${lesson.title}`}
                    >
                      <span className="text-gray-800 font-medium">
                        {lesson.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                Chưa có bài tập nghe cho cấp độ này.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
