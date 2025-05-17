// src/pages/CourseLessons.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHeadphones,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { getPurchasedProductIds } from "./CourseList"; // Import the correct function
import { fetchProducts } from "../services/api/apiPurchase"; // Import product types and fetch function
import { Product, ProductType } from "../types/purchase";
// --- Define Lesson Structure ---
interface Lesson {
  id: string;
  title: string;
  type: "reading" | "listening";
}

// --- Sample Lesson Data (Replace with your actual data structure/fetching) ---
const allLessonsData: Record<string, Lesson[]> = {
  "SƠ CẤP": [
    { id: "sc-r1", title: "Bài đọc Bảng chữ cái Hiragana", type: "reading" },
    { id: "sc-r2", title: "Bài đọc Bảng chữ cái Katakana", type: "reading" },
    { id: "sc-l1", title: "Nghe và nhận biết âm cơ bản", type: "listening" },
    { id: "sc-l2", title: "Nghe và lặp lại từ đơn giản", type: "listening" },
  ],
  N5: [
    {
      id: "n5-r1",
      title: "Bài đọc hiểu N5 - Chủ đề Gia đình",
      type: "reading",
    },
    { id: "n5-r2", title: "Bài đọc hiểu N5 - Chủ đề Mua sắm", type: "reading" },
    {
      id: "n5-r3",
      title: "Bài đọc hiểu N5 - Chủ đề Trường học",
      type: "reading",
    },
    {
      id: "n5-l1",
      title: "Bài nghe hiểu N5 - Giới thiệu bản thân",
      type: "listening",
    },
    { id: "n5-l2", title: "Bài nghe hiểu N5 - Hỏi đường", type: "listening" },
    {
      id: "n5-l3",
      title: "Bài nghe hiểu N5 - Tại nhà hàng",
      type: "listening",
    },
  ],
  N4: [
    {
      id: "n4-r1",
      title: "Bài đọc hiểu N4 - Email công việc",
      type: "reading",
    },
    { id: "n4-r2", title: "Bài đọc hiểu N4 - Thông báo", type: "reading" },
    {
      id: "n4-l1",
      title: "Bài nghe hiểu N4 - Cuộc trò chuyện điện thoại",
      type: "listening",
    },
    {
      id: "n4-l2",
      title: "Bài nghe hiểu N4 - Tin tức ngắn",
      type: "listening",
    },
  ],
  N3: [
    { id: "n3-r1", title: "Bài đọc hiểu N3 - Bài báo ngắn", type: "reading" },
    {
      id: "n3-r2",
      title: "Bài đọc hiểu N3 - Hướng dẫn sử dụng",
      type: "reading",
    },
    { id: "n3-l1", title: "Bài nghe hiểu N3 - Phỏng vấn", type: "listening" },
    {
      id: "n3-l2",
      title: "Bài nghe hiểu N3 - Bài giảng ngắn",
      type: "listening",
    },
  ],
  // Add more levels and lessons as needed
};

const CourseLessons: React.FC = () => {
  const { level } = useParams<{ level: string }>(); // Get level from URL
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    if (!level) {
      // Redirect if level is somehow missing
      navigate("/course");
      return;
    }

    const checkAccessAndLoadLessons = async () => {
      setLoading(true);
      try {
        const allProductsData = await fetchProducts();
        const localPurchasedProductIds = getPurchasedProductIds(); // Get IDs from localStorage

        // Find the product corresponding to the current URL level
        const currentCourseProduct = allProductsData.find(
          (product) =>
            product.type === ProductType.Course &&
            product.level?.toLowerCase() === level.toLowerCase(),
        );

        let accessGranted = false;
        if (currentCourseProduct) {
          const isFree = currentCourseProduct.price === 0;
          const isPurchased = localPurchasedProductIds.includes(
            currentCourseProduct.id,
          );
          accessGranted = isFree || isPurchased;
        } else {
          // Handle case where level from URL doesn't match any product
          // For example, "n0" or "Sơ cấp" might be a free tier not in products, or an invalid level
          if (
            level.toLowerCase() === "n0" ||
            level.toUpperCase() === "SƠ CẤP"
          ) {
            // Example: "n0" or "Sơ cấp" is conceptual free level
            accessGranted = true;
          } else {
            console.warn(`No product found for course level: ${level}`);
          }
        }

        setHasAccess(accessGranted);

        if (accessGranted) {
          setLessons(allLessonsData[level.toUpperCase()] || []);
        } else {
          console.warn(`User does not have access to course level: ${level}`);
        }
      } catch (error) {
        console.error("Error checking access or loading lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoadLessons();
  }, [level, navigate]);

  // Group lessons by type
  const readingLessons = lessons.filter((lesson) => lesson.type === "reading");
  const listeningLessons = lessons.filter(
    (lesson) => lesson.type === "listening",
  );

  if (!level) {
    return <div>Đang tải...</div>; // Or some loading indicator
  }

  if (loading) {
    // Show loading indicator while checking access
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center text-center">
        Đang tải thông tin khóa học...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-700 mb-6">
          Bạn chưa mua khóa học cấp độ{" "}
          <span className="font-semibold">{level}</span>.
        </p>
        <button
          onClick={() => navigate("/course")}
          className="bg-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Quay lại danh sách khóa học
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
        {/* Back Button */}
        <button
          onClick={() => navigate("/course")}
          className="mb-6 text-red-600 hover:text-red-800 font-medium flex items-center"
          title="Quay lại danh sách khóa học"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Danh sách khóa học
        </button>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Bài tập Khóa học {level}
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Chọn bài tập để bắt đầu luyện tập.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reading Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-red-700 border-b-2 border-red-200 pb-2 flex items-center">
              <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
              Bài tập Đọc
            </h2>
            {readingLessons.length > 0 ? (
              <ul className="space-y-3">
                {readingLessons.map((lesson) => (
                  <li key={lesson.id}>
                    {/* Replace Link with actual navigation to the exercise component */}
                    <Link
                      to={`/exercise/${lesson.id}`} // Example route, adjust as needed
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

          {/* Listening Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-blue-700 border-b-2 border-blue-200 pb-2 flex items-center">
              <FontAwesomeIcon icon={faHeadphones} className="mr-3" />
              Bài tập Nghe
            </h2>
            {listeningLessons.length > 0 ? (
              <ul className="space-y-3">
                {listeningLessons.map((lesson) => (
                  <li key={lesson.id}>
                    {/* Replace Link with actual navigation to the exercise component */}
                    <Link
                      to={`/exercise/${lesson.id}`} // Example route, adjust as needed
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

export default CourseLessons;
