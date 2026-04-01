import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ✅ Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ✅ Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md z-10"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Login
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>

          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Sign in
        </button>

        {/* Register Link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;