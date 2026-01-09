import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, ShieldCheck, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await login(form);
      toast.success("Login successful 🎉");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-indigo-50 to-white">
      {/* HEADER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-center space-y-6 p-8">
            <ShieldCheck size={52} className="text-emerald-500" />
            <h2 className="text-4xl font-bold leading-tight text-gray-900">
              Summaries, slides & Q&A in minutes
            </h2>
            <div className="space-y-4">
              {[
                "Upload audio, video, slides, or transcripts with one button",
                "Generate short, detailed, and bullet summaries simultaneously",
                "Auto-produce MCQs, short answers, and long answers for exams",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 text-emerald-400" size={18} />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-2 border border-gray-100 transition-transform duration-200 hover:scale-[1.01]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Welcome back
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Login to Smart Notes
            </h2>
            <p className="text-sm text-gray-500">
              Access your account and start summarizing smarter
            </p>

            <div className="space-y-4">
              <InputField
                label="Email Address"
                icon={<Mail size={18} />}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@college.edu"
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Create free account
              </Link>
            </p>
          </form>
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

export default Login;
