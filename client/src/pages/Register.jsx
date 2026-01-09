import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Mail, GraduationCap as GraduationCapIcon, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!form.name) nextErrors.name = "Name is required";
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    if (!form.confirmPassword)
      nextErrors.confirmPassword = "Confirm password is required";
    if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Registration successful 🎉");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-indigo-50 to-white">
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Link to="/" className="flex items-center gap-3 w-max">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm">
            <GraduationCap className="text-indigo-600" size={22} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
              Smart Notes
            </p>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Lecture Lab
            </h1>
          </div>
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-1 overflow-auto">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 p-8">
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Students, researchers, and teaching teams create notes faster.
            </h2>
            <div className="space-y-4">
              <FeatureCard text="Unlimited lecture uploads (audio, video, slides, or text)" />
              <FeatureCard text="Templates for sprints, revisions, and exams" />
              <FeatureCard text="Export-ready: PDF, Notion, Obsidian, Markdown" />
            </div>
          </div>

          {/* REGISTER FORM */}
          <div className="flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 space-y-6 border border-gray-100 transition-transform duration-200 hover:scale-[1.01]"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  Get Started
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create your account
                </h2>
                <p className="text-sm text-gray-500">
                  Start summarizing your lectures smarter
                </p>
              </div>

              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  icon={<UserRound size={18} />}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                />
                <InputField
                  label="Email Address"
                  icon={<Mail size={18} />}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your@email.com"
                />
                <InputField
                  label="Password"
                  icon={<Lock size={18} />}
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                />
                <InputField
                  label="Confirm Password"
                  icon={<Lock size={18} />}
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={
                  !form.password ||
                  !form.confirmPassword ||
                  form.password !== form.confirmPassword ||
                  !form.name ||
                  !form.email
                }
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create free account
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* REUSABLE INPUT COMPONENT */
const InputField = ({ label, icon, name, type = "text", value, onChange, error, placeholder = "" }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-400">{icon}</span>
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
      />
    </div>
    {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
  </div>
);

/* FEATURE CARD COMPONENT */
const FeatureCard = ({ text }) => (
  <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-indigo-500"></div>
      <span className="text-gray-700">{text}</span>
    </div>
  </div>
);

export default Register;
