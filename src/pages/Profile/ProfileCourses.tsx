import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductType } from "../../types/purchase";
import { getPurchasedProductIds, fetchProducts } from "../CourseList";
import { FaBookOpen, FaHeadphones, FaPencilAlt, FaArrowRight, FaFilter, FaSearch } from 'react-icons/fa';

const ProfileCourses: React.FC = () => {
    const navigate = useNavigate();
    const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterLevel, setFilterLevel] = useState<string>("all");

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

    // Filter courses based on search term and level
    const filteredCourses = purchasedCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === "all" || course.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    // Ví dụ nội dung khóa học
    const courseContentExample: Record<string, { reading: number; listening: number; exercise: number; lessons: string[] }> = {
        "N5": { reading: 10, listening: 8, exercise: 20, lessons: ["Giới thiệu bản thân", "Gia đình", "Thời gian", "Địa điểm", "Mua sắm"] },
        "N4": { reading: 12, listening: 10, exercise: 25, lessons: ["Công việc", "Du lịch", "Sở thích", "Sức khỏe", "Giao tiếp cơ bản"] },
        "N3": { reading: 15, listening: 12, exercise: 30, lessons: ["Tin tức", "Thư tín", "Thảo luận", "Phỏng vấn", "Báo cáo"] },
        "N2": { reading: 18, listening: 15, exercise: 35, lessons: ["Bài báo chuyên sâu", "Hội nghị", "Phân tích", "Tranh luận", "Tổng hợp"] },
    };

    // Component Skeleton cho việc tải nội dung
    const SkeletonCard: React.FC = () => (
        <div className="rounded-xl p-5 border animate-pulse" style={{ backgroundColor: '#F0D5A8', borderColor: '#D4B896' }}>
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Khóa học của tôi</h1>
                        <p className="text-gray-600">Quản lý và truy cập vào các khóa học đã mua</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            {FaSearch({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            {FaFilter({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none"
                                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                            >
                                <option value="all">Tất cả cấp độ</option>
                                <option value="N5">N5</option>
                                <option value="N4">N4</option>
                                <option value="N3">N3</option>
                                <option value="N2">N2</option>
                                <option value="N1">N1</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Tổng khóa học</h3>
                    <p className="text-3xl font-bold">{purchasedCourses.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Đã hoàn thành</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Đang học</h3>
                    <p className="text-3xl font-bold">{purchasedCourses.length}</p>
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {searchTerm || filterLevel !== "all" ? `Kết quả tìm kiếm (${filteredCourses.length})` : "Tất cả khóa học"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const content = course.level ? courseContentExample[course.level] : undefined;
                            return (
                                <div
                                    key={course.id}
                                    className="rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                                    style={{
                                        background: 'linear-gradient(135deg, #F0D5A8 0%, #E8C599 100%)',
                                        borderColor: '#D4B896'
                                    }}
                                >
                                    {course.imageUrl && (
                                        <img
                                            src={course.imageUrl}
                                            alt={course.title}
                                            className="w-full h-40 object-cover mb-5 rounded-xl shadow-md group-hover:opacity-90 transition-opacity"
                                        />
                                    )}
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-xl text-gray-800 group-hover:text-red-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold shadow-sm">
                                            {course.level}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">
                                        {course.description}
                                    </p>

                                    {content && (
                                        <>
                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                {[
                                                    { icon: FaBookOpen({ className: "text-red-500" }), label: "Bài đọc", value: content.reading, color: "red" },
                                                    { icon: FaHeadphones({ className: "text-green-500" }), label: "Bài nghe", value: content.listening, color: "green" },
                                                    { icon: FaPencilAlt({ className: "text-red-400" }), label: "Bài tập", value: content.exercise, color: "red" },
                                                ].map(item => (
                                                    <div key={item.label} className="text-center rounded-lg p-3 shadow-sm border" style={{ backgroundColor: '#F5E6CA', borderColor: '#D4B896' }}>
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
                                                        <div key={idx} className="text-sm text-gray-700 flex items-center group-hover:text-red-700 transition-colors">
                                                            {FaArrowRight({ className: "w-3 h-3 text-red-400 group-hover:text-red-600 rounded-full mr-2.5 transition-colors" })}
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
                                            Vào học {FaArrowRight({ className: "ml-2 text-xs" })}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="rounded-3xl shadow-xl p-10 md:p-16 text-center" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="text-7xl mb-6">🎓</div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                        {searchTerm || filterLevel !== "all" ? "Không tìm thấy khóa học" : "Chưa có khóa học nào"}
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                        {searchTerm || filterLevel !== "all"
                            ? "Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc"
                            : "Có vẻ như bạn chưa sở hữu khóa học nào. Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!"
                        }
                    </p>
                    {(!searchTerm && filterLevel === "all") && (
                        <button
                            onClick={() => navigate('/course')}
                            className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                        >
                            Khám phá khóa học
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileCourses;