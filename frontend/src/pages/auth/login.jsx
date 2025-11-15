import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader";
import { setCredentials } from "../../redux/features/auth/authslice";
import { useLoginMutation } from "../../redux/api/user";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Login successful!");
    } catch (err) {
      // Error handling ko thoda robust kiya gaya hai
      toast.error(err?.data?.message || err.error || "Login failed.");
    }
  };

  // Nayi background image ka URL
  const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    // Main Container ko full screen height, center alignment aur background image denge
    <div 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
    >
      
      {/* Form Container: Background image ke upar dikhega */}
      <section 
        className="p-8 rounded-lg shadow-2xl backdrop-blur-sm bg-gray-900/70 max-w-lg w-full"
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Sign In</h1>

        <form onSubmit={submitHandler} className="w-full">
          
          {/* Email Field */}
          <div className="my-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Password Field */}
          <div className="my-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-3 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold tracking-wide py-3 rounded-lg hover:bg-teal-600 transition duration-200 mt-6 disabled:opacity-50"
          >
            {isLoading ? "Signing In ..." : "Sign In"}
          </button>
          
          {isLoading && <Loader />}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            New User?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
      
    </div>
  );
};

export default Login;