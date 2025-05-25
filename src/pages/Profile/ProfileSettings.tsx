import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaBell, FaGlobe, FaEye, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useUserInfo } from "../../hooks/useUserInfo";

const ProfileSettings: React.FC = () => {
    const navigate = useNavigate();
    const { userInfo, loading, error: userInfoError, userID, refreshUserInfo } = useUserInfo();
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValues, setTempValues] = useState<any>({});

    // Settings state
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            studyReminders: true,
            courseUpdates: true,
            achievements: false
        },
        privacy: {
            profileVisibility: 'public',
            showProgress: true,
            showAchievements: true
        },
        learning: {
            language: 'vi',
            autoPlay: false,
            subtitles: true,
            speed: 1.0
        }
    });

    const handleEdit = (field: string, currentValue: any) => {
        setEditingField(field);
        setTempValues({ [field]: currentValue });
    };

    const handleSave = async (field: string) => {
        // Here you would typically save to API
        console.log(`Saving ${field}:`, tempValues[field]);
        setEditingField(null);
        setTempValues({});

        // Refresh user info after save if it's a user info field
        if (field === 'username') {
            await refreshUserInfo();
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setTempValues({});
    };

    const handleSettingChange = (category: string, setting: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [setting]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl shadow-xl p-6 md:p-8 animate-pulse" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (userInfoError) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                    <div className="text-center py-8">
                        <p className="text-xl text-red-600">Lỗi tải thông tin người dùng: {userInfoError}</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại sau hoặc kiểm tra kết nối của bạn.</p>
                        <button
                            onClick={refreshUserInfo}
                            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt tài khoản</h1>
                <p className="text-gray-600">Quản lý thông tin cá nhân và tùy chọn của bạn</p>
            </div>

            {/* Profile Information */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex items-center mb-6">
                    <FaUser className="text-red-500 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                </div>

                {userInfo ? (
                    <div className="space-y-6">
                        {/* Username */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                                {editingField === 'username' ? (
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="text"
                                            value={tempValues.username || ''}
                                            onChange={(e) => setTempValues({ ...tempValues, username: e.target.value })}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                            style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                                        />
                                        <button
                                            onClick={() => handleSave('username')}
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            <FaSave />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-800 font-medium">{userInfo.Username}</span>
                                        <button
                                            onClick={() => handleEdit('username', userInfo.Username)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-800 font-medium">{userInfo.Email}</span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Đã xác thực</span>
                                </div>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID người dùng</label>
                                <span className="text-gray-800 font-medium font-mono">{userID}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Không thể tải thông tin người dùng</p>
                    </div>
                )}
            </div>

            {/* Security Settings */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex items-center mb-6">
                    <FaLock className="text-green-500 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Bảo mật</h2>
                </div>

                <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 rounded-lg hover:shadow-md transition-colors" style={{ backgroundColor: '#F0D5A8' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800">Đổi mật khẩu</h3>
                                <p className="text-sm text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản</p>
                            </div>
                            <span className="text-gray-400">→</span>
                        </div>
                    </button>

                    <button className="w-full text-left px-4 py-3 rounded-lg hover:shadow-md transition-colors" style={{ backgroundColor: '#F0D5A8' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-800">Xác thực 2 lớp</h3>
                                <p className="text-sm text-gray-600">Tăng cường bảo mật cho tài khoản</p>
                            </div>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Sắp có</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex items-center mb-6">
                    <FaBell className="text-yellow-500 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Thông báo</h2>
                </div>

                <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                                <h3 className="font-medium text-gray-800">
                                    {key === 'email' && 'Thông báo qua email'}
                                    {key === 'push' && 'Thông báo đẩy'}
                                    {key === 'studyReminders' && 'Nhắc nhở học tập'}
                                    {key === 'courseUpdates' && 'Cập nhật khóa học'}
                                    {key === 'achievements' && 'Thành tích mới'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {key === 'email' && 'Nhận thông báo qua email'}
                                    {key === 'push' && 'Nhận thông báo đẩy trên thiết bị'}
                                    {key === 'studyReminders' && 'Nhận nhắc nhở để duy trì thói quen học'}
                                    {key === 'courseUpdates' && 'Nhận thông báo về nội dung khóa học mới'}
                                    {key === 'achievements' && 'Nhận thông báo khi đạt thành tích mới'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex items-center mb-6">
                    <FaEye className="text-purple-500 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Quyền riêng tư</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Hiển thị hồ sơ</label>
                        <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                        >
                            <option value="public">Công khai</option>
                            <option value="private">Riêng tư</option>
                            <option value="friends">Chỉ bạn bè</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-800">Hiển thị tiến độ học tập</h3>
                            <p className="text-sm text-gray-600">Cho phép người khác xem tiến độ học tập của bạn</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.privacy.showProgress}
                                onChange={(e) => handleSettingChange('privacy', 'showProgress', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-800">Hiển thị thành tích</h3>
                            <p className="text-sm text-gray-600">Cho phép người khác xem các thành tích của bạn</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.privacy.showAchievements}
                                onChange={(e) => handleSettingChange('privacy', 'showAchievements', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Learning Preferences */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8" style={{ backgroundColor: '#F5E6CA' }}>
                <div className="flex items-center mb-6">
                    <FaGlobe className="text-indigo-500 text-xl mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Tùy chọn học tập</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Ngôn ngữ giao diện</label>
                        <select
                            value={settings.learning.language}
                            onChange={(e) => handleSettingChange('learning', 'language', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                        >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tốc độ phát video</label>
                        <select
                            value={settings.learning.speed}
                            onChange={(e) => handleSettingChange('learning', 'speed', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            style={{ borderColor: '#D4B896', backgroundColor: '#F0D5A8' }}
                        >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1.0}>1.0x (Bình thường)</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2.0}>2.0x</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-800">Tự động phát video tiếp theo</h3>
                            <p className="text-sm text-gray-600">Tự động chuyển sang video tiếp theo khi hoàn thành</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.learning.autoPlay}
                                onChange={(e) => handleSettingChange('learning', 'autoPlay', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-800">Hiển thị phụ đề</h3>
                            <p className="text-sm text-gray-600">Luôn hiển thị phụ đề khi xem video</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.learning.subtitles}
                                onChange={(e) => handleSettingChange('learning', 'subtitles', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-3xl shadow-xl p-6 md:p-8 border border-red-200" style={{ backgroundColor: '#F5E6CA' }}>
                <h2 className="text-2xl font-bold text-red-600 mb-6">Vùng nguy hiểm</h2>
                <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-red-800">Xóa tài khoản</h3>
                                <p className="text-sm text-red-600">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</p>
                            </div>
                            <span className="text-red-400">→</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings; 