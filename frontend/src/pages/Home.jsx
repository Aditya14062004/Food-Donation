import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const Home = () => {
  const navigate = useNavigate();

  // 🔢 Mock stats
  const stats = useMemo(() => {
    return {
      donations: 1248,
      foodSavedKg: Math.floor(Math.random() * 5000) + 8000,
    };
  }, []);

  // 💬 Testimonials
  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "Restaurant Owner",
      message:
        "This platform helped us donate surplus food easily instead of wasting it. The process is smooth and impactful.",
    },
    {
      name: "Anita Verma",
      role: "NGO Coordinator",
      message:
        "We receive timely notifications for nearby donations. It has made food collection faster and more efficient.",
    },
    {
      name: "Siddharth Jain",
      role: "Volunteer",
      message:
        "Seeing excess food reach people in need is extremely fulfilling. This initiative truly makes a difference.",
    },
  ];

  return (
    /* 🌈 ONE COMMON BACKGROUND */
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">

      {/* ================= HERO ================= */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-block mb-6 px-4 py-1 rounded-full bg-purple-600/20 text-purple-300 text-sm tracking-wide">
          Food Donation Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Turn <span className="text-purple-400">Excess Food</span>
          <br />
          Into <span className="text-indigo-300">Hope</span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-indigo-200 mb-12">
          Connecting restaurants with NGOs to reduce food waste and
          feed communities in need. Every donation makes a difference.
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="bg-purple-600 hover:bg-purple-700 px-10 py-3 rounded-full font-semibold text-white shadow-lg transition"
        >
          Get Started
        </button>
      </section>

      {/* ================= STATS ================= */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-indigo-200 text-sm mb-2">
              Total Donations Completed
            </p>
            <p className="text-4xl font-bold text-purple-300">
              {stats.donations}+
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
            <p className="text-indigo-200 text-sm mb-2">
              Food Saved From Wastage
            </p>
            <p className="text-4xl font-bold text-indigo-300">
              {stats.foodSavedKg} kg
            </p>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="px-6 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 text-purple-300">
          Trusted by the Community
        </h2>

        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl hover:scale-105 transition"
            >
              <p className="text-indigo-200 italic mb-6 leading-relaxed">
                “{t.message}”
              </p>

              <div className="border-t border-white/20 pt-4">
                <p className="font-semibold text-purple-300">
                  {t.name}
                </p>
                <p className="text-sm text-indigo-300">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 px-6 py-12 text-sm text-indigo-300">
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 items-center">

          <div className="text-center sm:text-left">
            <p className="font-medium text-indigo-200 mb-2">
              Food Donation Platform
            </p>
            <p>
              🌍 Reduce Waste • 🤝 Empower NGOs • ❤️ Feed Lives
            </p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p>📧 contact.fooddonate@gmail.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Indore, Madhya Pradesh, India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;