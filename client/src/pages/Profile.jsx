import React, { useEffect, useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";
import { toast } from "react-hot-toast";

/* Animation presets */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-10">
        <p className="text-slate-500">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-rose-600">
        Unable to load user profile
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl space-y-6"
    >
      {/* Header */}
      <motion.header
        variants={item}
        initial="hidden"
        animate="show"
        className="rounded-3xl border border-slate-200 bg-white p-6"
      >
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">
          Manage your personal information
        </p>
      </motion.header>

      {/* Profile Card */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6"
      >
        {/* User header */}
        <motion.div variants={item} className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100"
          >
            <User size={28} className="text-indigo-600" />
          </motion.div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user.name}
            </h2>
            <p className="text-sm uppercase tracking-wider text-slate-500">
              {user.role}
            </p>
          </div>
        </motion.div>

        {/* Fields */}
        <motion.div variants={container} className="space-y-4">
          <ProfileField icon={Mail} label="Email" value={user.email} />
          <ProfileField icon={Shield} label="Role" value={user.role} />
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <motion.div
    variants={item}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
  >
    <Icon size={18} className="text-indigo-600" />
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </motion.div>
);

export default Profile;
