import Header from "../components/layout/Header";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
            <p className="text-gray-600">Role: {user?.role}</p>
            <p className="text-gray-600 mt-2">Manage your products from the Products page.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
