import Header from "../compoenents/Header";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  // ✅ FETCH ADMIN STATS USING REACT QUERY
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/stats");
      return res.data;
    },
  });

  return (
    <>
      <Header />

      {/* FULL PAGE BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white px-4 pt-10">
        <h1 className="text-3xl font-semibold mb-10 text-center text-purple-200">
          Admin Dashboard
        </h1>

        {isLoading ? (
          <p className="text-center text-indigo-200">Loading stats...</p>
        ) : isError ? (
          <p className="text-center text-red-400">
            Failed to load admin stats
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <StatCard title="Restaurants" value={stats.restaurants} />
            <StatCard title="NGOs" value={stats.ngos} />
            <StatCard title="Total Donations" value={stats.donations} />
            <StatCard title="Accepted Donations" value={stats.accepted} />
          </div>
        )}
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