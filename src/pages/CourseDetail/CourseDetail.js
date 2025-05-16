import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
// Giả sử có service để lấy chi tiết khóa học và thực hiện mua
// import { getCourseDetails, purchaseCourse } from '../../services/courseService';
// import { getUserBalance, updateUserBalance } from '../../services/userService'; // Hoặc dùng context
// import { UserContext } from '../../contexts/UserContext'; // Ví dụ

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [userBalance, setUserBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPurchased, setIsPurchased] = useState(false); // Trạng thái khóa học đã mua hay chưa

    // const { user } = useContext(UserContext); // Ví dụ

    // Fetch course details and user balance
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                // --- Lấy chi tiết khóa học ---
                // const courseData = await getCourseDetails(courseId);
                // Giả lập dữ liệu khóa học
                const courseData = { 
                    id: courseId, 
                    title: `Khóa học ${courseId}`, 
                    description: 'Mô tả chi tiết về khóa học...', 
                    price: 150000, // Giá khóa học
                    // ... các thông tin khác
                    isOwned: false // Giả sử ban đầu chưa sở hữu
                };
                setCourse(courseData);
                setIsPurchased(courseData.isOwned); // Cập nhật trạng thái đã mua

                // --- Lấy số dư người dùng ---
                // if (user) { // Chỉ lấy nếu đã đăng nhập
                    // const balanceData = await getUserBalance();
                    const balanceData = 500000; // Giả lập số dư
                    setUserBalance(balanceData);
                // }

            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError('Không thể tải dữ liệu khóa học hoặc số dư.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [courseId /*, user*/]); // Dependency array

    const handlePurchase = async () => {
        if (!course || isLoading || isPurchased) return;

        if (userBalance < course.price) {
            alert('Số dư không đủ để mua khóa học này.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            // Gọi API để mua khóa học
            // await purchaseCourse(courseId); 

            // --- Cập nhật thành công ---
            alert('Mua khóa học thành công!');
            
            // Cập nhật lại số dư (ví dụ trừ tiền)
            const newBalance = userBalance - course.price;
            setUserBalance(newBalance); 
            setIsPurchased(true); // Đánh dấu đã mua

            // TODO: Cập nhật số dư ở Header. 
            // Cách tốt nhất là dùng Context API hoặc Redux để state số dư là global.
            // Nếu không, bạn có thể cần một cách khác để thông báo cho Header cập nhật,
            // ví dụ: dùng custom event hoặc callback prop nếu Header là cha.
            // Hoặc đơn giản là Header tự fetch lại balance định kỳ hoặc khi có action.

            // Ví dụ: Cập nhật số dư global nếu dùng service riêng
            // await updateUserBalance(newBalance); 

        } catch (err) {
            console.error("Purchase failed:", err);
            setError('Mua khóa học thất bại. Vui lòng thử lại.');
            alert('Mua khóa học thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !course) { // Hiển thị loading chỉ khi chưa có dữ liệu course
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!course) {
        return <div>Không tìm thấy khóa học.</div>;
    }

    return (
        <div className="course-detail-container">
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <p>Giá: {course.price.toLocaleString('vi-VN')} đ</p>
            
            {/* Hiển thị số dư hiện tại (tùy chọn) */}
            {/* <p>Số dư của bạn: {userBalance.toLocaleString('vi-VN')} đ</p> */}

            {/* Nút Mua khóa học */}
            {isPurchased ? (
                 <button disabled className="purchase-button purchased">Đã mua</button>
            ) : (
                 <button 
                    onClick={handlePurchase} 
                    disabled={isLoading || userBalance < course.price} 
                    className="purchase-button"
                 >
                    {isLoading ? 'Đang xử lý...' : 'Mua khóa học'}
                 </button>
            )}
             {userBalance < course.price && !isPurchased && <p style={{color: 'orange'}}>Không đủ số dư</p>}


            {/* ... other course content (lessons, reviews, etc.) ... */}
        </div>
    );
};

export default CourseDetail;
