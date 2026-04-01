import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("User Registered Successfully 🎉");
      console.log(res.data);

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white shadow-lg rounded-2xl p-8 w-full max-w-md z-10"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Create Account
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
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
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-sm text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-blue-900 font-semibold mb-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;