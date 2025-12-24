const DonationCard = ({
  restaurantName,
  restaurantAddress,
  restaurantContact,
  foodName,
  quantity,
  distanceKm,
  onAccept,
}) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg text-white flex flex-col gap-2 hover:scale-[1.02] transition">
    <h3 className="font-semibold text-lg text-purple-300">
      {restaurantName}
    </h3>

    <p className="text-sm text-indigo-200">
      📍 {restaurantAddress}
    </p>

    <p className="text-sm text-indigo-200">
      📞 {restaurantContact}
    </p>

    <div className="border-t border-white/10 pt-2">
      <p className="text-sm">🍛 <span className="text-indigo-200">{foodName}</span></p>
      <p className="text-sm">📦 <span className="text-indigo-200">{quantity}</span></p>
    </div>

    <p className="text-sm font-medium text-green-400">
      {distanceKm} km away
    </p>

    <button
      onClick={onAccept}
      className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-semibold transition"
    >
      Accept Donation
    </button>
  </div>
);

export default DonationCard;