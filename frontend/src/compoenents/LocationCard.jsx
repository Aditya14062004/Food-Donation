const LocationCard = ({ title, subtitle, contactNo, distanceKm }) => (
  <div className="bg-white p-4 shadow rounded">
    <h3 className="font-semibold">{title}</h3>
    <p>📍 {subtitle}</p>
    <p>📞 {contactNo}</p>
    <p className="text-blue-600">{distanceKm} km away</p>
  </div>
);

export default LocationCard;
