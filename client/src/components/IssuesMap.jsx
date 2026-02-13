import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function IssuesMap({ issues }) {
  const center = issues.length ? [issues[0].latitude, issues[0].longitude] : [20.5937, 78.9629];

  return (
    <div className="card map-card floating-card">
      <h3>Environmental Issues Map</h3>
      <p className="map-hint">All markers are rendered from local frontend state for design-time testing.</p>
      <MapContainer center={center} zoom={issues.length ? 11 : 4} scrollWheelZoom style={{ height: '360px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={markerIcon}>
            <Popup>
              <strong>{issue.title}</strong>
              <p>{issue.description}</p>
              <small>
                {issue.category} · {issue.severity} · by {issue.reportedBy}
              </small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
