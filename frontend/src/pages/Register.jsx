import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import image from '../assets/Logo.jpg';
import image2 from '../assets/logo2.png';
import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";

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
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-6 py-10 text-white lg:flex-row">
      <div className="flex w-full max-w-2xl flex-col justify-center lg:w-1/2">
        <p className="text-xs uppercase tracking-[0.34em] text-sky-200/80">Join Zuno</p>
        <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">
          Build a profile that feels like your own corner of the internet.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
          The refreshed onboarding gives the app a stronger first impression and turns the form into part of the brand experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Profile-ready avatars</span>
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Cleaner forms</span>
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">More premium layout</span>
        </div>
      <div className="mb-8 hidden items-center justify-center md:flex lg:mb-0 lg:mt-10">
        <HoverCard scaleFactor={1.4}>
          <h1 className="text-4xl font-black tracking-[0.2em]">ZUNO</h1>
          <img
            src={image}
            alt="Logo"
            className="mt-6 hidden max-w-xl rounded-[32px] border border-white/10 shadow-[0_30px_90px_rgba(2,6,23,0.45)] transition-transform duration-500 ease-in-out hover:translate-x-2 hover:translate-y-2 lg:block"
          />
        </HoverCard>
      </div>
      </div>

      <div className="glass-panel mx-4 w-full max-w-md flex-1 rounded-[32px] p-6">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-lg">
          <img src={image2} alt="logo" className="mb-6 w-full" />
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Create account</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Start your profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files[0])}
              className="w-full rounded-2xl border border-white/10 bg-white/8 p-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
            />

            <button
              type="submit"
              className="accent-button w-full rounded-2xl py-3 font-bold transition"
            >
              Sign Up
            </button>
          </form>

          <div className="my-5 flex items-center">
            <hr className="flex-1 border-white/10" />
            <span className="px-3 text-xs uppercase tracking-[0.22em] text-slate-500">OR</span>
            <hr className="flex-1 border-white/10" />
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold text-[#ff9c7c] hover:underline"
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
