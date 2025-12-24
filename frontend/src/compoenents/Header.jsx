import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Admin Dashboard";
    if (role === "ngo") return "NGO Dashboard";
    if (role === "restaurant") return "Restaurant Dashboard";
    return "Dashboard";
  };

  return (
    <header className="w-full bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 border-b border-white/10 px-6 py-4 flex items-center justify-between text-white">
      {/* LEFT */}
      <h1 className="text-lg sm:text-xl font-bold text-purple-300">
        Food Donation Platform
      </h1>

      {/* CENTER */}
      <p className="hidden sm:block text-indigo-200 font-medium">
        {getRoleLabel()}
      </p>

      {/* RIGHT */}
      <button
        onClick={logoutHandler}
        className="bg-red-600/80 hover:bg-red-700 transition px-4 py-1.5 rounded-lg text-sm font-semibold"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;