'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Component to handle map view updates
function MapUpdater({ selectedStore, defaultCenter }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStore && selectedStore.lat && selectedStore.lng) {
      map.flyTo(
        [parseFloat(selectedStore.lat), parseFloat(selectedStore.lng)],
        16, // Zoom level when zooming to a specific store
        { duration: 1.5 } // Smooth animation duration in seconds
      );
    }
  }, [selectedStore, map, defaultCenter]);

  return null;
}

export default function StoreMap({ stores, selectedStore }) {
  // Default center (Seoul)
  const defaultCenter = [37.5665, 126.9780];
  
  // Calculate center based on first store if available
  const center = stores && stores.length > 0 && stores[0].lat && stores[0].lng
    ? [parseFloat(stores[0].lat), parseFloat(stores[0].lng)]
    : defaultCenter;

  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    (async function initLeaflet() {
      const L = await import('leaflet');
      const icon = L.divIcon({
        className: 'custom-mungmin-marker',
        html: `<div style="transform: translate(-50%, -100%);"><svg width="40" height="40" viewBox="0 0 24 24" fill="#2BC2BD" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg></div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -40]
      });
      L.Marker.prototype.options.icon = icon;
      setCustomIcon(icon);
    })();

    // This is needed to force a re-render/resize when the map container is first painted
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={11} 
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <MapUpdater selectedStore={selectedStore} defaultCenter={center} />
      
      {stores && stores.map((store) => {
        if (!store.lat || !store.lng) return null;
        
        if (!customIcon) return null;

        return (
          <Marker 
            key={store.id} 
            position={[parseFloat(store.lat), parseFloat(store.lng)]}
            icon={customIcon} /* 강제로 커스텀 아이콘 속성 주입 */
            ref={(ref) => {
              if (ref && selectedStore?.id === store.id) {
                ref.openPopup();
              }
            }}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold' }}>{store.name}</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>{store.address}</p>
                {store.phone && <p style={{ margin: '0', fontSize: '12px' }}>📞 {store.phone}</p>}
                {store.hours && <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>🕒 {store.hours}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
