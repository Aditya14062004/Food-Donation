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
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* LEFT */}
      <h1 className="text-xl font-semibold text-blue-600">
        Food Donation Platform
      </h1>

      {/* CENTER */}
      <p className="text-gray-600 font-medium">
        {getRoleLabel()}
      </p>

      {/* RIGHT */}
      <button
        onClick={logoutHandler}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;