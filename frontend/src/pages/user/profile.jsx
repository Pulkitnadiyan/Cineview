import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { useProfileMutation } from "../../redux/api/user";
import { setCredentials } from "../../redux/features/auth/authslice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    // Ensure userInfo exists before setting state
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          // Only send password if it's not empty
          password: password.trim() ? password : undefined, 
        }).unwrap();
        
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
        // Reset password fields after success
        setPassword('');
        setConfirmPassword('');
        
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    // Main Wrapper: Padding and Centering
    <div className="bg-gray-900 min-h-screen pt-20"> 
      <div className="container mx-auto p-4 max-w-lg">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Update Profile</h2>

          <form onSubmit={submitHandler}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password (optional)"
                className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="p-3 rounded-md w-full bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className="bg-teal-500 w-full font-semibold tracking-wide text-white py-3 px-4 rounded-lg hover:bg-teal-600 transition duration-200 disabled:opacity-50"
              >
                {loadingUpdateProfile ? "Updating..." : "Update Profile"}
              </button>
            </div>
            
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;