import { useState } from "react";
import api from "../api/api";
import Header from "../compoenents/Header";
import LocationCard from "../compoenents/LocationCard";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const RestaurantDashboard = () => {
  const queryClient = useQueryClient();

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");

  // ✅ FETCH NEAREST NGOs
  const {
    data: ngos = [],
    isLoading: ngosLoading,
    isError,
  } = useQuery({
    queryKey: ["nearest-ngos"],
    queryFn: async () => {
      const res = await api.get("/restaurant/nearest-ngos");
      return res.data;
    },
  });

  // ✅ SUBMIT DONATION
  const donateMutation = useMutation({
    mutationFn: (payload) => api.post("/restaurant/donate", payload),
    onSuccess: () => {
      alert("Donation added successfully");
      setFoodName("");
      setQuantity("");

      // optional: refresh NGOs or other dependent data
      queryClient.invalidateQueries({ queryKey: ["nearest-ngos"] });
    },
    onError: () => {
      alert("Failed to add donation");
    },
  });

  const submitDonation = () => {
    if (!foodName || !quantity) {
      alert("Please fill all fields");
      return;
    }

    donateMutation.mutate({ foodName, quantity });
  };

  return (
    <>
      <Header />

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
              disabled={donateMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {donateMutation.isPending ? "Submitting..." : "Add Donation"}
            </button>
          </div>
        </div>

        {/* NEARBY NGOs */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6 text-center text-purple-200">
            Nearby NGOs
          </h2>

          {ngosLoading ? (
            <p className="text-center text-indigo-200">Loading NGOs...</p>
          ) : isError ? (
            <p className="text-center text-red-400">
              Failed to load nearby NGOs
            </p>
          ) : ngos.length === 0 ? (
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