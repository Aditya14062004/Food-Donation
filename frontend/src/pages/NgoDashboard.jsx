import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../compoenents/Header";
import DonationCard from "../compoenents/DonationCard";

const NgoDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/ngo/available-donations");
        setDonations(res.data);
      } catch {
        alert("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const acceptDonation = async (id) => {
    try {
      await api.post(`/ngo/accept-donation/${id}`);
      alert("Donation accepted");
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to accept donation");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white px-4 pb-10">
        <h2 className="text-2xl font-semibold mb-8 text-center pt-10">
          Available Donations Near You
        </h2>

        {loading ? (
          <p className="text-center text-indigo-200">Loading...</p>
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
                onAccept={() => acceptDonation(d._id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NgoDashboard;