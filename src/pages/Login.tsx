import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../services/authApi";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  // const { googleAuth, setGoogleAuth } = useAuthStore((state) => ({
  //   googleAuth: state.googleAuth,
  //   setGoogleAuth: state.setGoogleAuth,
  // }));
  const googleAuth = useAuthStore((state) => state.googleAuth);
  const setGoogleAuth = useAuthStore((state) => state.setGoogleAuth);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const getRole = useAuthStore((state) => state.getRole);
  useEffect(() => {
    if (isLoggedIn) {
      getRole();
      navigate("/dashboard");
    }
  }, [getRole, isLoggedIn, navigate]);

  useEffect(() => {
    if (googleAuth) {
      axios.get("");
    }
  }, [googleAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);

      const parseToken = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log(parseToken, "parse token");
      login(
        { id: parseToken.sub, username: parseToken.username, email: parseToken.email, role: parseToken.role },
        response.access_token,
      );
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign In</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="text-center underline cursor-pointer" onClick={() => navigate("/signup")}>
          Register
        </div>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            setGoogleAuth(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
};
