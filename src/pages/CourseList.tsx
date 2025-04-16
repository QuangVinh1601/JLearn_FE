// src/pages/CourseList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Course {
  level: string; // Use level as a unique identifier
  description: string[];
  oldPrice?: string;
  price: string;
  highlight?: boolean;
}

// Keep your existing courses array
const courses: Course[] = [
  {
    level: "SƠ CẤP",
    description: [
      "Bảng chữ cái",
      "Biến âm, Trường âm",
      "Âm ghép, Âm ngắt",
      "Luyện tập, Luyện phát âm",
      "Video hướng dẫn cách học",
    ],
    price: "0 đ",
  },
  {
    level: "N5",
    description: [
      "25 bài học",
      "870 Từ vựng",
      "100 cấu trúc ngữ pháp",
      "125 kanji",
      "Hội thoại, Đọc hiểu",
      "Nghe hiểu đơn giản",
      "Luyện tập, Luyện phát âm",
    ],
    oldPrice: "7.000.000 đ",
    price: "5.500.000 đ",
    highlight: true,
  },
  {
    level: "N4",
    description: [
      "25 bài học",
      "+840 Từ vựng",
      "+100 cấu trúc ngữ pháp",
      "+125 Kanji",
      "Hội thoại, Đọc hiểu",
      "Nghe hiểu cơ bản",
      "Luyện tập, Luyện phát âm",
    ],
    oldPrice: "6.000.000 đ",
    price: "5.000.000 đ",
  },
  {
    level: "N3",
    description: [
      "32 bài học",
      "+1000 Từ vựng",
      "+100 cấu trúc ngữ pháp",
      "+300 Kanji",
      "Hội thoại, Đọc hiểu",
      "Nghe hiểu thành thạo",
      "Luyện tập, Luyện phát âm",
    ],
    oldPrice: "7.500.000 đ",
    price: "6.500.000 đ",
  },
];

// Helper function to get purchased courses from localStorage
const getPurchasedCourses = (): string[] => {
  const purchased = localStorage.getItem('purchasedCourses');
  return purchased ? JSON.parse(purchased) : [];
};

// Helper function to save purchased courses to localStorage
const savePurchasedCourses = (courses: string[]) => {
  localStorage.setItem('purchasedCourses', JSON.stringify(courses));
};


const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>(getPurchasedCourses());

  // Function to handle purchase simulation or entering the course
  const handlePurchaseOrEnter = (courseLevel: string, isFree: boolean) => {
    if (isFree || purchasedCourses.includes(courseLevel)) {
      // Navigate to the lesson page for this course level
      navigate(`/course/${courseLevel}/lessons`);
    } else {
      // Simulate purchase
      const confirmPurchase = window.confirm(`Bạn có muốn "mua" khóa học ${courseLevel} không? (Đây là bản demo)`);
      if (confirmPurchase) {
        const updatedPurchased = [...purchasedCourses, courseLevel];
        setPurchasedCourses(updatedPurchased);
        savePurchasedCourses(updatedPurchased);
        alert(`Đã "mua" thành công khóa học ${courseLevel}! Bạn có thể vào học ngay.`);
        // Optionally navigate immediately after purchase:
        // navigate(`/course/${courseLevel}/lessons`);
      }
    }
  };

  useEffect(() => {
    // Ensure the state is synced with localStorage on initial load
    setPurchasedCourses(getPurchasedCourses());
  }, []);

  return (
    <div className="bg-gray-50 py-10 px-4 md:px-10 min-h-screen"> {/* Added min-h-screen */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        KHÓA HỌC TƯƠNG TÁC QUA ZOOM
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {courses.map((course) => {
          const isFree = course.price === "0 đ";
          const isPurchased = purchasedCourses.includes(course.level);
          const canAccess = isFree || isPurchased;

          return (
            <div
              key={course.level} // Use level as key
              className={`rounded-lg p-6 border shadow-md bg-white flex flex-col justify-between transition-all duration-300 ${course.highlight ? "border-red-300 ring-2 ring-red-400" : "border-gray-200"
                } ${canAccess ? "bg-green-50" : ""}`} // Highlight accessible courses
            >
              {/* Tiêu đề */}
              <div className={`text-white font-bold text-xl text-center py-2 rounded-t-md mb-4 ${canAccess ? 'bg-green-600' : 'bg-red-500'}`}>
                {course.level}
                {canAccess && !isFree && <span className="text-xs block">(Đã mua)</span>}
                {isFree && <span className="text-xs block">(Miễn phí)</span>}
              </div>

              {/* Mô tả */}
              <ul className="text-sm text-gray-700 space-y-1 mb-6 flex-grow"> {/* Added flex-grow */}
                {course.description.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Giá */}
              <div className="text-center mt-auto">
                {!isPurchased && ( // Only show price if not purchased
                  <>
                    {course.oldPrice && (
                      <div className="text-sm line-through text-gray-500 mb-1">
                        {course.oldPrice}
                      </div>
                    )}
                    <div className={`text-lg font-bold mb-3 ${isFree ? 'text-green-600' : 'text-red-600'}`}>
                      {course.price}
                    </div>
                  </>
                )}

                <button
                  onClick={() => handlePurchaseOrEnter(course.level, isFree)}
                  className={`w-full text-white py-2 rounded-md transition font-semibold ${canAccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {canAccess ? "Vào học" : "Đăng kí ngay"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseList;
