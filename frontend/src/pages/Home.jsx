import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 flex items-center justify-center text-white">
      <div className="max-w-3xl text-center px-6">
        {/* Badge */}
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-600/20 text-purple-300 text-sm">
          Food Donation Platform
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Turn <span className="text-purple-400">Excess Food</span> <br />
          Into <span className="text-indigo-300">Hope</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl mb-10 text-indigo-200">
          Connecting restaurants with NGOs to reduce food waste and
          feed communities in need.  
          Every donation makes a difference.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/auth")}
            className="border border-indigo-300 px-8 py-3 rounded-full font-semibold text-indigo-200 hover:bg-indigo-300 hover:text-indigo-900 transition"
          >
            Get Started
          </button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-indigo-300">
          🌍 Reduce Waste &nbsp; • &nbsp; 🤝 Empower NGOs &nbsp; • &nbsp; ❤️ Feed Lives
        </p>
      </div>
    </div>
  );
};

export default Home;