const LocationCard = ({ title, subtitle, contactNo, distanceKm }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg text-white hover:scale-[1.02] transition">
    <h3 className="font-semibold text-lg mb-1 text-purple-300">
      {title}
    </h3>

    <p className="text-sm text-indigo-200 mb-1">
      📍 {subtitle}
    </p>

    <p className="text-sm font-medium text-green-400">
      {distanceKm} km away
    </p>
  </div>
);

export default LocationCard;