import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { api } from "./api.js";

// تتبع مندوب الطلبية على الخريطة (يظهر فقط والطلبية "في الطريق")، يتحدث كل 15 ثانية
const driverIcon = L.divIcon({
  className: "",
  html: '<div style="font-size:22px;background:#ff6a1a;border:3px solid #fff;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.35)">🚚</div>',
  iconSize: [38, 38], iconAnchor: [19, 19],
});
const destIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
});

function Fit({ points }) {
  const map = useMap();
  const key = points.map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`).join("|");
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 16 });
    else if (points.length === 1) map.setView(points[0], 15);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function ago(sec) {
  if (sec < 45) return "الآن";
  const m = Math.round(sec / 60);
  return m <= 1 ? "قبل دقيقة" : `قبل ${m} دقائق`;
}

export default function TrackDriver({ orderId }) {
  const [info, setInfo] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const load = () => api.trackOrder(orderId).then((d) => { if (!stop) { setInfo(d); setFailed(false); } }).catch(() => { if (!stop) setFailed(true); });
    load();
    const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 15000);
    return () => { stop = true; clearInterval(t); };
  }, [orderId]);

  if (!info || !info.active) return null;
  const loc = info.location;
  const dest = info.destination;
  const points = [loc && [loc.lat, loc.lng], dest && [dest.lat, dest.lng]].filter(Boolean);

  return (
    <div className="detail-card" style={{ marginBottom: 12, padding: 12 }}>
      <b>🚚 مندوبك في الطريق{info.driver?.name ? ` — ${info.driver.name}` : ""}</b>
      {loc ? (
        <>
          <p className="hint" style={{ margin: "4px 0 8px" }}>آخر تحديث للموقع: {ago(loc.ageSec)}</p>
          <div style={{ height: 260, borderRadius: 14, overflow: "hidden" }}>
            <MapContainer center={points[0]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[loc.lat, loc.lng]} icon={driverIcon} />
              {dest && <Marker position={[dest.lat, dest.lng]} icon={destIcon} />}
              <Fit points={points} />
            </MapContainer>
          </div>
        </>
      ) : (
        <p className="hint" style={{ margin: "6px 0 0" }}>
          {failed ? "تعذّر تحديث الموقع، جارٍ المحاولة…" : "المندوب في الطريق إليك — الموقع المباشر لسه ما وصلش، يظهر هنا خلال لحظات."}
        </p>
      )}
      {info.driver?.phone && (
        <a className="link-btn" style={{ display: "inline-block", marginTop: 8 }} href={`tel:${info.driver.phone}`}>📞 اتصل بالمندوب</a>
      )}
    </div>
  );
}
