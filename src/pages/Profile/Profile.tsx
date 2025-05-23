import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductType } from "../../types/purchase";
import { getPurchasedProductIds, fetchProducts } from "../CourseList";
import { fetchUserInfo } from "../../api/apiClient";
import ImgProfile from "../../assets/images/profile-icon.png";

// Thêm các biểu tượng (ví dụ từ react-icons)
import { FaBookOpen, FaHeadphones, FaPencilAlt, FaCalendarAlt, FaEnvelope, FaIdCard, FaGraduationCap, FaLayerGroup, FaArrowRight } from 'react-icons/fa';

interface UserInfo {
  CreatedAt: string;
  Email: string;
  Username: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userID, setUserId] = useState<string>("");
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(true);

  // Lấy ID người dùng từ localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userID')?.toUpperCase();
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Nếu không có userID, có thể chuyển hướng đến trang đăng nhập hoặc xử lý phù hợp
      // navigate('/login'); // Ví dụ
      setUserInfoLoading(false); // Dừng tải thông tin người dùng nếu không có ID
      setLoading(false); // Dừng tải sản phẩm
    }
  }, [navigate]);

  // Tải thông tin người dùng từ API
  useEffect(() => {
    const getUserInfo = async () => {
      if (!userID) {
        setUserInfoLoading(false); // Đảm bảo dừng loading nếu không có userID
        return;
      }

      setUserInfoLoading(true);
      try {
        const data = await fetchUserInfo(userID);
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng ở đây
      } finally {
        setUserInfoLoading(false);
      }
    };

    if (userID) { // Chỉ gọi API nếu có userID
      getUserInfo();
    }
  }, [userID]);

  // Tải các khóa học đã mua và tất cả sản phẩm
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        setAllProducts(products);
        setPurchasedProductIds(getPurchasedProductIds());
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Lắng nghe thay đổi trong localStorage để đồng bộ hóa giao dịch mua
  useEffect(() => {
    const syncPurchases = () => {
      setPurchasedProductIds(getPurchasedProductIds());
    };
    window.addEventListener('storage', syncPurchases);
    return () => window.removeEventListener('storage', syncPurchases);
  }, []);

  // Điều hướng đến trang khóa học
  const handleCourseAccess = (course: Product) => {
    if (course.level) {
      navigate(`/course/${course.level.toLowerCase()}/lessons`);
    }
  };

  // Lấy các khóa học đã mua
  const courseProducts = allProducts.filter(p => p.type === ProductType.Course);
  const purchasedCourses = courseProducts.filter(course => purchasedProductIds.includes(course.id));
  const purchasedFlashcards = allProducts.filter(p =>
    p.type === ProductType.FlashcardCollection && purchasedProductIds.includes(p.id)
  );

  // Ví dụ nội dung khóa học (giữ nguyên)
  const courseContentExample: Record<string, { reading: number; listening: number; exercise: number; lessons: string[] }> = {
    "N5": { reading: 10, listening: 8, exercise: 20, lessons: ["Giới thiệu bản thân", "Gia đình", "Thời gian", "Địa điểm", "Mua sắm"] },
    "N4": { reading: 12, listening: 10, exercise: 25, lessons: ["Công việc", "Du lịch", "Sở thích", "Sức khỏe", "Giao tiếp cơ bản"] },
    "N3": { reading: 15, listening: 12, exercise: 30, lessons: ["Tin tức", "Thư tín", "Thảo luận", "Phỏng vấn", "Báo cáo"] },
    "N2": { reading: 18, listening: 15, exercise: 35, lessons: ["Bài báo chuyên sâu", "Hội nghị", "Phân tích", "Tranh luận", "Tổng hợp"] },
  };

  // Định dạng ngày tạo tài khoản (giữ nguyên)
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} năm trước`;
    }
  };

  // Component Skeleton cho việc tải nội dung
  const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
      <div className="w-full h-32 bg-gray-300 mb-4 rounded-lg"></div>
      <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-5/6"></div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="h-10 bg-gray-400 rounded-lg w-1/3"></div>
      </div>
    </div>
  );

  const ProfileInfoSkeleton: React.FC = () => (
    <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="rounded-full h-32 w-32 bg-gray-300 border-4 border-white shadow-lg"></div>
      </div>
      <div className="flex-1 text-center lg:text-left">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-3 mx-auto lg:mx-0"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-5 mx-auto lg:mx-0"></div>
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          <div className="h-7 bg-gray-200 rounded-full w-20"></div>
          <div className="h-7 bg-gray-200 rounded-full w-24"></div>
          <div className="h-7 bg-gray-200 rounded-full w-28"></div>
          <div className="h-7 bg-gray-200 rounded-full w-32"></div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Thẻ Tiêu đề Hồ sơ */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 transform transition-all duration-500 hover:scale-[1.01]">
          {userInfoLoading ? (
            <ProfileInfoSkeleton />
          ) : userInfo ? ( // Kiểm tra userInfo có tồn tại không
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="relative group">
                <img
                  src={ImgProfile} // Hoặc userInfo?.avatarUrl nếu có
                  alt="Profile"
                  className="rounded-full h-36 w-36 border-4 border-indigo-200 shadow-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaPencilAlt />
                </button> */}
              </div>

              <div className="flex-1 text-center lg:text-left mt-4 lg:mt-0">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {userInfo.Username}
                </h1>
                <p className="text-gray-600 text-lg mb-5 flex items-center justify-center lg:justify-start">
                  <FaEnvelope className="mr-2 text-gray-500" /> {userInfo.Email}
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <span className="flex items-center px-4 py-2 bg-sky-100 text-sky-800 rounded-full text-sm font-medium shadow-sm">
                    <FaIdCard className="mr-2" /> ID: {userID}
                  </span>
                  <span className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                    <FaGraduationCap className="mr-2" /> {purchasedCourses.length} khóa học
                  </span>
                  <span className="flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
                    <FaLayerGroup className="mr-2" /> {purchasedFlashcards.length} bộ flashcard
                  </span>
                  {userInfo.CreatedAt && (
                    <span className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium shadow-sm">
                      <FaCalendarAlt className="mr-2" /> Tham gia {formatCreatedDate(userInfo.CreatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">Không thể tải thông tin người dùng.</p>
              <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại sau hoặc kiểm tra kết nối của bạn.</p>
            </div>
          )}
        </div>

        {/* Thẻ Chi tiết Người dùng */}
        {userInfo && !userInfoLoading && ( // Chỉ hiển thị khi có userInfo và không loading
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 transform transition-all duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-indigo-200 pb-3">Thông tin tài khoản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: "Tên người dùng", value: userInfo?.Username, icon: <FaIdCard className="text-indigo-500 text-xl" /> },
                { label: "Địa chỉ email", value: userInfo?.Email, icon: <FaEnvelope className="text-indigo-500 text-xl" /> },
                { label: "ID người dùng", value: userID, icon: <FaIdCard className="text-indigo-500 text-xl" /> },
                { label: "Ngày tạo tài khoản", value: userInfo?.CreatedAt ? new Date(userInfo.CreatedAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Không có thông tin", icon: <FaCalendarAlt className="text-indigo-500 text-xl" /> },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    {item.icon}
                    <label className="ml-3 block text-md font-semibold text-gray-700">
                      {item.label}
                    </label>
                  </div>
                  <p className="text-lg text-gray-800 ml-8">{item.value || "Không có thông tin"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {userInfoLoading && !userInfo && ( // Skeleton cho thông tin tài khoản
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl p-5">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Phần Khóa học đã mua */}
        {loading && purchasedCourses.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Khóa học đã mua</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {!loading && purchasedCourses.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8 transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-8 border-b-2 border-green-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-800">Khóa học đã mua</h2>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                {purchasedCourses.length} khóa học
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-8"> {/* Thay đổi gap-6 thành gap-x-6 gap-y-8 */}
              {purchasedCourses.map((course) => {
                const content = course.level ? courseContentExample[course.level] : undefined;
                return (
                  <div
                    key={course.id}
                    className="bg-gradient-to-br from-sky-50 to-indigo-100 rounded-2xl p-6 border border-transparent hover:border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
                  >
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-40 object-cover mb-5 rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
                      />
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold shadow-sm">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis"> {/* Giới hạn chiều cao và thêm text-ellipsis */}
                      {course.description}
                    </p>

                    {content && (
                      <>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { icon: <FaBookOpen className="text-blue-500" />, label: "Bài đọc", value: content.reading, color: "blue" },
                            { icon: <FaHeadphones className="text-green-500" />, label: "Bài nghe", value: content.listening, color: "green" },
                            { icon: <FaPencilAlt className="text-purple-500" />, label: "Bài tập", value: content.exercise, color: "purple" },
                          ].map(item => (
                            <div key={item.label} className={`text-center bg-white rounded-lg p-3 shadow-sm border border-${item.color}-100`}>
                              <div className="flex justify-center text-xl mb-1">{item.icon}</div>
                              <div className={`text-lg font-bold text-${item.color}-600`}>{item.value}</div>
                              <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-5">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Nội dung chính:</div>
                          <div className="space-y-1.5">
                            {content.lessons.slice(0, 3).map((lesson, idx) => (
                              <div key={idx} className="text-sm text-gray-700 flex items-center group-hover:text-indigo-700 transition-colors">
                                <FaArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 rounded-full mr-2.5 transition-colors" />
                                {lesson}
                              </div>
                            ))}
                            {content.lessons.length > 3 && (
                              <div className="text-xs text-gray-500 mt-1 ml-5">
                                +{content.lessons.length - 3} bài học khác
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                      <div className="text-xl font-bold text-red-600">
                        {course.price.toLocaleString('vi-VN')}đ
                      </div>
                      <button
                        onClick={() => handleCourseAccess(course)}
                        className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition duration-200 transform hover:scale-105 shadow hover:shadow-md flex items-center"
                      >
                        Vào học <FaArrowRight className="ml-2 text-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phần Bộ Flashcard đã mua */}
        {loading && purchasedFlashcards.length === 0 && !purchasedCourses.length && ( // Chỉ hiện skeleton flashcard nếu không có course skeleton nào đang hiện
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Bộ Flashcard đã mua</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}
        {!loading && purchasedFlashcards.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-8 border-b-2 border-purple-200 pb-3">
              <h2 className="text-3xl font-bold text-gray-800">Bộ Flashcard đã mua</h2>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold text-sm">
                {purchasedFlashcards.length} bộ flashcard
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
              {purchasedFlashcards.map((flashcard) => (
                <div
                  key={flashcard.id}
                  className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-transparent hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
                >
                  {flashcard.imageUrl && (
                    <img
                      src={flashcard.imageUrl}
                      alt={flashcard.title}
                      className="w-full h-40 object-cover mb-5 rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{flashcard.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis">{flashcard.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                    <div className="text-xl font-bold text-red-600">
                      {flashcard.price.toLocaleString('vi-VN')}đ
                    </div>
                    <button className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition duration-200 transform hover:scale-105 shadow hover:shadow-md flex items-center">
                      Học ngay <FaArrowRight className="ml-2 text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trạng thái Trống */}
        {!loading && purchasedCourses.length === 0 && purchasedFlashcards.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center transform transition-all duration-500 hover:scale-[1.01]">
            <div className="text-7xl mb-6 text-indigo-500">📚</div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-3">Chưa có sản phẩm nào</h3>
            <p className="text-gray-600 text-lg mb-8">
              Có vẻ như bạn chưa sở hữu khóa học hay bộ flashcard nào. <br />Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Khám phá khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;