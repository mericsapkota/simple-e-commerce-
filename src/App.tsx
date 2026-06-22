import { useEffect } from "react";
import "./App.css";
import { useAuthStore } from "./store/authStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./pages/Login";
import { SignupForm } from "./pages/Signup";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { ProductsPage } from "./pages/ProductPages";
import AddOrderModal from "./components/orders/AddOrderModal";
import OrderPage from "./pages/OrderPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordForm";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Imagetestfile from "./pages/Imagetestfile";

import SongMatchApp from "./components/test";

function App() {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);
  //test
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* <Routes>
          <Route path="/" element={<SongMatchApp />} />
        </Routes> */}
      </BrowserRouter>
      <AddOrderModal />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
