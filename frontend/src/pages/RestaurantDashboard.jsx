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

      {/* ADD DONATION */}
      <div className="max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Add Food Donation
        </h2>

        <div className="flex flex-col gap-4">
          <input
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Food Name (e.g. Veg Biryani)"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />

          <input
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Quantity (e.g. 20 plates)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button
            onClick={submitDonation}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Add Donation"}
          </button>
        </div>
      </div>

      {/* NEAREST NGOs */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Nearby NGOs
        </h2>

        {ngos.length === 0 ? (
          <p className="text-center text-gray-500">
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
    </>
  );
};

export default RestaurantDashboard;