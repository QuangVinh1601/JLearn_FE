import React, { createContext, useState, ReactNode } from 'react';

export const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState({
        balance: 0, // ví dụ số dư mặc định 1 triệu VNĐ
    });

    // Thêm trạng thái modal
    const [depositModalVisible, setDepositModalVisible] = useState(false);

    const deposit = (amount: number) => {
        setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    };

    const purchaseCourse = (price: number) => {
        // Đảm bảo kiểm tra số dư và chỉ trừ tiền khi đủ
        if (user.balance >= price) {
            setUser(prev => ({ ...prev, balance: prev.balance - price }));
            return true;
        }
        return false;
    };

    const openDepositModal = () => {
        setDepositModalVisible(true);
    };

    const closeDepositModal = () => {
        setDepositModalVisible(false);
    };

    // Hàm reset dữ liệu local và các khóa học đã mua
    const resetUserData = () => {
        // Xóa các khóa học đã mua khỏi localStorage
        localStorage.removeItem("purchasedCourses");
        // Nếu có các key khác liên quan đến user, xóa tại đây
        // localStorage.removeItem("user");
        // Reset state user nếu cần
        setUser({
            balance: 1000000,
            // ...reset các trường khác nếu có...
        });
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            deposit,
            purchaseCourse,
            openDepositModal,
            closeDepositModal,
            depositModalVisible,
            resetUserData, // expose hàm reset
        }}>
            {children}
        </UserContext.Provider>
    );
};