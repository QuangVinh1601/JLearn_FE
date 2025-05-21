import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUsers, FaUserPlus, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { getAdminMetrics } from '../../api/apiClient';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardMetrics {
  totalUsers: number;
  newUsers: number;
  totalRevenue: number;
  userGrowth: {
    month: string;
    count: number;
  }[];
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
  growth: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  growth,
}) => {
  const IconComponent = Icon as React.ComponentType<{ className?: string }>;

  const formatValue = (value: number) => {
    if (title === "Total Revenue") {
      // Format as Vietnamese currency with 2 decimal places
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    console.log("value", value);
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
        </div>
        <div className={`p-3 ${iconBgColor} rounded-full`}>
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-500 text-sm font-medium">{growth}</span>
      </div>
    </div>
  );
};

// Hàm tính toán tăng trưởng người dùng theo thời gian (có thể mở rộng logic nếu cần)
function calculateUserGrowthOverTime(userGrowth: { month: string; count: number }[]) {
  // Ví dụ: trả về đúng dữ liệu, hoặc có thể tính toán phần trăm tăng trưởng giữa các tháng
  return userGrowth.map((item, idx, arr) => {
    let growth = 0;
    if (idx > 0 && arr[idx - 1].count > 0) {
      growth = ((item.count - arr[idx - 1].count) / arr[idx - 1].count) * 100;
    }
    return {
      ...item,
      growthPercent: growth,
    };
  });
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    newUsers: 0,
    totalRevenue: 0,
    userGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminMetrics();
        // console.log("Received metrics data:", data);
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Debug metrics changes
  useEffect(() => {
    // console.log("Current metrics state:", metrics);
  }, [metrics]);

  // Sử dụng hàm tính toán tăng trưởng người dùng
  const userGrowthData = calculateUserGrowthOverTime(metrics.userGrowth);
  // console.log("Metrics: ", metrics);
  // console.log("User Growth Data: ", userGrowthData);
  // Chart configuration
  const chartData = {
    labels: userGrowthData.map(item => item.month),
    datasets: [
      {
        label: 'User Growth',
        data: userGrowthData.map(item => item.count),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Growth Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers}
            icon={FaUsers}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
            growth="↑ 12% from last month"
          />

          <MetricCard
            title="New Users"
            value={metrics.newUsers}
            icon={FaUserPlus}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            growth="↑ 8% from last week"
          />

          <MetricCard
            title="Total Visitors"
            value={metrics.totalUsers * 3} // Assuming each user visits 3 times on average
            icon={FaEye}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            growth="↑ 15% from last month"
          />

          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue}
            icon={FaMoneyBillWave}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            growth="↑ 20% from last month"
          />
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
