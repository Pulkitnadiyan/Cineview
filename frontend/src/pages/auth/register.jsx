import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader";
import { setCredentials } from "../../redux/features/auth/authslice";
import { useRegisterMutation } from "../../redux/api/user";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered.");
      } catch (err) {
        console.log(err);
        // Error handling mein dhyan dein ki error.data.message available ho
        toast.error(err.data?.message || "Registration failed."); 
      }
    }
  };

  const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    // Main Container ko full screen height aur background image denge
    <div 
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
    >
      
      {/* Form Container (upar ki taraf flex hta diya hai) */}
      <div 
        className="p-8 rounded-lg shadow-2xl backdrop-blur-sm bg-gray-900/70 max-w-lg w-full"
        // Form ko background image ke upar center mein laane ke liye styling
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Register</h1>

        <form onSubmit={submitHandler} className="w-full">
          
          {/* Name Field */}
          <div className="my-4">
            <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 p-3 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {/* Email Field */}
          <div className="my-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email Address</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
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
          
          {/* Confirm Password Field */}
          <div className="my-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-3 border border-gray-700 rounded w-full bg-gray-800 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold tracking-wide py-3 rounded-lg hover:bg-teal-600 transition duration-200 mt-6 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};
export default Register;