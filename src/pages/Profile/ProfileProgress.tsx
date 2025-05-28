import React from "react";
import {
  FaTrophy,
  FaFire,
  FaCalendarAlt,
  FaChartLine,
  FaStar,
  FaGraduationCap,
} from "react-icons/fa";

const ProfileProgress: React.FC = () => {
  // Mock data for progress
  const progressData = {
    studyStreak: 7,
    totalStudyTime: 120, // in hours
    coursesCompleted: 2,
    vocabularyLearned: 450,
    lessonsCompleted: 24,
    currentLevel: "N4",
    nextLevel: "N3",
    levelProgress: 65, // percentage
    weeklyGoal: 5, // hours
    weeklyProgress: 3.5, // hours
  };

  const achievements = [
    {
      id: 1,
      title: "Học viên mới",
      description: "Hoàn thành bài học đầu tiên",
      icon: "🎯",
      unlocked: true,
    },
    {
      id: 2,
      title: "Kiên trì",
      description: "Học liên tục 7 ngày",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: 3,
      title: "Từ vựng thành thạo",
      description: "Học 100 từ vựng",
      icon: "📚",
      unlocked: true,
    },
    {
      id: 4,
      title: "Chuyên gia ngữ pháp",
      description: "Hoàn thành 50 bài tập ngữ pháp",
      icon: "⚡",
      unlocked: false,
    },
    {
      id: 5,
      title: "Bậc thầy",
      description: "Đạt cấp độ N2",
      icon: "👑",
      unlocked: false,
    },
    {
      id: 6,
      title: "Siêu học viên",
      description: "Học liên tục 30 ngày",
      icon: "🌟",
      unlocked: false,
    },
  ];

  const weeklyActivity = [
    { day: "T2", hours: 1.5, target: 1 },
    { day: "T3", hours: 0.8, target: 1 },
    { day: "T4", hours: 1.2, target: 1 },
    { day: "T5", hours: 0, target: 1 },
    { day: "T6", hours: 0, target: 1 },
    { day: "T7", hours: 0, target: 1 },
    { day: "CN", hours: 0, target: 1 },
  ];

  const completedDays = weeklyActivity.filter(
    (day) => day.hours >= day.target,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-3xl shadow-xl p-6 md:p-8"
        style={{ backgroundColor: "#F5E6CA" }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tiến độ học tập
        </h1>
        <p className="text-gray-600">
          Theo dõi quá trình học tập và thành tích của bạn
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Chuỗi học tập</h3>
              <p className="text-3xl font-bold">{progressData.studyStreak}</p>
              <p className="text-red-100 text-sm">ngày liên tiếp</p>
            </div>
            {FaFire({ className: "text-4xl text-red-100" })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Tổng thời gian</h3>
              <p className="text-3xl font-bold">
                {progressData.totalStudyTime}h
              </p>
              <p className="text-green-100 text-sm">đã học</p>
            </div>
            {FaChartLine({ className: "text-4xl text-green-100" })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Khóa học</h3>
              <p className="text-3xl font-bold">
                {progressData.coursesCompleted}
              </p>
              <p className="text-red-100 text-sm">hoàn thành</p>
            </div>
            {FaGraduationCap({ className: "text-4xl text-red-100" })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Từ vựng</h3>
              <p className="text-3xl font-bold">
                {progressData.vocabularyLearned}
              </p>
              <p className="text-red-100 text-sm">từ đã học</p>
            </div>
            {FaStar({ className: "text-4xl text-red-100" })}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div
        className="rounded-3xl shadow-xl p-6 md:p-8"
        style={{ backgroundColor: "#F5E6CA" }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tiến độ cấp độ
        </h2>
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: "linear-gradient(135deg, #F0D5A8 0%, #E8C599 100%)",
            borderColor: "#D4B896",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                {progressData.currentLevel}
              </div>
              <span className="text-gray-400">→</span>
              <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold">
                {progressData.nextLevel}
              </div>
            </div>
            <span className="text-lg font-bold text-red-600">
              {progressData.levelProgress}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressData.levelProgress}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-600">
            Bạn đã hoàn thành {progressData.levelProgress}% để đạt cấp độ{" "}
            {progressData.nextLevel}. Hãy tiếp tục học tập để tiến bộ hơn nữa!
          </p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div
        className="rounded-3xl shadow-xl p-6 md:p-8"
        style={{ backgroundColor: "#F5E6CA" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Hoạt động tuần này
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {progressData.weeklyProgress}h
            </div>
            <div className="text-sm text-gray-500">
              / {progressData.weeklyGoal}h mục tiêu
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-6">
          {weeklyActivity.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {day.day}
              </div>
              <div className="relative">
                <div
                  className="w-full h-20 rounded-lg flex items-end p-1"
                  style={{ backgroundColor: "#F0D5A8" }}
                >
                  <div
                    className={`w-full rounded transition-all duration-500 ${
                      day.hours >= day.target
                        ? "bg-green-500"
                        : day.hours > 0
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                    }`}
                    style={{
                      height: `${Math.max((day.hours / day.target) * 100, 10)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-1 font-medium">
                  {day.hours > 0 ? `${day.hours}h` : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: "#F0D5A8" }}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tiến độ tuần này:</span>
            <span className="font-semibold">
              {completedDays}/7 ngày đạt mục tiêu
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedDays / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div
        className="rounded-3xl shadow-xl p-6 md:p-8"
        style={{ backgroundColor: "#F5E6CA" }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Thành tích đạt được
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                achievement.unlocked
                  ? "border-red-200 shadow-lg"
                  : "border-gray-200"
              }`}
              style={{
                background: achievement.unlocked
                  ? "linear-gradient(135deg, #F0D5A8 0%, #E8C599 100%)"
                  : "#F5F5F5",
              }}
            >
              <div className="text-center">
                <div
                  className={`text-4xl mb-3 ${achievement.unlocked ? "" : "grayscale opacity-50"}`}
                >
                  {achievement.icon}
                </div>
                <h3
                  className={`font-bold text-lg mb-2 ${
                    achievement.unlocked ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {achievement.title}
                </h3>
                <p
                  className={`text-sm ${
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-3">
                    {FaTrophy({ className: "inline text-red-500" })}
                    <span className="ml-1 text-xs font-medium text-red-700">
                      Đã mở khóa
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Calendar */}
      <div
        className="rounded-3xl shadow-xl p-6 md:p-8"
        style={{ backgroundColor: "#F5E6CA" }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch học tập</h2>
        <div className="text-center py-12">
          {FaCalendarAlt({ className: "text-6xl text-gray-300 mx-auto mb-4" })}
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Lịch học tập chi tiết
          </h3>
          <p className="text-gray-500">
            Tính năng này sẽ được cập nhật trong phiên bản tương lai
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgress;
