import React, { useState } from "react";

const Header = () => {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <header className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <div className="flex space-x-2">
          <select className="border p-2 rounded">
            <option>All-time</option>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
          </select>
          <select className="border p-2 rounded">
            <option>All</option>
            <option>People</option>
          </select>
          <select className="border p-2 rounded">
            <option>All</option>
            <option>Topic</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        {["active", "total", "new", "access", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab === "active" && "Tài khoản hoạt động"}
            {tab === "total" && "Tổng số tài khoản"}
            {tab === "new" && "Tài khoản mới"}
            {tab === "access" && "Lượng truy cập"}
            {tab === "monthly" && "Biểu đồ tháng"}
          </button>
        ))}
      </div>
    </header>
  );
};

const ProgressBar = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className={`h-2.5 rounded-full ${color}`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded shadow-md">
    <h2 className="text-lg font-bold mb-2">{title}</h2>
    {children}
  </div>
);

const AdminDashboard = () => {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card title="Tài khoản hoạt động">123</Card>
        <Card title="Tổng số tài khoản">3,298</Card>
        <Card title="Tài khoản mới">24</Card>
        <Card title="Video xem nhiều nhất">
          <div className="space-y-2">
            <div>
              <span>Food Safety: 74% Correct</span>
              <ProgressBar percentage={74} color="bg-orange-500" />
            </div>
            <div>
              <span>Compliance Basics Procedures: 52% Correct</span>
              <ProgressBar percentage={52} color="bg-pink-500" />
            </div>
            <div>
              <span>Company Networking: 38% Correct</span>
              <ProgressBar percentage={38} color="bg-pink-300" />
            </div>
          </div>
        </Card>
        <Card title="Bài học đã hoàn thành">
          <div className="space-y-2">
            <div>
              <span>Covid Protocols: 95% Correct</span>
              <ProgressBar percentage={95} color="bg-green-500" />
            </div>
            <div>
              <span>Cyber Security Basics: 92% Correct</span>
              <ProgressBar percentage={92} color="bg-green-500" />
            </div>
            <div>
              <span>Social Media Policies: 80% Correct</span>
              <ProgressBar percentage={80} color="bg-green-500" />
            </div>
          </div>
        </Card>
        <Card title="Tài khoản truy cập nhiều nhất">
          <div className="space-y-2">
            {[
              "Jesse Thomas",
              "Thilsal Mathiyazhagan",
              "Helen Chuang",
              "Lura Silverman",
            ].map((name) => (
              <div key={name} className="flex items-center space-x-2">
                <img
                  src="/placeholder-avatar.jpg"
                  alt={name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{name}: 637 Points, 98% Correct</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Flashcard đang được ưu tiên">
          <div className="space-y-2">
            {[
              "Automation test",
              "Test Group",
              "Sales Leadership",
              "Northeast Region",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between">
                <span>
                  {item}: 52 views, Rank {index + 1}
                </span>
                <span className="text-green-500">▲</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
