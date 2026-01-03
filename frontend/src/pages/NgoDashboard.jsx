import Header from "../compoenents/Header";
import DonationCard from "../compoenents/DonationCard";
import api from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const NgoDashboard = () => {
  const queryClient = useQueryClient();

  // ✅ FETCH DONATIONS
  const {
    data: donations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ngo-donations"],
    queryFn: async () => {
      const res = await api.get("/ngo/available-donations");
      return res.data;
    },
  });

  // ✅ ACCEPT DONATION
  const acceptDonationMutation = useMutation({
    mutationFn: (id) => api.post(`/ngo/accept-donation/${id}`),
    onSuccess: () => {
      alert("Donation accepted");
      // 🔄 Refetch donations automatically
      queryClient.invalidateQueries({ queryKey: ["ngo-donations"] });
    },
    onError: () => {
      alert("Failed to accept donation");
    },
  });

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white px-4 pb-10">
        <h2 className="text-2xl font-semibold mb-8 text-center pt-10">
          Available Donations Near You
        </h2>

        {isLoading ? (
          <p className="text-center text-indigo-200">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-400">
            Failed to load donations
          </p>
        ) : donations.length === 0 ? (
          <p className="text-center text-indigo-200">
            No donations available nearby
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {donations.map((d) => (
              <DonationCard
                key={d._id}
                restaurantName={d.restaurant.name}
                restaurantAddress={d.restaurant.address}
                restaurantContact={d.restaurant.contactNo}
                foodName={d.foodName}
                quantity={d.quantity}
                distanceKm={d.distanceKm}
                onAccept={() =>
                  acceptDonationMutation.mutate(d._id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NgoDashboard;