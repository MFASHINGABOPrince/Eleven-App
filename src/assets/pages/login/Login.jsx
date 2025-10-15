import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login,reset } from "@/assets/feature/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.reducer.auth
  );

  useEffect(() => {
    const redirectUser = async () => {
      if (isError) {
        toast.error(message || "Login failed");
      }

      if (isSuccess && user) {
        const role = user?.payload?.user?.roles?.[0]?.name;
        const firstName = user?.payload?.user?.firstName || "User";
        console.log("User role:", role);

        // Success toast with user's name
        toast.success(`Welcome back, ${firstName}!`);

        if (role === "ADMIN") {
          navigate(`/dashboard`);
        } else {
          toast.error(
            "Only admin users are allowed to log in."
          );
          dispatch(reset());
        }
      }
    };

    redirectUser();
  }, [isError, isSuccess, user, message, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing you in...");

      // Dispatch login action
      await dispatch(login(formData)).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error(err.message || message || "Something went wrong");
    }
  };

  // const handleForgotPassword = () => {
  //   toast.info("Please contact your administrator for password reset");
  // };
  const handleForgotPassword = () => {
  navigate("/forgot-password");
};

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in is not available yet");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* <img
          className="mx-auto h-[118px] w-[152px]"
          src={illustration}
          alt="Logo"
        /> */}
        <div className="text-center">
          <h2 className="text-[30px] font-semibold text-[#101828] mb-1">
            Log in to your account
          </h2>
          <p className="text-[#667085] text-[16px] font-normal mb-4">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-3 py-3 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-3 py-3 pr-10 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-colors"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-[14px] text-[#344054]"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[14px] text-[#288f5f] hover:text-green-500 font-medium transition-colors"
            >
              Forgot password
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-[16px] font-medium text-white bg-[#288f5f] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-[16px] font-medium text-[#344054] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-1 justify-center text-sm text-gray-500">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Please contact your administrator to create an account"
                )
              }
              className="text-sm text-[#288f5f] font-medium hover:text-green-500 transition-colors"
            >
              Contact Administrator.
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
