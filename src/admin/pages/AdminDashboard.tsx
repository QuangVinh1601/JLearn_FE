import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUsers, FaUserPlus, FaEye, FaMoneyBillWave } from "react-icons/fa";
import type { IconType } from "react-icons";
import { getAdminMetrics } from "../../api/apiClient"; // Giả sử đường dẫn đúng

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  value: number | string; // Cho phép value là string để hiển thị tiền tệ đã format
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
  growth?: string; // growth có thể không có
  growthColor?: string; // Màu cho growth text
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  growth,
  growthColor = "text-green-500", // Mặc định là xanh
}) => {
  const IconComponent = Icon as React.ComponentType<{ className?: string }>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 ${iconBgColor} rounded-full`}>
          <IconComponent className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
      {growth && (
        <div className="mt-4">
          <span className={`${growthColor} text-sm font-medium`}>{growth}</span>
        </div>
      )}
    </div>
  );
};

function calculateUserGrowthOverTime(
  userGrowth: { month: string; count: number }[],
) {
  return userGrowth.map((item, idx, arr) => {
    let growthPercentText = "-";
    if (idx > 0 && arr[idx - 1].count > 0) {
      const growth = ((item.count - arr[idx - 1].count) / arr[idx - 1].count) * 100;
      growthPercentText = `${growth > 0 ? '↑' : '↓'} ${Math.abs(growth).toFixed(0)}%`;
    } else if (idx === 0 && item.count > 0) {
      growthPercentText = ``; // No growth for the first month
    }
    return {
      ...item,
      growthPercentText: growthPercentText,
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
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const userGrowthData = calculateUserGrowthOverTime(metrics.userGrowth);

  const chartData = {
    labels: userGrowthData.map((item) => item.month),
    datasets: [
      {
        label: "Tăng trưởng người dùng",
        data: userGrowthData.map((item) => item.count),
        borderColor: "rgb(220, 38, 38)", // Tailwind red-600
        backgroundColor: "rgba(220, 38, 38, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(220, 38, 38)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(220, 38, 38)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
          color: '#4A5568',
        },
      },
      title: {
        display: true,
        text: "Biểu đồ tăng trưởng người dùng theo tháng",
        font: {
          size: 18,
          weight: "bold" as const, // Sửa lỗi weight
          family: "Inter, sans-serif",
        },
        color: '#1F2937',
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1F2937',
        bodyColor: '#4A5568',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' người dùng';
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Trang quản trị
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard
            title="Tổng người dùng"
            value={metrics.totalUsers.toLocaleString()}
            icon={() => FaUsers({ className: "w-7 h-7 text-red-600" })}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            growth="↑ 12% so với tháng trước"
            growthColor="text-green-600"
          />
          <MetricCard
            title="Người dùng mới"
            value={metrics.newUsers.toLocaleString()}
            icon={() => FaUserPlus({ className: "w-7 h-7 text-sky-600" })}
            iconBgColor="bg-sky-50"
            iconColor="text-sky-600"
            growth="↑ 8% so với tuần trước"
            growthColor="text-green-600"
          />
          <MetricCard
            title="Tổng lượt truy cập"
            value={(metrics.totalUsers * 3).toLocaleString()}
            icon={() => FaEye({ className: "w-7 h-7 text-emerald-600" })}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            growth="↑ 15% so với tháng trước"
            growthColor="text-green-600"
          />
          <MetricCard
            title="Tổng doanh thu"
            value={formatCurrency(metrics.totalRevenue)}
            icon={() => FaMoneyBillWave({ className: "w-7 h-7 text-amber-600" })}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            growth="↑ 20% so với tháng trước"
            growthColor="text-green-600"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <div className="h-[350px] md:h-[450px]"> {/* Điều chỉnh chiều cao cho phù hợp */}
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;