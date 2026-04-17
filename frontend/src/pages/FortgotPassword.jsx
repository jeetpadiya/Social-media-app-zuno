import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/Logo.jpg'
import image2 from '../assets/logo2.png'
import HoverCard from "@darenft/react-3d-hover-card"
import "@darenft/react-3d-hover-card/dist/style.css"
import axios from 'axios'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(`${backendUrl}/api/user/forgot-password`, { email }, { headers: { 'Content-Type': 'application/json' } });
            setSuccess(res.data.message || "Reset instructions sent");
            if (res.data.resetUrl) {
                console.log("Reset URL (for testing):", res.data.resetUrl);}
        } catch (err) {
            setError(err.response?.data?.message || "Unable to start password reset");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-6 py-10 text-white lg:flex-row">

            {/* LEFT SIDE */}
            <div className="mt-10 hidden md:flex md:items-center md:justify-start">
                <HoverCard scaleFactor={1.4}>
                    <h1 className="text-3xl font-black tracking-[0.2em] text-white">ZUNO</h1>
                    <img
                        src={image}
                        alt="Logo"
                        className="mt-6 hidden max-w-xl rounded-[32px] border border-white/10 shadow-[0_30px_90px_rgba(2,6,23,0.45)] transition-transform duration-500 ease-in-out hover:translate-x-2 hover:translate-y-2 lg:block"
                    />
                </HoverCard>
            </div>

            {/* RIGHT SIDE */}
            <div className="glass-panel mx-4 w-full max-w-md flex-1 rounded-[32px] gap-7 p-6">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-lg backdrop-blur-sm">

                    <img src={image2} alt="logo" className="mb-4 w-full" />

                    {/* HEADER */}
                    <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
                    <p className="text-sm text-gray-300 text-center mb-6">
                        Enter your email and we’ll send you a link to reset your password.
                    </p>

                    {/* ALERTS */}
                    {error && (
                        <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-300 border border-red-400/30">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-xl bg-green-500/20 p-3 text-sm text-green-300 border border-green-400/30">
                            {success}
                        </div>
                    )}

                    {/* FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="accent-button w-full rounded-2xl py-3 font-bold transition disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* EXTRA LINKS */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Remember your password?{" "}
                        <Link to="/login" className="text-sky-400 hover:underline">
                            Back to Login
                        </Link>
                    </div>

                    {/* HELP TEXT */}
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        Didn’t receive the email? Check your spam folder or try again.
                    </p>

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword