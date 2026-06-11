import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { BookAIcon, BookIcon, DollarSign, Package2Icon, TvIcon, User, User2Icon } from "lucide-react";
import { productAPI } from "../services/productApi";
import { authAPI } from "../services/authApi";
import { getAllOrders, getMyOrders } from "../services/orderApi";

interface DashboardStats {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  totalUsers?: number;
  pendingOrders?: number;
  completedOrders?: number;
}

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUserCount, setAllUserCount] = useState<number>(0);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const isAdmin = user?.role?.toLowerCase() === "admin";
      const [products, orders] = await Promise.all([
        productAPI.getProducts(),
        isAdmin ? getAllOrders() : getMyOrders(),
      ]);
      const setAllUserCount = isAdmin ? await authAPI.getAllUsers().then((users) => users.length) : 0;
      const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
      const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
      const completedOrders = orders.filter((order) => order.status === "DELIVERED").length;
      const uniqueUsers = setAllUserCount;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: uniqueUsers,
        pendingOrders,
        completedOrders,
      });
    } catch (err: any) {
      setError(err?.response?.errors?.[0]?.message || err?.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) {
      setLoading(false);
      setStats({});
      return;
    }
    fetchDashboardStats();
  }, [user?.id, user?.role]);

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-3xl opacity-30">{icon}</div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className=" bg-green-900  rounded-lg shadow p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}! </h1>
        <p className="text-blue-100">
          You are logged in as an <span className="font-semibold">Administrator</span>
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={<Package2Icon className="h-8 w-8" />}
          color="border-blue-500"
        />
        <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={<BookIcon />} color="border-green-500" />
        <StatCard
          title="Total Revenue"
          value={`NRP${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={<DollarSign className="h-8 w-8" />}
          color="border-yellow-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={<User2Icon className="h-8 w-8" />}
          color="border-purple-500"
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Pending Orders</span>
              </div>
              <span className="font-bold text-yellow-600">{stats.pendingOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Completed Orders</span>
              </div>
              <span className="font-bold text-green-600">{stats.completedOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Manage Products
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-t-2 border-gray-200 pt-3">
            <p className="text-gray-600 text-xs uppercase font-semibold">Role</p>
            <p className="text-gray-900 font-bold text-sm mt-1">{user?.role}</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-3">
            <p className="text-gray-600 text-xs uppercase font-semibold">Email</p>
            <p className="text-gray-900 font-bold text-sm mt-1 truncate">{user?.email}</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-3">
            <p className="text-gray-600 text-xs uppercase font-semibold">ID</p>
            <p className="text-gray-900 font-bold text-sm mt-1">{user?.id}</p>
          </div>
          <div className="border-t-2 border-gray-200 pt-3">
            <p className="text-gray-600 text-xs uppercase font-semibold">Status</p>
            <p className="text-green-600 font-bold text-sm mt-1">Active</p>
          </div>
        </div>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-emerald-600 rounded-lg shadow p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}! </h1>
        <p className="text-green-100">
          You are logged in as a <span className="font-semibold">Customer</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="My Orders"
          value={stats.totalOrders || 0}
          icon={<BookIcon className="h-8 w-8" />}
          color="border-blue-500"
        />
        <StatCard
          title="Total Spent"
          value={`NPR${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={<DollarSign className="h-8 w-8" />}
          color="border-green-500"
        />
        <StatCard
          title="Available Products"
          value={stats.totalProducts || 0}
          icon={<Package2Icon className="h-8 w-8" />}
          color="border-purple-500"
        />
      </div>

      {/* User Actions & Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Username</p>
              <p className="text-gray-900 font-semibold">{user?.username}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-gray-900 font-semibold truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Account Status</p>
              <p className="text-green-600 font-semibold">Active ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">💡 Tips & Recommendations</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Check out new arrivals in the Products section</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Track your orders in real-time</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Keep your profile information up to date</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && !loading && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
          ) : isAdmin ? (
            <AdminDashboard />
          ) : (
            <UserDashboard />
          )}
        </div>
      </div>
    </div>
  );
};
