import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900">
                Dashboard
              </Link>
              <Link to="/products" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Products
              </Link>
            </div>
            <button onClick={logout} className="text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </nav>

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
