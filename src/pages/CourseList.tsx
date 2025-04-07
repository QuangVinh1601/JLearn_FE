import React from "react";

interface Course {
  level: string;
  description: string[];
  oldPrice?: string;
  price: string;
  highlight?: boolean;
}

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

const CourseList: React.FC = () => {
  return (
    <div className="bg-gray-50 py-10 px-4 md:px-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        KHÓA HỌC TƯƠNG TÁC QUA ZOOM
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 border shadow-md bg-white flex flex-col justify-between ${
              course.highlight ? "bg-red-100 border-red-300" : ""
            }`}
          >
            {/* Tiêu đề */}
            <div className="bg-red-500 text-white font-bold text-xl text-center py-2 rounded-t-md mb-4">
              {course.level}
            </div>

            {/* Mô tả */}
            <ul className="text-sm text-gray-700 space-y-1 mb-6">
              {course.description.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>

            {/* Giá */}
            <div className="text-center mt-auto">
              {course.oldPrice && (
                <div className="text-sm line-through text-gray-500 mb-1">
                  {course.oldPrice}
                </div>
              )}
              <div className="text-lg font-bold text-red-600 mb-3">
                {course.price}
              </div>

              <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
                Đăng kí ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;