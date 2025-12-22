const DonationCard = ({
  restaurantName,
  restaurantAddress,
  restaurantContact,
  foodName,
  quantity,
  distanceKm,
  onAccept,
}) => (
  <div className="bg-white p-4 shadow rounded">
    <h3 className="font-semibold">{restaurantName}</h3>
    <p>📍 {restaurantAddress}</p>
    <p>📞 {restaurantContact}</p>
    <p>🍛 {foodName}</p>
    <p>📦 {quantity}</p>
    <p className="text-blue-600">{distanceKm} km away</p>
    <button onClick={onAccept} className="bg-green-500 text-white mt-2 px-3 py-1 rounded">
      Accept Donation
    </button>
  </div>
);

export default DonationCard;