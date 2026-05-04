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
function App() {
  const { initializeAuth, isInitialized, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isAuthenticated]);
  //test
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
      <AddOrderModal />
    </>
  );
}

export default App;
