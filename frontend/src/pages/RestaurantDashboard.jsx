import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../compoenents/Header";
import LocationCard from "../compoenents/LocationCard";

const RestaurantDashboard = () => {
  const [ngos, setNgos] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch nearest NGOs
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await api.get("/restaurant/nearest-ngos");
        setNgos(res.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load nearby NGOs");
      }
    };
    fetchNgos();
  }, []);

  // Submit donation
  const submitDonation = async () => {
    if (!foodName || !quantity) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/restaurant/donate", { foodName, quantity });
      alert("Donation added successfully");
      setFoodName("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      alert("Failed to add donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {/* FULL PAGE BACKGROUND */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white pt-10 px-4">

        {/* ADD DONATION CARD */}
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-200">
            Add Food Donation
          </h2>

          <div className="flex flex-col gap-4">
            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Food Name (e.g. Veg Biryani)"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />

            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Quantity (e.g. 20 plates)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button
              onClick={submitDonation}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Add Donation"}
            </button>
          </div>
        </div>

        {/* NEARBY NGOs */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 text-center text-purple-200">
            Nearby NGOs
          </h2>

          {ngos.length === 0 ? (
            <p className="text-center text-indigo-200">
              No NGOs found nearby
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ngos.map((ngo) => (
                <LocationCard
                  key={ngo._id}
                  title={ngo.name}
                  subtitle={ngo.address}
                  contactNo={ngo.contactNo}
                  distanceKm={ngo.distanceKm}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default RestaurantDashboard;