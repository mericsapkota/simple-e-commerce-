import { Link, useNavigation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";

const Header = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
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
              <Link to="/orders" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                Orders
              </Link>
            </div>
            <button onClick={logout} className="text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
