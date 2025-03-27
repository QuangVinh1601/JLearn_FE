import React, { useState } from "react";
import ImgProfile from "../../assets/images/profile-icon.png";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    fullName: "Alexa Rawles",
    gender: "",
    language: "",
    nickName: "",
    country: "",
    timeZone: "",
    email: "alexarawles@gmail.com",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(ImgProfile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert("Thông tin đã được cập nhật!");
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full ml-4">
      {/* Phần đầu */}
      <div className="w-full bg-gradient-to-r from-blue-200 to-yellow-100 p-4 flex items-center mb-4">
        <div className="flex flex-col items-center">
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full h-20 w-20 mb-4"
          />
          <label className="text-blue-500 hover:underline cursor-pointer">
            Thay đổi ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="ml-8">
          <h2 className="text-xl font-semibold">{profile.fullName}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`ml-auto ${isEditing ? "bg-green-500" : "bg-blue-500"} text-white py-2 px-4 rounded`}
        >
          {isEditing ? "Lưu" : "Chỉnh sửa"}
        </button>
      </div>

      {/* Phần nội dung chính */}
      <div className="w-full grid grid-cols-2 gap-4">
        {/* Cột trái */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên đầy đủ
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
            placeholder="Tên đầy đủ của bạn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giới tính
          </label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngôn ngữ
          </label>
          <select
            name="language"
            value={profile.language}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
          >
            <option value="">Chọn ngôn ngữ</option>
            <option value="english">Tiếng Anh</option>
            <option value="spanish">Tiếng Tây Ban Nha</option>
            <option value="french">Tiếng Pháp</option>
            <option value="german">Tiếng Đức</option>
          </select>
        </div>

        {/* Cột phải */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Biệt danh
          </label>
          <input
            type="text"
            name="nickName"
            value={profile.nickName}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
            placeholder="Biệt danh của bạn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quốc gia
          </label>
          <select
            name="country"
            value={profile.country}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
          >
            <option value="">Chọn quốc gia</option>
            <option value="usa">Hoa Kỳ</option>
            <option value="canada">Canada</option>
            <option value="uk">Vương quốc Anh</option>
            <option value="australia">Úc</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Múi giờ
          </label>
          <select
            name="timeZone"
            value={profile.timeZone}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100"
          >
            <option value="">Chọn múi giờ</option>
            <option value="utc-5">UTC-5 (Thời gian Đông)</option>
            <option value="utc+0">UTC+0 (London)</option>
            <option value="utc+1">UTC+1 (Paris)</option>
            <option value="utc+8">UTC+8 (Bắc Kinh)</option>
          </select>
        </div>
      </div>

      {/* Phần email */}
      <div className="w-full mt-4">
        <h3 className="text-lg font-semibold">Địa chỉ email của tôi</h3>
        <div className="flex items-center mt-2">
          <p className="text-gray-500">{profile.email}</p>
          <p className="text-gray-400 ml-2">1 tháng trước</p>
        </div>
        {/* <a href="#" className="text-blue-500 hover:underline mt-2 block">
          + Thêm Địa Chỉ Email
        </a> */}
      </div>
    </div>
  );
};

export default Profile;
