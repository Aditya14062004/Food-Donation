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

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Admin Dashboard
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
  <div className="bg-white shadow-lg rounded-lg p-6 text-center">
    <p className="text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2 text-blue-600">{value}</p>
  </div>
);

export default AdminDashboard;