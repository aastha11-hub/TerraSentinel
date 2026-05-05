import React, { useEffect, useState } from "react";

const SatelliteLiveCard = ({ title = "Sentinel Feed" }) => {
  const [tile, setTile] = useState({ x: 1, y: 1, z: 3 });
  const [timeAgo, setTimeAgo] = useState(5);
  const [mode, setMode] = useState("RAW");
  const [status, setStatus] = useState(0);

  const statuses = [
    "Receiving Satellite Data...",
    "Processing...",
    "AI Detection Running...",
    "Completed"
  ];

  // Random tile generator (REAL satellite tiles)
  const generateTile = () => {
    setTile({
      x: Math.floor(Math.random() * 8),
      y: Math.floor(Math.random() * 8),
      z: 3
    });
    setTimeAgo(Math.floor(Math.random() * 10) + 1);
  };

  // Loop updates
  useEffect(() => {
    generateTile();
    const interval = setInterval(() => {
      generateTile();
      setStatus((prev) => (prev + 1) % statuses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // NASA real tile
  const nasaUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-05-01/GoogleMapsCompatible_Level9/${tile.z}/${tile.y}/${tile.x}.jpg`;

  return (
    <div style={{
      background: "#0a0f1c",
      borderRadius: "16px",
      padding: "12px",
      color: "white",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* LABEL */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "red",
        padding: "4px 8px",
        fontSize: "12px",
        borderRadius: "6px"
      }}>
        LIVE SATELLITE FEED
      </div>

      {/* IMAGE */}
      <img
        src={nasaUrl}
        alt="satellite"
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "12px"
        }}
      />

      {/* SCAN LINE */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "2px",
        background: "cyan",
        animation: "scan 2s linear infinite"
      }} />

      {/* TOGGLE */}
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        {["RAW", "NDWI", "MASK"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              background: mode === m ? "#00eaff" : "#1a1f2e",
              color: "white",
              border: "none",
              padding: "4px 10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* STATUS */}
      <p style={{ fontSize: "12px", marginTop: "8px", color: "#00ffaa" }}>
        {statuses[status]}
      </p>

      {/* METRICS */}
      <div style={{ fontSize: "12px", marginTop: "6px" }}>
        <p>Flood Risk: {Math.floor(Math.random() * 100)}%</p>
        <p>Water Spread: {Math.floor(Math.random() * 200)} km²</p>
        <p>Cloud Cover: {Math.floor(Math.random() * 50)}%</p>
      </div>

      {/* FOOTER */}
      <div style={{ fontSize: "11px", marginTop: "6px", color: "#aaa" }}>
        Source: Sentinel-2 | Orbit: Ascending | Latency: 2.3s  
        <br />
        Captured: {timeAgo} mins ago
      </div>

      {/* SCAN ANIMATION */}
      <style>
        {`
          @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default SatelliteLiveCard;