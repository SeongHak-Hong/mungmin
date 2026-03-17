'use client';

import { NaverMap, Marker, InfoWindow, useNavermaps, Container as MapDiv } from 'react-naver-maps';
import { useEffect, useState } from 'react';

export default function StoreMap({ stores, selectedStore }) {
  const navermaps = useNavermaps();
  const [map, setMap] = useState(null);
  const [openInfoWindowId, setOpenInfoWindowId] = useState(null);

  // Default center (Seoul)
  const defaultCenter = new navermaps.LatLng(37.5665, 126.9780);
  
  // Calculate center based on selected store or first store if available
  const initialCenter = stores && stores.length > 0 && stores[0].lat && stores[0].lng
    ? new navermaps.LatLng(parseFloat(stores[0].lat), parseFloat(stores[0].lng))
    : defaultCenter;

  // Handle selected store changes (fly to)
  useEffect(() => {
    if (map && selectedStore && selectedStore.lat && selectedStore.lng) {
      const destination = new navermaps.LatLng(parseFloat(selectedStore.lat), parseFloat(selectedStore.lng));
      map.panTo(destination, { duration: 500 });
      setOpenInfoWindowId(selectedStore.id);
    }
  }, [selectedStore, map, navermaps]);

  // Handle map resize (needed for dynamic layouts)
  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        navermaps.Event.trigger(map, 'resize');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [map, navermaps]);

  return (
    <MapDiv style={{ width: '100%', height: '100%' }}>
      <NaverMap
        defaultCenter={initialCenter}
        defaultZoom={11}
        onInit={setMap}
      >
        {stores && stores.map((store) => {
          if (!store.lat || !store.lng) return null;
          
          const position = new navermaps.LatLng(parseFloat(store.lat), parseFloat(store.lng));
          const isOpen = openInfoWindowId === store.id;

          return (
            <div key={store.id}>
              <Marker
                position={position}
                onClick={() => setOpenInfoWindowId(store.id)}
              />
              {isOpen && (
                <InfoWindow
                  position={position}
                  onCloseClick={() => setOpenInfoWindowId(null)}
                >
                  <div style={{ padding: '12px', minWidth: '150px' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold', color: '#111' }}>
                      {store.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                      {store.address}
                    </p>
                    {store.phone && (
                      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                        📞 {store.phone}
                      </p>
                    )}
                    {store.hours && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                        🕒 {store.hours}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </div>
          );
        })}
      </NaverMap>
    </MapDiv>
  );
}
