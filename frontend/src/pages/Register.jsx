import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import image from '../assets/Logo.jpg';
import image2 from '../assets/logo2.png';
import microsoft from '../assets/microsoft.jpg';
import play from '../assets/play.png';
import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const[avatarFile,setAvatarFile] =useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // add your own error handling/UI feedback here
      return alert("Passwords do not match");
    }
    await handleRegister(
      formData.username,
      formData.email,
      formData.password,
      avatarFile

    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen text-white p-6">
      {/* Left side - Logo with HoverCard */}
      <div className="md:flex md:w-1/2 items-center justify-center mb-8 lg:mb-0">
        <HoverCard scaleFactor={1.4}>
          <h1 className="text-4xl font-bold">Zuno</h1>
          <img
            src={image}
            alt="Logo"
            className="max-w-2xl mt-6 rotate-3 border rounded-lg border-gray-700 transition-transform duration-500 ease-in-out transform hover:translate-x-2 shadow-xl shadow-black hover:translate-y-2 hidden lg:block"
          />
        </HoverCard>
      </div>

      {/* Right side - Registration Form */}
      <div className="mx-4 w-full max-w-md flex-1 rounded-2xl border border-gray-500">
        <div className="rounded-lg p-6 shadow-lg bg-gray-800">
          <img src={image2} alt="logo" className="mb-6 w-full" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files[0])}
              className="w-full p-2 bg-white rounded-lg text-gray-900"
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-700" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          {/* <div className="py-3 rounded-lg flex items-center justify-evenly">
            <FaFacebook className="text-3xl cursor-pointer" />
            <FaGoogle className="text-3xl cursor-pointer" />
            <FaApple className="text-3xl cursor-pointer" />
          </div> */}

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        </div>

        {/* <div className="mt-4 bg-[#251469e8] text-gray-400 rounded-lg p-4 text-center">
          <p>Get the app</p>
          <div className="flex justify-center space-x-4 mt-4">
            <img
              src={play}
              alt="google play"
              className="w-28 md:w-32 h-10 cursor-pointer"
            />
            <img
              src={microsoft}
              alt="microsoft store"
              className="w-28 md:w-32 h-10 cursor-pointer"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Register;
