import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../hooks/useUserInfo";
import ImgProfile from "../../assets/images/profile-icon.png";
import { FaCalendarAlt, FaEnvelope, FaIdCard, FaGraduationCap, FaLayerGroup, FaEdit, FaCrown } from 'react-icons/fa';
import { getPurchasedProductIds } from "../CourseList";

const ProfileOverview: React.FC = () => {
    const navigate = useNavigate();
    const { userInfo, loading, error, refreshUserInfo, clearCache, userID } = useUserInfo();
    const purchasedProductIds = getPurchasedProductIds();

    // Định dạng ngày tạo tài khoản
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

    // Tính toán số lượng khóa học và flashcard từ localStorage
    const courseCount = purchasedProductIds.length; // Simplified count
    const flashcardCount = 0; // Can be implemented based on your data structure

    // Handle error state
    if (error && !loading) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: 'white' }}>
                    <div className="text-center py-8">
                        <p className="text-xl text-red-600">Lỗi tải thông tin người dùng: {error}</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại sau hoặc kiểm tra kết nối của bạn.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Thẻ Tiêu đề Hồ sơ */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: 'white' }}>
                {loading ? (
                    <ProfileInfoSkeleton />
                ) : userInfo ? (
                    <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                        <div className="relative group">
                            <img
                                src={ImgProfile}
                                alt="Profile"
                                className="rounded-full h-36 w-36 border-4 shadow-xl object-cover transition-transform duration-300 group-hover:scale-105"
                                style={{ borderColor: '#D4B896' }}
                            />
                            <button className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                {FaEdit({ className: "text-sm" })}
                            </button>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start mb-3">
                                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 mr-3">
                                    {userInfo.username}
                                </h1>
                                <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full text-sm font-semibold flex items-center">
                                    {FaCrown({ className: "mr-1 text-xs" })}
                                    Học viên
                                </span>
                            </div>

                            <p className="text-gray-600 text-lg mb-5 flex items-center justify-center lg:justify-start">
                                {FaEnvelope({ className: "mr-2 text-gray-500" })} {userInfo.email}
                            </p>

                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <span className="flex items-center px-4 py-2 text-red-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: 'white' }}>
                                    {FaIdCard({ className: "mr-2" })} ID: {userID}
                                </span>
                                <span className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                                    {FaGraduationCap({ className: "mr-2" })} {courseCount} khóa học
                                </span>
                                <span className="flex items-center px-4 py-2 text-red-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: 'white' }}>
                                    {FaLayerGroup({ className: "mr-2" })} {flashcardCount} bộ flashcard
                                </span>
                                {userInfo.createdAt && (
                                    <span className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                                        {FaCalendarAlt({ className: "mr-2" })} Tham gia {formatCreatedDate(userInfo.createdAt)}
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
            {userInfo && !loading && (
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: 'white' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Thông tin tài khoản</h2>
                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center"
                        >
                            {FaEdit({ className: "mr-2" })}
                            Chỉnh sửa
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {[
                            { label: "Tên người dùng", value: userInfo?.username, icon: FaIdCard({ className: "text-red-500 text-xl" }) },
                            { label: "Địa chỉ email", value: userInfo?.email, icon: FaEnvelope({ className: "text-red-500 text-xl" }) },
                            { label: "ID người dùng", value: userID, icon: FaIdCard({ className: "text-red-500 text-xl" }) },
                            { label: "Ngày tạo tài khoản", value: userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : "Không có thông tin", icon: FaCalendarAlt({ className: "text-red-500 text-xl" }) },
                        ].map(item => (
                            <div key={item.label} className="rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border" style={{ backgroundColor: 'white', borderColor: '#D4B896' }}>
                                <div className="flex items-center mb-3">
                                    {item.icon}
                                    <label className="ml-3 block text-md font-semibold text-gray-700">
                                        {item.label}
                                    </label>
                                </div>
                                <p className="text-lg text-gray-800 ml-8 font-medium">{item.value || "Không có thông tin"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: 'white' }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Truy cập nhanh</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Khóa học của tôi", description: "Xem các khóa học đã mua", path: "/profile/courses", icon: "🎓", color: "from-red-500 to-red-600" },
                        { title: "Bộ flashcard", description: "Ôn tập với flashcard", path: "/profile/flashcards", icon: "📚", color: "from-red-400 to-red-500" },
                        { title: "Video học tập", description: "Xem video bài giảng", path: "/profile/videos", icon: "🎥", color: "from-red-600 to-red-700" },
                        { title: "Tiến độ học tập", description: "Theo dõi quá trình học", path: "/profile/progress", icon: "📊", color: "from-red-500 to-red-700" }
                    ].map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left group`}
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm opacity-90">{item.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;