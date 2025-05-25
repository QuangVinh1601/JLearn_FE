import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductType } from "../../types/purchase";
import { getPurchasedProductIds, fetchProducts } from "../CourseList";
import { FaArrowRight, FaSearch, FaFilter, FaLayerGroup, FaClock, FaStar } from 'react-icons/fa';

const ProfileFlashcards: React.FC = () => {
    const navigate = useNavigate();
    const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterLevel, setFilterLevel] = useState<string>("all");

    // Tải các sản phẩm đã mua
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

    // Lắng nghe thay đổi trong localStorage
    useEffect(() => {
        const syncPurchases = () => {
            setPurchasedProductIds(getPurchasedProductIds());
        };
        window.addEventListener('storage', syncPurchases);
        return () => window.removeEventListener('storage', syncPurchases);
    }, []);

    // Lấy các bộ flashcard đã mua
    const flashcardProducts = allProducts.filter(p => p.type === ProductType.FlashcardCollection);
    const purchasedFlashcards = flashcardProducts.filter(flashcard => purchasedProductIds.includes(flashcard.id));

    // Filter flashcards
    const filteredFlashcards = purchasedFlashcards.filter(flashcard => {
        const matchesSearch = flashcard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flashcard.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === "all" || flashcard.level === filterLevel;
        return matchesSearch && matchesLevel;
    });

    const handleFlashcardAccess = (flashcard: Product) => {
        navigate(`/collection`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bộ flashcard của tôi</h1>
                        <p className="text-gray-600">Ôn tập và ghi nhớ từ vựng một cách hiệu quả</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            {FaSearch({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
                            <input
                                type="text"
                                placeholder="Tìm kiếm bộ flashcard..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                            />
                        </div>

                        <div className="relative">
                            {FaFilter({ className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })}
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none"
                                style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                            >
                                <option value="all">Tất cả chủ đề</option>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Tổng bộ flashcard</h3>
                    <p className="text-3xl font-bold">{purchasedFlashcards.length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Từ đã học</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Từ cần ôn</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Điểm trung bình</h3>
                    <p className="text-3xl font-bold">--</p>
                </div>
            </div>

            {/* Empty State or Content */}
            {!loading && filteredFlashcards.length === 0 ? (
                <div className="rounded-3xl shadow-xl p-10 md:p-16 text-center" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="text-7xl mb-6">📚</div>
                    <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                        {searchTerm || filterLevel !== "all" ? "Không tìm thấy bộ flashcard" : "Chưa có bộ flashcard nào"}
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                        {searchTerm || filterLevel !== "all"
                            ? "Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc"
                            : "Flashcard giúp bạn ghi nhớ từ vựng hiệu quả. Hãy bắt đầu xây dựng vốn từ của mình!"
                        }
                    </p>
                    {(!searchTerm && filterLevel === "all") && (
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/course')}
                                className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                            >
                                Khám phá bộ flashcard
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Tất cả bộ flashcard</h2>
                    <div className="text-center py-8">
                        <p className="text-gray-600">Nội dung flashcard sẽ được hiển thị ở đây khi có dữ liệu.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileFlashcards;