import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faMousePointer,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import {
  getUserCount,
  getNewUserCount,
  get_AD_Click,
  getVisitor,
} from "../../services/api/authApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [monthlyNewUsers, setMonthlyNewUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountData = await getUserCount();
        setTotalUsers(userCountData.total_user || 0);

        const newUserCountData = await getNewUserCount(30);
        setNewUsers(newUserCountData.new_users_last_n_days || 0);

        const adClickData = await get_AD_Click();
        setTotalClicks(adClickData.AD_Click || 0);

        const visitorData = await getVisitor();
        setTotalVisitors(visitorData.Count_Visitor || 0);

        // Fetch monthly new users for the last 12 months
        const today = new Date();
        const monthlyDataPromises = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const days = Math.floor(
            (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
          );
          return getNewUserCount(days);
        });
        const monthlyData = await Promise.all(monthlyDataPromises);
        const cumulativeMonthlyNewUsers = monthlyData.map((data, index) => {
          const previousMonthData =
            index > 0 ? monthlyData[index - 1].new_users_last_n_days : 0;
          return (data.new_users_last_n_days || 0) - previousMonthData;
        });
        setMonthlyNewUsers(cumulativeMonthlyNewUsers.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: faUsers, label: "Total Users", value: totalUsers },
    { icon: faUserPlus, label: "New Users", value: newUsers },
    { icon: faMousePointer, label: "Total Visitors", value: totalVisitors },
    {
      icon: faDollarSign,
      label: "Total Revenue (VND)",
      value: totalClicks * 30,
    },
  ];

  // Calculate percentages safely
  const userGrowthPercentage = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;
  const revenuePercentage = totalClicks > 0 ? ((totalClicks * 30) / 10000) * 100 : 0;

  const doughnutData = (label: string, data: number, color: string) => ({
    labels: [label, "Other"],
    datasets: [
      {
        data: [data, Math.max(100 - data, 0)], // Ensure no negative values
        backgroundColor: [
          color,
          label === "User Growth" ? "#ccefe3" : "#ffcdcd",
        ],
        borderColor: [color, label === "User Growth" ? "#ccefe3" : "#ffcdcd"],
        borderWidth: 1,
      },
    ],
  });

  const userGrowthData = doughnutData(
    "User Growth",
    userGrowthPercentage,
    "#00B074",
  );
  const totalRevenueData = doughnutData(
    "Revenue",
    revenuePercentage,
    "#FF5B5B",
  );

  const lineData = {
    labels: Array.from({ length: 12 }, (_, i) =>
      new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString(
        "default",
        { month: "long" },
      ),
    ).reverse(),
    datasets: [
      {
        label: "New Users",
        data: monthlyNewUsers,
        fill: false,
        backgroundColor: "#00B074",
        borderColor: "#00B074",
        borderWidth: 2,
        pointBackgroundColor: "#00B074",
        pointBorderColor: "#00B074",
        pointHoverBackgroundColor: "#00B074",
        pointHoverBorderColor: "#00B074",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 5,
        hitRadius: 10,
        hoverRadius: 7,
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Tổng quan</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded-lg text-center shadow-md bg-white"
          >
            <FontAwesomeIcon
              icon={stat.icon}
              className="text-2xl sm:text-3xl mb-2 text-gray-800"
            />
            <h2 className="text-sm sm:text-base font-semibold text-gray-700">
              {stat.label}
            </h2>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Doughnut Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative bg-white p-4 rounded-lg shadow-md">
          <div className="h-48 sm:h-64">
            <Doughnut
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {userGrowthPercentage.toFixed(2)}%
            </p>
          </div>
          <h2 className="text-sm sm:text-base text-center mt-2 font-semibold text-gray-700">
            User Growth
          </h2>
        </div>
        <div className="relative bg-white p-4 rounded-lg shadow-md">
          <div className="h-48 sm:h-64">
            <Doughnut
              data={totalRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {revenuePercentage.toFixed(2)}%
            </p>
          </div>
          <h2 className="text-sm sm:text-base text-center mt-2 font-semibold text-gray-700">
            Return on Expectation
          </h2>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-4">
          User Growth Chart
        </h2>
        <div className="h-64 sm:h-80">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;