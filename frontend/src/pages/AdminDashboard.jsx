import React, { useEffect, useState } from "react";
import Header from "../compoenents/Header";
import api from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    ngos: 0,
    donations: 0,
    accepted: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Header />

      {/* FULL PAGE BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white px-4 pt-10">
        <h1 className="text-3xl font-semibold mb-10 text-center text-purple-200">
          Admin Dashboard
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <StatCard title="Restaurants" value={stats.restaurants} />
          <StatCard title="NGOs" value={stats.ngos} />
          <StatCard title="Total Donations" value={stats.donations} />
          <StatCard title="Accepted Donations" value={stats.accepted} />
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center shadow-xl hover:scale-105 transition">
    <p className="text-indigo-200 text-sm">{title}</p>
    <p className="text-4xl font-bold mt-2 text-purple-300">
      {value}
    </p>
  </div>
);

export default AdminDashboard;